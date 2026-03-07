import os
import sqlite3
import uuid
from datetime import datetime
from functools import wraps
from io import BytesIO

from flask import Flask, abort, g, redirect, render_template, request, send_file, send_from_directory, session, url_for
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import secure_filename

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
ALLOWED_EXTENSIONS = {"pdf", "doc", "docx", "xls", "xlsx", "png", "jpg", "jpeg", "zip"}

def resolve_runtime_paths():
    # Vercel serverless has a read-only project filesystem; keep mutable files in a writable root.
    preferred_root = os.environ.get("APP_DATA_DIR", BASE_DIR)
    fallback_root = "/tmp/myqs_data"
    candidate_roots = [preferred_root]
    if preferred_root != fallback_root:
        candidate_roots.append(fallback_root)

    last_error = None
    for root in candidate_roots:
        try:
            uploads_root = os.path.join(root, "uploads")
            task_folder = os.path.join(uploads_root, "tasks")
            submission_folder = os.path.join(uploads_root, "submissions")
            os.makedirs(task_folder, exist_ok=True)
            os.makedirs(submission_folder, exist_ok=True)
            return os.path.join(root, "myqs.db"), task_folder, submission_folder
        except OSError as exc:
            last_error = exc

    raise RuntimeError(f"Unable to create writable runtime directories: {last_error}")


DB_PATH, TASK_UPLOAD_FOLDER, SUBMISSION_UPLOAD_FOLDER = resolve_runtime_paths()

app = Flask(__name__)
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "dev-secret-key-change-me")
app.config["DATABASE"] = os.environ.get("DB_PATH", DB_PATH)
app.config["TASK_UPLOAD_FOLDER"] = TASK_UPLOAD_FOLDER
app.config["SUBMISSION_UPLOAD_FOLDER"] = SUBMISSION_UPLOAD_FOLDER
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024
app.config["QS_REGISTRATION_FEE"] = os.environ.get("QS_REGISTRATION_FEE", "100")
app.config["QS_PAYMENT_LINK"] = os.environ.get("QS_PAYMENT_LINK", "#")
app.config["SUPPORT_LINK"] = os.environ.get("SUPPORT_LINK", "mailto:support@myqs.com")

EVENT_LABELS = {
    "job_posted": "Client posted a new job",
    "job_claimed": "QS claimed the job",
    "job_assigned": "Admin assigned/reassigned a QS",
    "qs_offer": "QS submitted an offer to admin",
    "admin_offer_to_client": "Admin sent an offer to client",
    "client_counter": "Client sent a counter offer",
    "client_accept": "Client accepted admin offer",
    "final_agreement": "Admin finalized client amount",
    "submission_uploaded": "QS uploaded deliverable",
    "submission_approved": "Admin approved deliverable",
    "submission_rejected": "Admin rejected deliverable",
    "client_paid": "Client payment marked received",
    "qs_paid": "QS payment marked complete",
    "invoice_generated": "Invoice generated for client",
}


def get_db():
    if "db" not in g:
        g.db = sqlite3.connect(app.config["DATABASE"])
        g.db.row_factory = sqlite3.Row
    return g.db


@app.teardown_appcontext
def close_db(_error):
    db = g.pop("db", None)
    if db is not None:
        db.close()


def init_db():
    db = get_db()
    db.executescript(
        """
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            role TEXT NOT NULL CHECK (role IN ('client', 'qs', 'admin')),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS jobs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            client_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            file_path TEXT,
            status TEXT NOT NULL DEFAULT 'open',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (client_id) REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS job_negotiation_events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            job_id INTEGER NOT NULL,
            actor_role TEXT NOT NULL CHECK (actor_role IN ('client', 'qs', 'admin')),
            actor_id INTEGER NOT NULL,
            event_type TEXT NOT NULL,
            amount REAL,
            note TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (job_id) REFERENCES jobs(id),
            FOREIGN KEY (actor_id) REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS job_agreements (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            job_id INTEGER NOT NULL UNIQUE,
            final_amount REAL NOT NULL,
            client_amount REAL,
            qs_initial_offer REAL,
            admin_margin REAL,
            approved_by_admin_id INTEGER NOT NULL,
            agreed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (job_id) REFERENCES jobs(id),
            FOREIGN KEY (approved_by_admin_id) REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS job_submissions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            job_id INTEGER NOT NULL,
            qs_id INTEGER NOT NULL,
            file_path TEXT NOT NULL,
            note TEXT,
            status TEXT NOT NULL DEFAULT 'pending_review',
            reviewed_by_admin_id INTEGER,
            reviewed_at DATETIME,
            submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (job_id) REFERENCES jobs(id),
            FOREIGN KEY (qs_id) REFERENCES users(id),
            FOREIGN KEY (reviewed_by_admin_id) REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS payments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            job_id INTEGER NOT NULL UNIQUE,
            amount REAL NOT NULL,
            status TEXT NOT NULL DEFAULT 'pending',
            reference TEXT,
            qs_paid_amount REAL,
            margin_amount REAL,
            client_paid_at DATETIME,
            paid_to_qs_at DATETIME,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (job_id) REFERENCES jobs(id)
        );

        CREATE TABLE IF NOT EXISTS job_assignments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            job_id INTEGER NOT NULL UNIQUE,
            qs_id INTEGER NOT NULL,
            assigned_by_admin_id INTEGER,
            assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            claimed_at DATETIME,
            FOREIGN KEY (job_id) REFERENCES jobs(id),
            FOREIGN KEY (qs_id) REFERENCES users(id),
            FOREIGN KEY (assigned_by_admin_id) REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS notification_reads (
            user_id INTEGER NOT NULL,
            event_id INTEGER NOT NULL,
            read_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (user_id, event_id),
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (event_id) REFERENCES job_negotiation_events(id)
        );

        CREATE TABLE IF NOT EXISTS qs_registrations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL UNIQUE,
            phone TEXT NOT NULL,
            location TEXT,
            qualification TEXT,
            experience_years INTEGER,
            payment_reference TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'pending_confirmation'
                CHECK (status IN ('pending_confirmation', 'approved', 'rejected')),
            admin_note TEXT,
            approval_message TEXT,
            welcome_message_sent INTEGER NOT NULL DEFAULT 0,
            registration_fee_amount REAL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            confirmed_at DATETIME,
            confirmed_by_admin_id INTEGER,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (confirmed_by_admin_id) REFERENCES users(id)
        );
        """
    )
    # Lightweight migrations for existing local DBs.
    cols = {row["name"] for row in db.execute("PRAGMA table_info(job_agreements)").fetchall()}
    if "client_amount" not in cols:
        db.execute("ALTER TABLE job_agreements ADD COLUMN client_amount REAL")
    if "qs_initial_offer" not in cols:
        db.execute("ALTER TABLE job_agreements ADD COLUMN qs_initial_offer REAL")
    if "admin_margin" not in cols:
        db.execute("ALTER TABLE job_agreements ADD COLUMN admin_margin REAL")

    pay_cols = {row["name"] for row in db.execute("PRAGMA table_info(payments)").fetchall()}
    if "qs_paid_amount" not in pay_cols:
        db.execute("ALTER TABLE payments ADD COLUMN qs_paid_amount REAL")
    if "margin_amount" not in pay_cols:
        db.execute("ALTER TABLE payments ADD COLUMN margin_amount REAL")
    if "client_paid_at" not in pay_cols:
        db.execute("ALTER TABLE payments ADD COLUMN client_paid_at DATETIME")
    if "paid_to_qs_at" not in pay_cols:
        db.execute("ALTER TABLE payments ADD COLUMN paid_to_qs_at DATETIME")

    sub_cols = {row["name"] for row in db.execute("PRAGMA table_info(job_submissions)").fetchall()}
    if "status" not in sub_cols:
        db.execute("ALTER TABLE job_submissions ADD COLUMN status TEXT NOT NULL DEFAULT 'pending_review'")
    if "reviewed_by_admin_id" not in sub_cols:
        db.execute("ALTER TABLE job_submissions ADD COLUMN reviewed_by_admin_id INTEGER")
    if "reviewed_at" not in sub_cols:
        db.execute("ALTER TABLE job_submissions ADD COLUMN reviewed_at DATETIME")

    assign_cols = {row["name"] for row in db.execute("PRAGMA table_info(job_assignments)").fetchall()}
    if assign_cols and "assigned_by_admin_id" not in assign_cols:
        db.execute("ALTER TABLE job_assignments ADD COLUMN assigned_by_admin_id INTEGER")
    if assign_cols and "claimed_at" not in assign_cols:
        db.execute("ALTER TABLE job_assignments ADD COLUMN claimed_at DATETIME")

    qs_cols = {row["name"] for row in db.execute("PRAGMA table_info(qs_registrations)").fetchall()}
    if qs_cols and "approval_message" not in qs_cols:
        db.execute("ALTER TABLE qs_registrations ADD COLUMN approval_message TEXT")
    if qs_cols and "welcome_message_sent" not in qs_cols:
        db.execute("ALTER TABLE qs_registrations ADD COLUMN welcome_message_sent INTEGER NOT NULL DEFAULT 0")
    db.commit()


