"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const nav = document.querySelector('nav');
      if (nav) nav.classList.add('opacity-100', 'translate-y-0');
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <nav className="flex justify-between items-center py-2 bg-gray-600 text-white font-semibold rounded-2xl mx-4 mt-4 px-4 opacity-0 -translate-y-4 transition-all duration-500 ease-in-out">
      {/* Logo (myQS) */}
      <div className="flex justify-start">
        <Link href="/myqs" className="px-4 bg-black text-white rounded-full py-1 hover:scale-105 transition-transform duration-200">myQS</Link>
      </div>

      {/* Hamburger Icon and Menu for mobile */}
      <div className="flex items-center">
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="p-2 focus:outline-none hover:text-gray-300 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex md:space-x-4">
          <Link href="/" className="px-4 hover:text-gray-300 transition-colors duration-200">home</Link>
          <Link href="/about" className="px-4 hover:text-gray-300 transition-colors duration-200">about</Link>
          <Link href="/grow" className="px-4 hover:text-gray-300 transition-colors duration-200">grow with us</Link>
          <Link href="/contact" className="px-4 hover:text-gray-300 transition-colors duration-200">contact</Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-16 right-4 bg-gray-600 rounded-lg p-4 flex flex-col space-y-2 animate-slide-in">
          <Link href="/" className="px-4 hover:text-gray-300 transition-colors duration-200" onClick={() => setIsOpen(false)}>home</Link>
          <Link href="/about" className="px-4 hover:text-gray-300 transition-colors duration-200" onClick={() => setIsOpen(false)}>about</Link>
          <Link href="/grow" className="px-4 hover:text-gray-300 transition-colors duration-200" onClick={() => setIsOpen(false)}>grow with us</Link>
          <Link href="/contact" className="px-4 hover:text-gray-300 transition-colors duration-200" onClick={() => setIsOpen(false)}>contact</Link>
        </div>
      )}
    </nav>
  );
}