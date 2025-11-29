import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Services from '@/components/Services';
import GrowWithUs from '@/components/GrowWithUs';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'myQS, Professional Quantity Surveying Services',
  description: 'Delivering comprehensive quantity surveying solutions across all sectors of the built environment with precision, integrity, and innovation. Connect with qualified quantity surveyors in Kenya.',
  keywords: 'quantity surveying, QS services, construction cost management, Nairobi, Africa,  Kenya, quantity surveyor, cost estimation, project management',
  authors: [{ name: 'myQS' }],
  openGraph: {
    title: 'myQS, Professional Quantity Surveying Services',
    description: 'Comprehensive quantity surveying solutions with precision, integrity, and innovation.',
    url: 'https://www.myqs.co.ke',
    siteName: 'myQS',
    locale: 'en_KE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'myQS, Professional Quantity Surveying Services',
    description: 'Comprehensive quantity surveying solutions with precision, integrity, and innovation.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1a2332] to-[#0a1525]">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <GrowWithUs />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}