@app.before_request
def before_request():
    init_db()


def login_required(view):
    @wraps(view)
    def wrapped(*args, **kwargs):
        if not session.get("user_id"):
            return redirect(url_for("login"))
        return view(*args, **kwargs)

    return wrapped


def role_required(*allowed_roles):
    def decorator(view):
        @wraps(view)
        def wrapped(*args, **kwargs):
            if not session.get("user_id"):
                return redirect(url_for("login"))
            if session.get("role") not in allowed_roles:
                return "Forbidden", 403
            return view(*args, **kwargs)

        return wrapped

    return decorator


def get_qs_registration(user_id):
    db = get_db()
    return db.execute(
        "SELECT id, status, payment_reference, created_at, admin_note, confirmed_at "
        "FROM qs_registrations WHERE user_id = ?",
        (user_id,),
    ).fetchone()


def is_qs_approved(user_id):
    registration = get_qs_registration(user_id)
    if registration is None:
        return True
    return registration["status"] == "approved"


def allowed_file(filename):
    if "." not in filename:
        return False
    ext = filename.rsplit(".", 1)[1].lower()
    return ext in ALLOWED_EXTENSIONS


def get_job_or_404(job_id):
    db = get_db()
    job = db.execute(
        "SELECT j.id, j.client_id, j.title, j.description, j.file_path, j.status, j.created_at, "
        "u.name AS client_name FROM jobs j JOIN users u ON j.client_id = u.id WHERE j.id = ?",
        (job_id,),
    ).fetchone()
    if job is None:
        abort(404)
    return job


def can_access_job(job):
    role = session.get("role")
    if role == "admin":
        return True
    if role == "qs":
        return is_qs_approved(session.get("user_id"))
    if role == "client" and job["client_id"] == session.get("user_id"):
        return True
    return False


def latest_amount_for_event(job_id, event_type):
    db = get_db()
    row = db.execute(
        "SELECT amount FROM job_negotiation_events WHERE job_id = ? AND event_type = ? "
        "ORDER BY id DESC LIMIT 1",
        (job_id, event_type),
    ).fetchone()
    return row["amount"] if row else None


def latest_event_for_type(job_id, event_type):
    db = get_db()
    return db.execute(
        "SELECT id, actor_id, amount, note, created_at FROM job_negotiation_events "
        "WHERE job_id = ? AND event_type = ? ORDER BY id DESC LIMIT 1",
        (job_id, event_type),
    ).fetchone()


def has_approved_submission(job_id):
    db = get_db()
    row = db.execute(
        "SELECT id FROM job_submissions WHERE job_id = ? AND status = 'approved' ORDER BY id DESC LIMIT 1",
        (job_id,),
    ).fetchone()
    return row is not None


def describe_event(event_type):
    return EVENT_LABELS.get(event_type, event_type.replace("_", " ").title())


def fetch_visible_event_rows(role, user_id, limit=100):
    db = get_db()
    if role == "client":
        query = (
            "SELECT e.id, e.job_id, j.title AS job_title, e.event_type, e.amount, e.note, e.created_at, "
            "e.actor_role, u.name AS actor_name "
            "FROM job_negotiation_events e "
            "JOIN jobs j ON j.id = e.job_id "
            "JOIN users u ON u.id = e.actor_id "
            "WHERE j.client_id = ? "
            "AND e.event_type IN ('admin_offer_to_client', 'client_counter', 'client_accept', 'final_agreement', 'invoice_generated') "
            "ORDER BY e.created_at DESC, e.id DESC"
        )
        params = (user_id,)
    elif role == "qs":
        query = (
            "SELECT e.id, e.job_id, j.title AS job_title, e.event_type, e.amount, e.note, e.created_at, "
            "e.actor_role, u.name AS actor_name "
            "FROM job_negotiation_events e "
            "JOIN jobs j ON j.id = e.job_id "
            "JOIN users u ON u.id = e.actor_id "
            "LEFT JOIN job_assignments a ON a.job_id = j.id "
            "WHERE (a.qs_id = ? OR (e.actor_role = 'qs' AND e.actor_id = ?)) "
            "AND e.event_type NOT IN ('admin_offer_to_client', 'client_counter', 'client_accept') "
            "ORDER BY e.created_at DESC, e.id DESC"
        )
        params = (user_id, user_id)
    else:
        query = (
            "SELECT e.id, e.job_id, j.title AS job_title, e.event_type, e.amount, e.note, e.created_at, "
            "e.actor_role, u.name AS actor_name "
            "FROM job_negotiation_events e "
            "JOIN jobs j ON j.id = e.job_id "
            "JOIN users u ON u.id = e.actor_id "
            "ORDER BY e.created_at DESC, e.id DESC"
        )
        params = ()

    if limit is not None:
        query += " LIMIT ?"
        params = (*params, limit)
    return db.execute(query, params).fetchall()


def is_event_visible_to_user(event_id, role, user_id):
    rows = fetch_visible_event_rows(role, user_id, limit=None)
    return any(row["id"] == event_id for row in rows)


def unread_count_for_user(role, user_id):
    rows = fetch_visible_event_rows(role, user_id, limit=None)
    if not rows:
        return 0
    db = get_db()
    event_ids = [row["id"] for row in rows]
    placeholders = ",".join("?" for _ in event_ids)
    read_rows = db.execute(
        f"SELECT event_id FROM notification_reads WHERE user_id = ? AND event_id IN ({placeholders})",
        (user_id, *event_ids),
    ).fetchall()
    read_ids = {row["event_id"] for row in read_rows}
    return sum(1 for event_id in event_ids if event_id not in read_ids)


