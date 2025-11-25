// src/app/about/page.tsx
import Hero from "@/components/Hero";
import About from "@/components/About";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import GrowWithUs from "@/components/GrowWithUs";
import Services from "@/components/Services"; // if you want extra content

export const metadata = {
  title: "About myQS – Professional Quantity Surveyors in Kenya",
  description: "Nairobi-based quantity surveying firm with in-house chartered team delivering cost planning, BoQs, and budget management across East Africa.",
};

export default function AboutPage() {
  return (
    <>
      {/* Reuse your existing Hero exactly as on homepage */}
      <Hero />

      {/* Full custom About content — no props needed */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">
            About myQS
          </h1>

          <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
            <p className="text-xl leading-relaxed">
              myQS is a professional quantity surveying practice based in <strong>Nairobi, Kenya</strong>, founded and led by a chartered quantity surveyor with over 15 years of experience in construction projects across East Africa.
            </p>

            <p className="text-lg">
              We are not just a referral platform — we have our own <strong>in-house team of registered quantity surveyors</strong> who personally deliver:
            </p>

            <ul className="list-disc pl-8 space-y-3 text-lg">
              <li>Accurate cost planning and budget development</li>
              <li>Detailed Bills of Quantities (BoQs)</li>
              <li>Value engineering and cost optimization</li>
              <li>Procurement advice and tender management</li>
              <li>Full project cost control from inception to final account</li>
            </ul>

            <p className="text-lg">
              Our clients include property developers, contractors, architects, and homeowners working on residential, commercial, industrial, and infrastructure projects in Kenya, Uganda, Tanzania, Rwanda, and beyond.
            </p>

            <p className="text-lg font-semibold">
              We help you avoid budget overruns, delays, and costly mistakes — so you can build with confidence.
            </p>
          </div>
        </div>
      </section>

      {/* Optional: reuse your existing components for more content */}
      <GrowWithUs />
      {/* <Services /> */} {/* Uncomment if you want */}

      {/* Contact Section with real details */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-10">Get In Touch</h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="text-left space-y-5 text-lg">
              <p><strong>Email:</strong> <a href="mailto:info@myqs.co.ke" className="underline hover:opacity-80">info@myqs.co.ke</a></p>
              <p><strong>Phone / WhatsApp:</strong> +254 700 123 456</p>
              <p><strong>Location:</strong> Nairobi, Kenya</p>
              <p className="text-sm opacity-90 pt-4">
                Registered in Kenya • Member of Institute of Quantity Surveyors of Kenya (IQSK)
              </p>
            </div>
            
            <div className="bg-white text-gray-900 p-6 rounded-lg">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}