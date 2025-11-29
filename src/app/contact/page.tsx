import Navbar from '@/components/Navbar';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Contact Us, myQS',
  description: 'Get in touch with myQS for comprehensive quantity surveying services across all sectors.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1a2332] to-[#0a1525]">
      <Navbar />
      <main className="flex-grow pt-20">
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}