def get_assignment(job_id):
    db = get_db()
    return db.execute(
        "SELECT a.job_id, a.qs_id, a.assigned_by_admin_id, a.assigned_at, a.claimed_at, u.name AS qs_name "
        "FROM job_assignments a JOIN users u ON a.qs_id = u.id WHERE a.job_id = ?",
        (job_id,),
    ).fetchone()


def is_assigned_qs(job_id, qs_user_id):
    assignment = get_assignment(job_id)
    return assignment is not None and assignment["qs_id"] == qs_user_id


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/mobile")
def mobile():
    return redirect(url_for("index"))


@app.route("/tablet")
def tablet():
    return redirect(url_for("index"))


@app.route("/desktop")
def desktop():
    return redirect(url_for("index"))


@app.route("/slides")
def slides():
    return redirect(url_for("index"))


@app.route("/send-message", methods=["POST"])
def send_message():
    # Public marketing form placeholder; keep UX smooth by returning to Contact.
    return redirect(url_for("index") + "#contact")


@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        name = request.form.get("name", "").strip()
        email = request.form.get("email", "").strip().lower()
        password = request.form.get("password", "")
        role = request.form.get("role", "client")
        phone = request.form.get("phone", "").strip()
        location = request.form.get("location", "").strip()
        qualification = request.form.get("qualification", "").strip()
        experience_years_raw = request.form.get("experience_years", "").strip()
        payment_reference = request.form.get("payment_reference", "").strip()

        if not name or not email or not password:
            return render_template(
                "register.html",
                error="Name, email, and password are required.",
                qs_registration_fee=app.config["QS_REGISTRATION_FEE"],
            )
        if role not in {"client", "qs", "admin"}:
            return render_template(
                "register.html",
                error="Invalid role selected.",
                qs_registration_fee=app.config["QS_REGISTRATION_FEE"],
            )
        if role == "qs":
            if not phone or not payment_reference:
                return render_template(
                    "register.html",
                    error="QS registration requires phone number and payment reference.",
                    qs_registration_fee=app.config["QS_REGISTRATION_FEE"],
                )
            if experience_years_raw:
                try:
                    int(experience_years_raw)
                except ValueError:
                    return render_template(
                        "register.html",
                        error="Experience years must be a whole number.",
                        qs_registration_fee=app.config["QS_REGISTRATION_FEE"],
                    )

        db = get_db()
        existing = db.execute("SELECT id FROM users WHERE email = ?", (email,)).fetchone()
        if existing:
            return render_template(
                "register.html",
                error="Email already registered.",
                qs_registration_fee=app.config["QS_REGISTRATION_FEE"],
            )

        cursor = db.execute(
            "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
            (name, email, generate_password_hash(password), role),
        )
        if role == "qs":
            experience_years = int(experience_years_raw) if experience_years_raw else None
            db.execute(
                "INSERT INTO qs_registrations "
                "(user_id, phone, location, qualification, experience_years, payment_reference, registration_fee_amount) "
                "VALUES (?, ?, ?, ?, ?, ?, ?)",
                (
                    cursor.lastrowid,
                    phone,
                    location or None,
                    qualification or None,
                    experience_years,
                    payment_reference,
                    float(app.config["QS_REGISTRATION_FEE"]),
                ),
            )
        db.commit()
        if role == "qs":
            return redirect(url_for("login", registered="qs_pending"))
        return redirect(url_for("login", registered="ok"))

    return render_template("register.html", qs_registration_fee=app.config["QS_REGISTRATION_FEE"])


@app.route("/login", methods=["GET", "POST"])
def login():
    info = None
    if request.method == "POST":
        email = request.form.get("email", "").strip().lower()
        password = request.form.get("password", "")

        db = get_db()
        user = db.execute(
            "SELECT u.id, u.name, u.email, u.password_hash, u.role, qr.status AS qs_status, "
            "qr.approval_message, qr.welcome_message_sent "
            "FROM users u "
            "LEFT JOIN qs_registrations qr ON qr.user_id = u.id "
            "WHERE u.email = ?",
            (email,),
        ).fetchone()

        if user is None or not check_password_hash(user["password_hash"], password):
            return render_template("login.html", error="Invalid email or password.")
        if user["role"] == "qs" and user["qs_status"] == "rejected":
            return render_template(
                "login.html",
                error="Your QS registration was rejected. Please contact admin support.",
            )

        session.clear()
        session["user_id"] = user["id"]
        session["name"] = user["name"]
        session["role"] = user["role"]
        if user["role"] == "qs" and user["qs_status"] == "approved" and not user["welcome_message_sent"]:
            welcome_message = user["approval_message"] or "Welcome to myQS. Your registration fee has been confirmed and your account is now approved."
            session["welcome_message"] = welcome_message
            db.execute(
                "UPDATE qs_registrations SET welcome_message_sent = 1 WHERE user_id = ?",
                (user["id"],),
            )
            db.commit()
        return redirect(url_for("dashboard"))

    registered = request.args.get("registered", "")
    if registered == "qs_pending":
        info = "QS registration submitted. Please complete payment and wait for admin confirmation."
    elif registered == "ok":
        info = "Registration successful. You can now log in."
    return render_template("login.html", info=info)


@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("login"))


@app.route("/dashboard")
@login_required
def dashboard():
    role = session.get("role")
    if role == "client":
        return redirect(url_for("client_dashboard"))
    if role == "qs":
        return redirect(url_for("qs_dashboard"))
    if role == "admin":
        return redirect(url_for("admin_dashboard"))
    return "Unknown role", 400


@app.route("/client/dashboard")
@role_required("client")
def client_dashboard():
    db = get_db()
    jobs = db.execute(
        "SELECT id, title, status, file_path, created_at FROM jobs WHERE client_id = ? ORDER BY created_at DESC",
        (session["user_id"],),
    ).fetchall()
    unread_count = unread_count_for_user(session["role"], session["user_id"])
    return render_template("dashboard_client.html", jobs=jobs, name=session.get("name"), unread_count=unread_count)


@app.route("/client/jobs/new", methods=["GET", "POST"])
@role_required("client")
def create_job():
    if request.method == "POST":
        title = request.form.get("title", "").strip()
        description = request.form.get("description", "").strip()
        task_file = request.files.get("task_file")

        if not title:
            return render_template("job_create.html", error="Job title is required.")
        if task_file is None or not task_file.filename:
            return render_template("job_create.html", error="Please upload a task file.")
        if not allowed_file(task_file.filename):
            return render_template("job_create.html", error="Unsupported file type.")

        original_name = secure_filename(task_file.filename)
        ext = original_name.rsplit(".", 1)[1].lower()
        saved_name = f"{uuid.uuid4().hex}.{ext}"
        save_path = os.path.join(app.config["TASK_UPLOAD_FOLDER"], saved_name)
        task_file.save(save_path)

        db = get_db()
        cursor = db.execute(
            "INSERT INTO jobs (client_id, title, description, file_path, status) VALUES (?, ?, ?, ?, 'open')",
            (session["user_id"], title, description, saved_name),
        )
        db.execute(
            "INSERT INTO job_negotiation_events (job_id, actor_role, actor_id, event_type, note) "
            "VALUES (?, 'client', ?, 'job_posted', ?)",
            (cursor.lastrowid, session["user_id"], "Job created by client"),
        )
        db.commit()
        return redirect(url_for("client_dashboard"))

    return render_template("job_create.html")


