import Head from 'next/head';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import GrowWithUs from '../components/GrowWithUs';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Head>
        <title>myQS - Connect with Certified Quantity Surveyors</title>
        <meta name="description" content="myQS connects contractors, homeowners, and developers with certified Quantity Surveyors across Africa for professional cost management." />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </Head>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1a2332] to-[#0a1525]">
        <Navbar />
        <Hero />
        <About />
        <Services />
        <GrowWithUs />
        <ContactForm />
        <Footer />
      </div>
    </>
  );
}