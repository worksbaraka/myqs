'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X, User } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const navLinks = [
    { href: '#home', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#grow', label: 'Grow with us' },
    { href: '#contact', label: 'Contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-black/90 backdrop-blur-[25px]'
          : 'bg-black/80 backdrop-blur-[20px]'
      } border-b border-white/10 shadow-md`}
    >
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto px-6 py-3">
        {/* Hamburger Menu - Left */}
        <button
          onClick={toggleMenu}
          className="p-2 rounded-full hover:bg-white/10 transition-all duration-300 hover:scale-110"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="w-5 h-5 text-green-400 transition-transform duration-300" />
          ) : (
            <Menu className="w-5 h-5 text-white hover:text-green-400 transition-transform duration-300" />
          )}
        </button>

        {/* Logo - Center */}
        <a
          href="#"
          className="text-2xl font-black transition-all duration-300 hover:scale-105"
        >
          <span className="text-white">my</span>
          <span className="text-[#FFD60A]">QS</span>
        </a>

        {/* User Icon - Right */}
        <div className="relative">
          <button
            onClick={toggleUserMenu}
            className="p-2 rounded-full hover:bg-white/10 transition-all duration-300 hover:scale-110 group"
            aria-label="User menu"
          >
            <User className="w-5 h-5 text-white group-hover:text-green-400" />
          </button>

          {/* User Dropdown Menu */}
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl animate-in slide-in-from-top-2 duration-200">
              <div className="p-2">
                <button className="w-full text-left px-4 py-3 text-white/80 hover:text-green-400 hover:bg-white/5 rounded-xl transition-all duration-200 font-medium">
                  Sign In
                </button>
                <button className="w-full text-left px-4 py-3 text-white/80 hover:text-green-400 hover:bg-white/5 rounded-xl transition-all duration-200 font-medium">
                  Register
                </button>
                <div className="h-px bg-white/10 my-2"></div>
                <button className="w-full text-left px-4 py-3 text-white/80 hover:text-green-400 hover:bg-white/5 rounded-xl transition-all duration-200 font-medium">
                  Profile
                </button>
                <button className="w-full text-left px-4 py-3 text-white/80 hover:text-green-400 hover:bg-white/5 rounded-xl transition-all duration-200 font-medium">
                  Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile/Collapsed Menu Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={toggleMenu}
        >
          <div
            className="absolute top-20 left-1/2 transform -translate-x-1/2 w-[90%] max-w-sm bg-black/90 backdrop-blur-xl rounded-2xl border border-white/10 p-6 animate-in slide-in-from-top-4 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block text-white/80 hover:text-green-400 font-medium transition-all duration-300 py-3 px-4 rounded-xl hover:bg-white/5"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Close user menu when clicking outside */}
      {isUserMenuOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;