@app.route("/qs/dashboard")
@role_required("qs")
def qs_dashboard():
    db = get_db()
    approval_pending_message = None
    if is_qs_approved(session["user_id"]):
        open_jobs = db.execute(
            "SELECT j.id, j.title, j.status, j.file_path, j.created_at, u.name AS client_name, "
            "a.qs_id AS assigned_qs_id, a.claimed_at AS claimed_at, au.name AS assigned_qs_name "
            "FROM jobs j JOIN users u ON j.client_id = u.id "
            "LEFT JOIN job_assignments a ON a.job_id = j.id "
            "LEFT JOIN users au ON au.id = a.qs_id "
            "WHERE j.status IN ('open', 'negotiating', 'agreed', 'in_progress', 'submitted', 'payment_pending') "
            "ORDER BY j.created_at DESC"
        ).fetchall()
    else:
        open_jobs = []
        approval_pending_message = "Your registration fee payment is pending admin approval. You can log in, but tasks will unlock only after approval."
    unread_count = unread_count_for_user(session["role"], session["user_id"])
    return render_template(
        "dashboard_qs.html",
        jobs=open_jobs,
        name=session.get("name"),
        unread_count=unread_count,
        welcome_message=session.pop("welcome_message", None),
        approval_pending_message=approval_pending_message,
        account_status=("Pending Payment" if approval_pending_message else "Approved"),
        qs_payment_link=app.config["QS_PAYMENT_LINK"],
        support_link=app.config["SUPPORT_LINK"],
    )


@app.route("/jobs/<int:job_id>/download")
@role_required("client", "qs", "admin")
def download_job_file(job_id):
    job = get_job_or_404(job_id)
    if not job["file_path"]:
        abort(404)

    if not can_access_job(job):
        return "Forbidden", 403

    return send_from_directory(app.config["TASK_UPLOAD_FOLDER"], job["file_path"], as_attachment=True)


@app.route("/jobs/<int:job_id>/submissions/new", methods=["POST"])
@role_required("qs")
def upload_submission(job_id):
    if not is_qs_approved(session["user_id"]):
        return "QS account is pending payment approval. You cannot access tasks yet.", 403
    job = get_job_or_404(job_id)
    if job["status"] not in {"agreed", "in_progress", "submitted"}:
        return "Job is not ready for submission", 400
    assignment = get_assignment(job_id)
    if assignment is None:
        return "Job must be assigned by admin before submission", 400
    if assignment["qs_id"] != session["user_id"]:
        return "Only the assigned QS can submit deliverables", 403
    if assignment["claimed_at"] is None:
        return "You must claim your admin-assigned job before submission", 400

    deliverable_file = request.files.get("deliverable_file")
    note = request.form.get("note", "").strip()
    if deliverable_file is None or not deliverable_file.filename:
        return "Please attach a deliverable file", 400
    if not allowed_file(deliverable_file.filename):
        return "Unsupported file type", 400

    original_name = secure_filename(deliverable_file.filename)
    ext = original_name.rsplit(".", 1)[1].lower()
    saved_name = f"{uuid.uuid4().hex}.{ext}"
    save_path = os.path.join(app.config["SUBMISSION_UPLOAD_FOLDER"], saved_name)
    deliverable_file.save(save_path)

    db = get_db()
    db.execute(
        "INSERT INTO job_submissions (job_id, qs_id, file_path, note, status) VALUES (?, ?, ?, ?, 'pending_review')",
        (job_id, session["user_id"], saved_name, note),
    )
    db.execute(
        "INSERT INTO job_negotiation_events (job_id, actor_role, actor_id, event_type, note) "
        "VALUES (?, 'qs', ?, 'submission_uploaded', ?)",
        (job_id, session["user_id"], note),
    )
    db.execute("UPDATE jobs SET status = 'submitted' WHERE id = ?", (job_id,))
    db.commit()
    return redirect(url_for("job_negotiation", job_id=job_id))


@app.route("/jobs/<int:job_id>/claim", methods=["POST"])
@role_required("qs")
def claim_job(job_id):
    if not is_qs_approved(session["user_id"]):
        return "QS account is pending payment approval. You cannot access tasks yet.", 403
    job = get_job_or_404(job_id)
    if job["status"] not in {"agreed", "in_progress"}:
        return "Job can only be claimed after agreement and admin assignment", 400

    db = get_db()
    existing = get_assignment(job_id)
    if existing is None:
        return "Admin must assign this job to a QS first", 400
    if existing["qs_id"] != session["user_id"]:
        return "This job is assigned to another QS", 403
    if existing["claimed_at"] is not None:
        return redirect(url_for("job_negotiation", job_id=job_id))

    db.execute(
        "UPDATE job_assignments SET claimed_at = CURRENT_TIMESTAMP WHERE job_id = ?",
        (job_id,),
    )
    db.execute(
        "INSERT INTO job_negotiation_events (job_id, actor_role, actor_id, event_type, note) "
        "VALUES (?, 'qs', ?, 'job_claimed', ?)",
        (job_id, session["user_id"], "Assigned QS claimed the job"),
    )
    db.execute("UPDATE jobs SET status = 'in_progress' WHERE id = ?", (job_id,))
    db.commit()
    return redirect(url_for("job_negotiation", job_id=job_id))


@app.route("/jobs/<int:job_id>/assign", methods=["POST"])
@role_required("admin")
def assign_job(job_id):
    qs_id_raw = request.form.get("qs_id", "").strip()
    try:
        qs_id = int(qs_id_raw)
    except ValueError:
        return "Invalid QS selection", 400

    db = get_db()
    qs_user = db.execute(
        "SELECT id, name FROM users WHERE id = ? AND role = 'qs'",
        (qs_id,),
    ).fetchone()
    if qs_user is None:
        return "Selected user is not a QS", 400

    db.execute(
        "INSERT INTO job_assignments (job_id, qs_id, assigned_by_admin_id) VALUES (?, ?, ?) "
        "ON CONFLICT(job_id) DO UPDATE SET qs_id = excluded.qs_id, "
        "assigned_by_admin_id = excluded.assigned_by_admin_id, assigned_at = CURRENT_TIMESTAMP, claimed_at = NULL",
        (job_id, qs_id, session["user_id"]),
    )
    db.execute(
        "INSERT INTO job_negotiation_events (job_id, actor_role, actor_id, event_type, note) "
        "VALUES (?, 'admin', ?, 'job_assigned', ?)",
        (job_id, session["user_id"], f'Assigned to QS {qs_user["name"]}'),
    )
    job = get_job_or_404(job_id)
    if job["status"] == "agreed":
        db.execute("UPDATE jobs SET status = 'in_progress' WHERE id = ?", (job_id,))
    db.commit()
    return redirect(url_for("job_negotiation", job_id=job_id))


