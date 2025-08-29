import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import GrowWithUs from '../components/GrowWithUs';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';

export default function Home() {
  return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1a2332] to-[#0a1525]">
        <Navbar />
        <Hero />
        <About />
        <Services />
        <GrowWithUs />
        <ContactForm />
        <Footer />
      </div>
  );
}