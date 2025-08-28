import Image from 'next/image';
import Navbar from '../components/Navbar';
import Hero from "../components/Hero";

export default function Home() {
  return (
    <div className="min-h-screen bg-yellow-100 flex flex-col">
      <Navbar />
      <Hero />
    </div>
  );
}