@app.route("/jobs/<int:job_id>/submissions/<int:submission_id>/download")
@role_required("client", "qs", "admin")
def download_submission_file(job_id, submission_id):
    job = get_job_or_404(job_id)
    if not can_access_job(job):
        return "Forbidden", 403

    db = get_db()
    submission = db.execute(
        "SELECT id, job_id, qs_id, file_path, status FROM job_submissions WHERE id = ? AND job_id = ?",
        (submission_id, job_id),
    ).fetchone()
    if submission is None:
        abort(404)
    if session.get("role") == "qs" and submission["qs_id"] != session.get("user_id"):
        return "Forbidden", 403
    if session.get("role") == "client":
        payment = db.execute(
            "SELECT status FROM payments WHERE job_id = ?",
            (job_id,),
        ).fetchone()
        paid = payment is not None and payment["status"] in {"client_paid", "paid_to_qs"}
        if submission["status"] != "approved" or not paid:
            return "Client can download only approved deliverables after payment", 403
    return send_from_directory(app.config["SUBMISSION_UPLOAD_FOLDER"], submission["file_path"], as_attachment=True)


@app.route("/jobs/<int:job_id>/submissions/<int:submission_id>/approve", methods=["POST"])
@role_required("admin")
def approve_submission(job_id, submission_id):
    db = get_db()
    submission = db.execute(
        "SELECT id, status FROM job_submissions WHERE id = ? AND job_id = ?",
        (submission_id, job_id),
    ).fetchone()
    if submission is None:
        abort(404)
    if submission["status"] == "approved":
        return redirect(url_for("job_negotiation", job_id=job_id))

    db.execute(
        "UPDATE job_submissions SET status = 'approved', reviewed_by_admin_id = ?, reviewed_at = CURRENT_TIMESTAMP "
        "WHERE id = ?",
        (session["user_id"], submission_id),
    )
    db.execute(
        "INSERT INTO job_negotiation_events (job_id, actor_role, actor_id, event_type, note) "
        "VALUES (?, 'admin', ?, 'submission_approved', ?)",
        (job_id, session["user_id"], request.form.get("note", "").strip()),
    )
    db.execute("UPDATE jobs SET status = 'payment_pending' WHERE id = ?", (job_id,))
    db.commit()
    return redirect(url_for("job_negotiation", job_id=job_id))


@app.route("/jobs/<int:job_id>/submissions/<int:submission_id>/reject", methods=["POST"])
@role_required("admin")
def reject_submission(job_id, submission_id):
    db = get_db()
    submission = db.execute(
        "SELECT id FROM job_submissions WHERE id = ? AND job_id = ?",
        (submission_id, job_id),
    ).fetchone()
    if submission is None:
        abort(404)

    db.execute(
        "UPDATE job_submissions SET status = 'rejected', reviewed_by_admin_id = ?, reviewed_at = CURRENT_TIMESTAMP "
        "WHERE id = ?",
        (session["user_id"], submission_id),
    )
    db.execute(
        "INSERT INTO job_negotiation_events (job_id, actor_role, actor_id, event_type, note) "
        "VALUES (?, 'admin', ?, 'submission_rejected', ?)",
        (job_id, session["user_id"], request.form.get("note", "").strip()),
    )
    db.execute("UPDATE jobs SET status = 'in_progress' WHERE id = ?", (job_id,))
    db.commit()
    return redirect(url_for("job_negotiation", job_id=job_id))


@app.route("/jobs/<int:job_id>/negotiation")
@role_required("client", "qs", "admin")
def job_negotiation(job_id):
    job = get_job_or_404(job_id)
    if not can_access_job(job):
        return "Forbidden", 403

    db = get_db()
    if session.get("role") == "client":
        events = db.execute(
            "SELECT e.id, e.event_type, e.amount, e.note, e.created_at, e.actor_role, u.name AS actor_name "
            "FROM job_negotiation_events e JOIN users u ON e.actor_id = u.id "
            "WHERE e.job_id = ? "
            "AND e.event_type IN ('admin_offer_to_client', 'client_counter', 'client_accept', 'final_agreement', 'invoice_generated') "
            "ORDER BY e.id ASC",
            (job_id,),
        ).fetchall()
    elif session.get("role") == "qs":
        events = db.execute(
            "SELECT e.id, e.event_type, e.amount, e.note, e.created_at, e.actor_role, u.name AS actor_name "
            "FROM job_negotiation_events e JOIN users u ON e.actor_id = u.id "
            "WHERE e.job_id = ? AND e.event_type NOT IN ('admin_offer_to_client', 'client_counter', 'client_accept') "
            "ORDER BY e.id ASC",
            (job_id,),
        ).fetchall()
    else:
        events = db.execute(
            "SELECT e.id, e.event_type, e.amount, e.note, e.created_at, e.actor_role, u.name AS actor_name "
            "FROM job_negotiation_events e JOIN users u ON e.actor_id = u.id "
            "WHERE e.job_id = ? ORDER BY e.id ASC",
            (job_id,),
        ).fetchall()

    agreement = db.execute(
        "SELECT a.final_amount, a.client_amount, a.qs_initial_offer, a.admin_margin, a.agreed_at, "
        "u.name AS admin_name "
        "FROM job_agreements a JOIN users u ON a.approved_by_admin_id = u.id "
        "WHERE a.job_id = ?",
        (job_id,),
    ).fetchone()

    payment = db.execute(
        "SELECT status, amount, reference, qs_paid_amount, margin_amount, client_paid_at, paid_to_qs_at "
        "FROM payments WHERE job_id = ?",
        (job_id,),
    ).fetchone()
    submissions = db.execute(
        "SELECT s.id, s.file_path, s.note, s.status, s.submitted_at, s.reviewed_at, u.name AS qs_name "
        "FROM job_submissions s JOIN users u ON s.qs_id = u.id "
        "WHERE s.job_id = ? ORDER BY s.id DESC",
        (job_id,),
    ).fetchall()
    assignment = get_assignment(job_id)
    qs_users = db.execute("SELECT id, name FROM users WHERE role = 'qs' ORDER BY name").fetchall()
    client_can_download_deliverable = payment is not None and payment["status"] in {"client_paid", "paid_to_qs"}
    invoice_available = agreement is not None

    return render_template(
        "job_negotiation.html",
        job=job,
        events=events,
        agreement=agreement,
        payment=payment,
        submissions=submissions,
        assignment=assignment,
        qs_users=qs_users,
        client_can_download_deliverable=client_can_download_deliverable,
        invoice_available=invoice_available,
        role=session.get("role"),
        name=session.get("name"),
        unread_count=unread_count_for_user(session["role"], session["user_id"]),
        latest_qs_offer=latest_amount_for_event(job_id, "qs_offer") if session.get("role") != "client" else None,
        latest_admin_offer=latest_amount_for_event(job_id, "admin_offer_to_client") if session.get("role") != "qs" else None,
    )


@app.route("/jobs/<int:job_id>/offers/qs", methods=["POST"])
@role_required("qs")
def qs_offer(job_id):
    if not is_qs_approved(session["user_id"]):
        return "QS account is pending payment approval. You cannot access tasks yet.", 403
    job = get_job_or_404(job_id)
    if job["status"] in {"agreed", "in_progress", "submitted", "payment_pending", "paid"}:
        return "Negotiation closed for this job", 400
    assignment = get_assignment(job_id)
    if assignment is not None and assignment["qs_id"] != session["user_id"]:
        return "Job already assigned to another QS", 403

    amount_raw = request.form.get("amount", "").strip()
    note = request.form.get("note", "").strip()
    try:
        amount = float(amount_raw)
    except ValueError:
        return "Invalid amount", 400
    if amount <= 0:
        return "Amount must be greater than 0", 400

    db = get_db()
    db.execute(
        "INSERT INTO job_negotiation_events (job_id, actor_role, actor_id, event_type, amount, note) "
        "VALUES (?, 'qs', ?, 'qs_offer', ?, ?)",
        (job_id, session["user_id"], amount, note),
    )
    db.execute("UPDATE jobs SET status = 'negotiating' WHERE id = ?", (job_id,))
    db.commit()
    return redirect(url_for("job_negotiation", job_id=job_id))


