// src/app/privacy-policy/page.tsx
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";

export const metadata = {
  title: "Privacy Policy – myQS",
  description: "How myQS collects, uses, and protects your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Hero />

      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <article className="prose prose-lg max-w-none text-gray-700">
            <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
            <p className="text-sm text-gray-500 mt-2">Effective Date: 01 December 2025</p>

            <p className="mt-6">
              myQS ("we", "us", "our") operates <a href="https://www.myqs.co.ke" className="text-blue-900 underline">www.myqs.co.ke</a> 
              and provides professional quantity surveying services across Kenya and Africa.
            </p>

            <p>We are committed to protecting your privacy and handling your personal information responsibly in accordance with the Kenya Data Protection Act 2019, GDPR (where applicable), and global best practices.</p>

            <h2>1. Information We Collect</h2>
            <p>We collect information in two ways:</p>

            <h3>a) Information you give us directly</h3>
            <ul>
              <li>Name, email address, phone number</li>
              <li>Company name and project details (budget, location, scope, drawings)</li>
              <li>Any other information you provide when requesting a quote, signing up, or contacting us</li>
            </ul>

            <h3>b) Information collected automatically</h3>
            <ul>
              <li>IP address, browser type, device information</li>
              <li>Pages visited, time spent, referring site</li>
              <li>Cookies and similar tracking technologies (see section 6)</li>
            </ul>

            <h2>2. How We Do NOT Collect</h2>
            <ul>
              <li>Sensitive personal data (religion, health, ethnicity, political opinions, etc.)</li>
              <li>Payment card details: all payments are processed by trusted third-party providers</li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <ul>
              <li>To provide quotes and deliver quantity surveying services</li>
              <li>To communicate with you about your project</li>
              <li>To improve our website and services</li>
              <li>To send occasional marketing emails (only with your consent; you can unsubscribe anytime)</li>
              <li>To comply with legal obligations</li>
            </ul>

            <h2>4. Legal Basis for Processing (GDPR & Kenya DPA)</h2>
            <ul>
              <li>Contract: to deliver the services you requested</li>
              <li>Consent: for marketing emails and non-essential cookies</li>
              <li>Legitimate interests: analytics, fraud prevention, service improvement</li>
            </ul>

            <h2>5. Who We Share Your Data With</h2>
            <ul>
              <li>Trusted service providers (email tools, hosting, form processors)</li>
              <li>Google LLC (Analytics & AdSense): USA, protected by EU Standard Contractual Clauses</li>
              <li>Law enforcement or authorities when legally required</li>
            </ul>
            <p className="font-medium">We never sell your personal data.</p>

            <h2>6. Cookies & Tracking Technologies</h2>
            <p>We use cookies for:</p>
            <ul>
              <li>Essential site functions</li>
              <li>Google Analytics (performance & insights)</li>
              <li>Google AdSense (personalised/relevant ads)</li>
            </ul>
            <p>You can manage your preferences via the cookie banner or browser settings. See our <a href="/cookie-policy" className="text-blue-900 underline">Cookie Policy</a> for details.</p>

            <h2>7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion</li>
              <li>Object to or restrict processing</li>
              <li>Withdraw consent anytime</li>
            </ul>
            <p>Contact us at <a href="mailto:info@myqs.co.ke" className="text-blue-900">info@myqs.co.ke</a> to exercise your rights.</p>

            <h2>8. Data Retention</h2>
            <p>We keep personal data only as long as necessary (usually up to 7 years for legal/tax purposes) and delete it securely when no longer needed.</p>

            <h2>9. Security</h2>
            <p>We use industry-standard security measures to protect your data. However, no method is 100% secure, so we cannot guarantee absolute security.</p>

            <h2>10. Children</h2>
            <p>Our services are not directed at children under 16. We do not knowingly collect data from children.</p>

            <h2>11. Changes to This Policy</h2>
            <p>We may update this policy. Significant changes will be announced on the website or via email.</p>

            <h2>12. Contact Us</h2>
            <p>
              Questions? Contact our Data Protection Officer:<br />
              Email: <a href="mailto:info@myqs.co.ke" className="text-blue-900">info@myqs.co.ke</a><br />
              Address: Nairobi, Kenya
            </p>

            <p className="mt-12 text-sm text-gray-500">
              Thank you for trusting myQS with your information.
            </p>
          </article>
        </div>
      </section>

      <Footer />
    </>
  );
}