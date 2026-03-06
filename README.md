# myQS

myQS is a Flask web app for managing jobs between three roles:
- Client: creates jobs and pays for approved work.
- QS: submits offers and uploads deliverables for assigned jobs.
- Admin: handles negotiation, assignment, approval, and payment flow.

## Quick Start
1. Create and activate a virtual environment.
2. Install dependencies:
`pip install -r requirements.txt`
3. Run the app:
`python app.py`
4. Open:
`http://127.0.0.1:5000`

The SQLite database (`myqs.db`) and upload folders are created automatically.

## How To Use
1. Register accounts for each role at `/register` (Client, QS, Admin).
2. Log in at `/login`.
3. Client creates a job from the client dashboard.
4. QS sends an offer for that job.
5. Admin negotiates with Client and finalizes the amount.
6. Admin assigns the job to a QS.
7. QS claims the job and uploads a submission.
8. Admin approves the submission and marks payment received.
9. Client downloads the approved deliverable.

## Main Pages
- `/register`: create account
- `/login`: sign in
- `/client/dashboard`: client workspace
- `/qs/dashboard`: QS workspace
- `/admin/dashboard`: admin workspace
- `/inbox`: event notifications