@app.route("/jobs/<int:job_id>/offers/admin", methods=["POST"])
@role_required("admin")
def admin_offer(job_id):
    job = get_job_or_404(job_id)
    if job["status"] in {"agreed", "in_progress", "submitted", "payment_pending", "paid"}:
        return "Negotiation closed for this job", 400

    amount_raw = request.form.get("amount", "").strip()
    note = request.form.get("note", "").strip()
    try:
        amount = float(amount_raw)
    except ValueError:
        return "Invalid amount", 400
    if amount <= 0:
        return "Amount must be greater than 0", 400

    db = get_db()
    db.execute(
        "INSERT INTO job_negotiation_events (job_id, actor_role, actor_id, event_type, amount, note) "
        "VALUES (?, 'admin', ?, 'admin_offer_to_client', ?, ?)",
        (job_id, session["user_id"], amount, note),
    )
    db.execute("UPDATE jobs SET status = 'negotiating' WHERE id = ?", (job_id,))
    db.commit()
    return redirect(url_for("job_negotiation", job_id=job_id))


@app.route("/jobs/<int:job_id>/offers/client-counter", methods=["POST"])
@role_required("client")
def client_counter_offer(job_id):
    job = get_job_or_404(job_id)
    if not can_access_job(job):
        return "Forbidden", 403
    if job["status"] in {"agreed", "in_progress", "submitted", "payment_pending", "paid"}:
        return "Negotiation closed for this job", 400

    amount_raw = request.form.get("amount", "").strip()
    note = request.form.get("note", "").strip()
    try:
        amount = float(amount_raw)
    except ValueError:
        return "Invalid amount", 400
    if amount <= 0:
        return "Amount must be greater than 0", 400

    db = get_db()
    db.execute(
        "INSERT INTO job_negotiation_events (job_id, actor_role, actor_id, event_type, amount, note) "
        "VALUES (?, 'client', ?, 'client_counter', ?, ?)",
        (job_id, session["user_id"], amount, note),
    )
    db.execute("UPDATE jobs SET status = 'negotiating' WHERE id = ?", (job_id,))
    db.commit()
    return redirect(url_for("job_negotiation", job_id=job_id))


@app.route("/jobs/<int:job_id>/offers/client-accept", methods=["POST"])
@role_required("client")
def client_accept_offer(job_id):
    job = get_job_or_404(job_id)
    if not can_access_job(job):
        return "Forbidden", 403
    if job["status"] in {"agreed", "in_progress", "submitted", "payment_pending", "paid"}:
        return "Negotiation closed for this job", 400

    admin_offer_event = latest_event_for_type(job_id, "admin_offer_to_client")
    if admin_offer_event is None:
        return "No admin offer available to accept", 400
    admin_offer_amount = admin_offer_event["amount"]
    admin_actor_id = admin_offer_event["actor_id"]
    qs_initial_offer = latest_amount_for_event(job_id, "qs_offer")
    if qs_initial_offer is None:
        return "QS initial offer is required before acceptance", 400
    if admin_offer_amount < qs_initial_offer:
        return "Admin offer cannot be lower than QS initial offer", 400

    note = request.form.get("note", "").strip()
    admin_margin = admin_offer_amount - qs_initial_offer
    db = get_db()
    db.execute(
        "INSERT INTO job_negotiation_events (job_id, actor_role, actor_id, event_type, amount, note) "
        "VALUES (?, 'client', ?, 'client_accept', ?, ?)",
        (job_id, session["user_id"], admin_offer_amount, note),
    )
    # Client acceptance makes the latest admin offer the agreed payable amount.
    db.execute(
        "INSERT INTO job_agreements "
        "(job_id, final_amount, client_amount, qs_initial_offer, admin_margin, approved_by_admin_id) "
        "VALUES (?, ?, ?, ?, ?, ?) "
        "ON CONFLICT(job_id) DO UPDATE SET final_amount = excluded.final_amount, "
        "client_amount = excluded.client_amount, qs_initial_offer = excluded.qs_initial_offer, "
        "admin_margin = excluded.admin_margin, approved_by_admin_id = excluded.approved_by_admin_id, "
        "agreed_at = CURRENT_TIMESTAMP",
        (job_id, admin_offer_amount, admin_offer_amount, qs_initial_offer, admin_margin, admin_actor_id),
    )
    db.execute(
        "INSERT INTO job_negotiation_events (job_id, actor_role, actor_id, event_type, amount, note) "
        "VALUES (?, 'admin', ?, 'final_agreement', ?, ?)",
        (job_id, admin_actor_id, admin_offer_amount, "Client accepted admin offer. Agreement finalized."),
    )
    db.execute(
        "INSERT INTO job_negotiation_events (job_id, actor_role, actor_id, event_type, note) "
        "VALUES (?, 'admin', ?, 'invoice_generated', ?)",
        (job_id, admin_actor_id, "Invoice is available for client download"),
    )
    db.execute("UPDATE jobs SET status = 'agreed' WHERE id = ?", (job_id,))
    db.commit()
    return redirect(url_for("job_negotiation", job_id=job_id))


@app.route("/jobs/<int:job_id>/agreement/finalize", methods=["POST"])
@role_required("admin")
def finalize_agreement(job_id):
    job = get_job_or_404(job_id)
    if job["status"] in {"agreed", "in_progress", "submitted", "payment_pending", "paid"}:
        return "Already finalized", 400

    amount_raw = request.form.get("amount", "").strip()
    note = request.form.get("note", "").strip()
    try:
        amount = float(amount_raw)
    except ValueError:
        return "Invalid amount", 400
    if amount <= 0:
        return "Amount must be greater than 0", 400

    qs_initial_offer = latest_amount_for_event(job_id, "qs_offer")
    if qs_initial_offer is None:
        return "QS initial offer is required before finalizing", 400
    if amount < qs_initial_offer:
        return "Client amount cannot be lower than QS initial offer", 400
    admin_margin = amount - qs_initial_offer

    db = get_db()
    db.execute(
        "INSERT INTO job_agreements "
        "(job_id, final_amount, client_amount, qs_initial_offer, admin_margin, approved_by_admin_id) "
        "VALUES (?, ?, ?, ?, ?, ?) "
        "ON CONFLICT(job_id) DO UPDATE SET final_amount = excluded.final_amount, "
        "client_amount = excluded.client_amount, qs_initial_offer = excluded.qs_initial_offer, "
        "admin_margin = excluded.admin_margin, "
        "approved_by_admin_id = excluded.approved_by_admin_id, agreed_at = CURRENT_TIMESTAMP",
        (job_id, amount, amount, qs_initial_offer, admin_margin, session["user_id"]),
    )
    db.execute(
        "INSERT INTO job_negotiation_events (job_id, actor_role, actor_id, event_type, amount, note) "
        "VALUES (?, 'admin', ?, 'final_agreement', ?, ?)",
        (job_id, session["user_id"], amount, note),
    )
    db.execute(
        "INSERT INTO job_negotiation_events (job_id, actor_role, actor_id, event_type, note) "
        "VALUES (?, 'admin', ?, 'invoice_generated', ?)",
        (job_id, session["user_id"], "Invoice is available for client download"),
    )
    db.execute("UPDATE jobs SET status = 'agreed' WHERE id = ?", (job_id,))
    db.commit()
    return redirect(url_for("job_negotiation", job_id=job_id))


