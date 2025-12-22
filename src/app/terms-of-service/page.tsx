// src/app/terms-of-service/page.tsx
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";

export const metadata = {
  title: "Terms of Service – myQS",
  description: "Terms governing the use of myQS quantity surveying services and website.",
};

export default function TermsOfServicePage() {
  return (
    <>
      <Hero />

      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <article className="prose prose-lg max-w-none text-gray-700">
            <h1 className="text-4xl font-bold text-gray-900">Terms of Service</h1>
            <p className="text-sm text-gray-500 mt-2">Effective Date: 01 December 2025</p>

            <p className="mt-6">
              Welcome to myQS. These Terms of Service ("Terms") govern your use of <a href="https://www.myqs.co.ke" className="text-blue-900 underline">www.myqs.co.ke</a> 
              (the "Site") and our professional quantity surveying services (collectively, the "Services").
            </p>

            <p>By accessing or using the Services, you agree to these Terms. If you do not agree, do not use the Services.</p>

            <h2>1. Our Services</h2>
            <p>myQS provides:</p>
            <ul>
              <li>In-house quantity surveying by our team of chartered QSs (led by the CEO & Founder)</li>
              <li>Cost planning, Bills of Quantities, value engineering, procurement advice</li>
              <li>Referrals to certified QS partners when needed</li>
              <li>Project support across Kenya and East Africa</li>
            </ul>
            <p>We are not liable for third-party QS performance if referred.</p>

            <h2>2. Eligibility</h2>
            <p>You must be at least 18 years old or of legal age in your jurisdiction to use the Services.</p>

            <h2>3. User Accounts</h2>
            <p>If you create an account:</p>
            <ul>
              <li>Provide accurate information</li>
              <li>Keep your credentials secure</li>
              <li>You are responsible for all activity on your account</li>
            </ul>

            <h2>4. Fees & Payment</h2>
            <p>Fees for services will be quoted upfront. Payments via M-Pesa, bank transfer, or other secure methods. Late payments may incur 1.5% monthly interest. No refunds except as required by law.</p>

            <h2>5. Intellectual Property</h2>
            <p>All content on the Site is owned by myQS. You may not copy, modify, or distribute without permission.</p>

            <h2>6. Disclaimers</h2>
            <p>Services provided "as is." We do not guarantee uninterrupted access or perfect outcomes (construction estimates have uncertainties).</p>

            <h2>7. Limitation of Liability</h2>
            <p>To the extent permitted by law, myQS is not liable for indirect, consequential, or punitive damages. Our total liability is limited to fees paid in the last 12 months.</p>

            <h2>8. Governing Law</h2>
            <p>These Terms are governed by the laws of Kenya. Disputes resolved in Nairobi courts.</p>

            <h2>9. Changes to Terms</h2>
            <p>We may update these Terms. Continued use after changes means acceptance.</p>

            <h2>10. Contact Us</h2>
            <p>Questions? Email: <a href="mailto:info@myqs.co.ke" className="text-blue-900">info@myqs.co.ke</a></p>

            <p className="mt-12 text-sm text-gray-500">
              Let's build smarter together.
            </p>
          </article>
        </div>
      </section>

      <Footer />
    </>
  );
}