@app.route("/jobs/<int:job_id>/agreement/accept-client-counter", methods=["POST"])
@role_required("admin")
def accept_client_counter_as_agreement(job_id):
    job = get_job_or_404(job_id)
    if job["status"] in {"agreed", "in_progress", "submitted", "payment_pending", "paid"}:
        return "Already finalized", 400

    client_counter_amount = latest_amount_for_event(job_id, "client_counter")
    if client_counter_amount is None:
        return "No client counter offer to accept", 400

    qs_initial_offer = latest_amount_for_event(job_id, "qs_offer")
    if qs_initial_offer is None:
        return "QS initial offer is required before finalizing", 400
    if client_counter_amount < qs_initial_offer:
        return "Client counter cannot be lower than QS initial offer", 400

    admin_margin = client_counter_amount - qs_initial_offer
    note = request.form.get("note", "").strip() or "Admin accepted latest client counter as final agreement"

    db = get_db()
    db.execute(
        "INSERT INTO job_agreements "
        "(job_id, final_amount, client_amount, qs_initial_offer, admin_margin, approved_by_admin_id) "
        "VALUES (?, ?, ?, ?, ?, ?) "
        "ON CONFLICT(job_id) DO UPDATE SET final_amount = excluded.final_amount, "
        "client_amount = excluded.client_amount, qs_initial_offer = excluded.qs_initial_offer, "
        "admin_margin = excluded.admin_margin, "
        "approved_by_admin_id = excluded.approved_by_admin_id, agreed_at = CURRENT_TIMESTAMP",
        (job_id, client_counter_amount, client_counter_amount, qs_initial_offer, admin_margin, session["user_id"]),
    )
    db.execute(
        "INSERT INTO job_negotiation_events (job_id, actor_role, actor_id, event_type, amount, note) "
        "VALUES (?, 'admin', ?, 'final_agreement', ?, ?)",
        (job_id, session["user_id"], client_counter_amount, note),
    )
    db.execute(
        "INSERT INTO job_negotiation_events (job_id, actor_role, actor_id, event_type, note) "
        "VALUES (?, 'admin', ?, 'invoice_generated', ?)",
        (job_id, session["user_id"], "Invoice is available for client download"),
    )
    db.execute("UPDATE jobs SET status = 'agreed' WHERE id = ?", (job_id,))
    db.commit()
    return redirect(url_for("job_negotiation", job_id=job_id))


@app.route("/jobs/<int:job_id>/invoice/download")
@role_required("client", "admin")
def download_invoice(job_id):
    job = get_job_or_404(job_id)
    if session.get("role") == "client" and job["client_id"] != session.get("user_id"):
        return "Forbidden", 403

    db = get_db()
    agreement = db.execute(
        "SELECT client_amount, qs_initial_offer, admin_margin, agreed_at FROM job_agreements WHERE job_id = ?",
        (job_id,),
    ).fetchone()
    if agreement is None:
        return "No agreed amount yet", 400

    invoice_text = (
        f"myQS Invoice\\n"
        f"Invoice Date: {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')}\\n"
        f"Job ID: {job_id}\\n"
        f"Job Title: {job['title']}\\n"
        f"Client: {job['client_name']}\\n"
        f"Agreed At: {agreement['agreed_at']}\\n\\n"
        f"Amount Payable By Client: {agreement['client_amount']:.2f}\\n"
        f"QS Initial Offer: {agreement['qs_initial_offer']:.2f}\\n"
        f"Admin Facilitation Margin: {agreement['admin_margin']:.2f}\\n"
    )
    payload = BytesIO(invoice_text.encode("utf-8"))
    return send_file(
        payload,
        mimetype="text/plain",
        as_attachment=True,
        download_name=f"invoice_job_{job_id}.txt",
    )


@app.route("/jobs/<int:job_id>/payments/client-paid", methods=["POST"])
@role_required("admin")
def mark_client_paid(job_id):
    job = get_job_or_404(job_id)
    if job["status"] not in {"agreed", "payment_pending"}:
        return "Job must be agreed before marking client payment", 400
    if not has_approved_submission(job_id):
        return "Approve at least one QS submission before marking payment", 400

    reference = request.form.get("reference", "").strip()
    db = get_db()
    agreement = db.execute(
        "SELECT client_amount, qs_initial_offer, admin_margin FROM job_agreements WHERE job_id = ?",
        (job_id,),
    ).fetchone()
    if agreement is None:
        return "No agreement found", 400

    db.execute(
        "INSERT INTO payments (job_id, amount, status, reference, margin_amount, updated_at, client_paid_at) "
        "VALUES (?, ?, 'client_paid', ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) "
        "ON CONFLICT(job_id) DO UPDATE SET amount = excluded.amount, status = 'client_paid', "
        "reference = excluded.reference, margin_amount = excluded.margin_amount, "
        "client_paid_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP",
        (job_id, agreement["client_amount"], reference, agreement["admin_margin"]),
    )
    db.execute(
        "INSERT INTO job_negotiation_events (job_id, actor_role, actor_id, event_type, amount, note) "
        "VALUES (?, 'admin', ?, 'client_paid', ?, ?)",
        (job_id, session["user_id"], agreement["client_amount"], reference or "Client payment received"),
    )
    db.execute("UPDATE jobs SET status = 'payment_pending' WHERE id = ?", (job_id,))
    db.commit()
    return redirect(url_for("job_negotiation", job_id=job_id))


@app.route("/jobs/<int:job_id>/payments/pay-qs", methods=["POST"])
@role_required("admin")
def pay_qs(job_id):
    if not has_approved_submission(job_id):
        return "Approve at least one QS submission before paying QS", 400
    db = get_db()
    agreement = db.execute(
        "SELECT qs_initial_offer, admin_margin FROM job_agreements WHERE job_id = ?",
        (job_id,),
    ).fetchone()
    if agreement is None:
        return "No agreement found", 400
    payment = db.execute(
        "SELECT status FROM payments WHERE job_id = ?",
        (job_id,),
    ).fetchone()
    if payment is None or payment["status"] != "client_paid":
        return "Mark client payment first", 400

    db.execute(
        "UPDATE payments SET status = 'paid_to_qs', qs_paid_amount = ?, margin_amount = ?, "
        "paid_to_qs_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP "
        "WHERE job_id = ?",
        (agreement["qs_initial_offer"], agreement["admin_margin"], job_id),
    )
    db.execute(
        "INSERT INTO job_negotiation_events (job_id, actor_role, actor_id, event_type, amount, note) "
        "VALUES (?, 'admin', ?, 'qs_paid', ?, ?)",
        (
            job_id,
            session["user_id"],
            agreement["qs_initial_offer"],
            f"QS paid initial offer. Admin margin retained: {agreement['admin_margin']}",
        ),
    )
    db.execute("UPDATE jobs SET status = 'paid' WHERE id = ?", (job_id,))
    db.commit()
    return redirect(url_for("job_negotiation", job_id=job_id))


@app.route("/inbox")
@role_required("client", "qs", "admin")
def inbox():
    db = get_db()
    role = session["role"]
    user_id = session["user_id"]
    rows = fetch_visible_event_rows(role, user_id, limit=100)
    event_ids = [row["id"] for row in rows]
    read_ids = set()
    if event_ids:
        placeholders = ",".join("?" for _ in event_ids)
        read_rows = db.execute(
            f"SELECT event_id FROM notification_reads WHERE user_id = ? AND event_id IN ({placeholders})",
            (user_id, *event_ids),
        ).fetchall()
        read_ids = {row["event_id"] for row in read_rows}

    items = []
    for row in rows:
        detail_parts = []
        if row["amount"] is not None:
            detail_parts.append(f"Amount: {row['amount']:.2f}")
        if row["note"]:
            detail_parts.append(row["note"])
        items.append(
            {
                "id": row["id"],
                "job_id": row["job_id"],
                "job_title": row["job_title"],
                "created_at": row["created_at"],
                "actor_name": row["actor_name"],
                "actor_role": row["actor_role"],
                "label": describe_event(row["event_type"]),
                "details": " | ".join(detail_parts),
                "is_read": row["id"] in read_ids,
            }
        )

    unread_count = unread_count_for_user(role, user_id)
    return render_template(
        "inbox.html",
        items=items,
        role=role,
        name=session.get("name"),
        unread_count=unread_count,
    )


@app.route("/inbox/mark-read/<int:event_id>", methods=["POST"])
@role_required("client", "qs", "admin")
def mark_inbox_item_read(event_id):
    role = session["role"]
    user_id = session["user_id"]
    if not is_event_visible_to_user(event_id, role, user_id):
        return "Forbidden", 403
    db = get_db()
    db.execute(
        "INSERT OR IGNORE INTO notification_reads (user_id, event_id) VALUES (?, ?)",
        (user_id, event_id),
    )
    db.commit()
    return redirect(url_for("inbox"))


@app.route("/inbox/open/<int:event_id>")
@role_required("client", "qs", "admin")
def open_inbox_item(event_id):
    role = session["role"]
    user_id = session["user_id"]
    if not is_event_visible_to_user(event_id, role, user_id):
        return "Forbidden", 403

    db = get_db()
    event = db.execute(
        "SELECT job_id FROM job_negotiation_events WHERE id = ?",
        (event_id,),
    ).fetchone()
    if event is None:
        abort(404)

    db.execute(
        "INSERT OR IGNORE INTO notification_reads (user_id, event_id) VALUES (?, ?)",
        (user_id, event_id),
    )
    db.commit()
    return redirect(url_for("job_negotiation", job_id=event["job_id"]))


@app.route("/inbox/mark-all-read", methods=["POST"])
@role_required("client", "qs", "admin")
def mark_all_inbox_read():
    role = session["role"]
    user_id = session["user_id"]
    rows = fetch_visible_event_rows(role, user_id, limit=None)
    if rows:
        db = get_db()
        db.executemany(
            "INSERT OR IGNORE INTO notification_reads (user_id, event_id) VALUES (?, ?)",
            [(user_id, row["id"]) for row in rows],
        )
        db.commit()
    return redirect(url_for("inbox"))


@app.route("/admin/dashboard")
@role_required("admin")
def admin_dashboard():
    db = get_db()
    counts = {
        "clients": db.execute("SELECT COUNT(*) AS c FROM users WHERE role = 'client'").fetchone()["c"],
        "qs_users": db.execute("SELECT COUNT(*) AS c FROM users WHERE role = 'qs'").fetchone()["c"],
        "admins": db.execute("SELECT COUNT(*) AS c FROM users WHERE role = 'admin'").fetchone()["c"],
        "jobs": db.execute("SELECT COUNT(*) AS c FROM jobs").fetchone()["c"],
        "negotiations": db.execute("SELECT COUNT(*) AS c FROM job_negotiation_events").fetchone()["c"],
    }
    jobs = db.execute(
        "SELECT j.id, j.title, j.status, j.created_at, u.name AS client_name, "
        "au.name AS assigned_qs_name "
        "FROM jobs j JOIN users u ON j.client_id = u.id "
        "LEFT JOIN job_assignments a ON a.job_id = j.id "
        "LEFT JOIN users au ON au.id = a.qs_id "
        "ORDER BY j.created_at DESC"
    ).fetchall()
    pending_qs = db.execute(
        "SELECT qr.user_id, u.name, u.email, qr.phone, qr.location, qr.qualification, qr.experience_years, "
        "qr.payment_reference, qr.registration_fee_amount, qr.created_at, qr.status "
        "FROM qs_registrations qr "
        "JOIN users u ON u.id = qr.user_id "
        "WHERE qr.status = 'pending_confirmation' "
        "ORDER BY qr.created_at ASC"
    ).fetchall()
    unread_count = unread_count_for_user(session["role"], session["user_id"])
    return render_template(
        "dashboard_admin.html",
        counts=counts,
        jobs=jobs,
        pending_qs=pending_qs,
        name=session.get("name"),
        unread_count=unread_count,
    )


@app.route("/admin/qs-registrations/<int:user_id>/approve", methods=["POST"])
@role_required("admin")
def approve_qs_registration(user_id):
    db = get_db()
    registration = db.execute(
        "SELECT id, status FROM qs_registrations WHERE user_id = ?",
        (user_id,),
    ).fetchone()
    if registration is None:
        return "QS registration not found", 404
    if registration["status"] != "pending_confirmation":
        return redirect(url_for("admin_dashboard"))

    qs_user = db.execute(
        "SELECT name FROM users WHERE id = ?",
        (user_id,),
    ).fetchone()
    welcome_message = f"Welcome {qs_user['name']}. Your registration fee payment has been confirmed and your myQS account is approved. You can now access tasks."
    db.execute(
        "UPDATE qs_registrations SET status = 'approved', confirmed_at = CURRENT_TIMESTAMP, "
        "confirmed_by_admin_id = ?, admin_note = ?, approval_message = ?, welcome_message_sent = 0 "
        "WHERE user_id = ?",
        (
            session["user_id"],
            request.form.get("admin_note", "").strip() or None,
            welcome_message,
            user_id,
        ),
    )
    db.commit()
    return redirect(url_for("admin_dashboard"))


@app.route("/admin/qs-registrations/<int:user_id>/reject", methods=["POST"])
@role_required("admin")
def reject_qs_registration(user_id):
    db = get_db()
    registration = db.execute(
        "SELECT id FROM qs_registrations WHERE user_id = ?",
        (user_id,),
    ).fetchone()
    if registration is None:
        return "QS registration not found", 404

    db.execute(
        "UPDATE qs_registrations SET status = 'rejected', confirmed_at = CURRENT_TIMESTAMP, "
        "confirmed_by_admin_id = ?, admin_note = ? WHERE user_id = ?",
        (session["user_id"], request.form.get("admin_note", "").strip() or "Payment not confirmed", user_id),
    )
    db.commit()
    return redirect(url_for("admin_dashboard"))


# Required for Vercel to work
application = app

if __name__ == "__main__":
    app.run(debug=True)
