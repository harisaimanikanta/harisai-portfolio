import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight } from 'lucide-react';

export default function Navbar({ activeSection = 'work' }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'WORK', href: '#work', id: 'work' },
    { label: 'SHOWREEL', href: '#showreel', id: 'showreel' },
    { label: 'ABOUT', href: '#about', id: 'about' },
    { label: 'SERVICES', href: '#services', id: 'services' },
    { label: 'CONTACT', href: '#contact', id: 'contact' },
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-white/85 backdrop-blur-md border-b border-[#EAEAEA] py-4'
            : 'bg-white/60 backdrop-blur-sm border-b border-transparent py-6'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo & Status */}
          <div className="flex items-center gap-6">
            <a
              href="#"
              onClick={(e) => handleNavClick(e, '#hero')}
              className="group flex flex-col items-start"
            >
              <span className="font-satoshi text-lg md:text-xl font-black tracking-tight text-black transition-transform duration-200 group-hover:translate-x-0.5">
                HARI SAI
              </span>
              <span className="text-[10px] tracking-widest text-[#777777] font-medium font-inter">
                VIDEO & MOTION
              </span>
            </a>

            <div className="hidden lg:flex items-center gap-2 pl-6 border-l border-[#EAEAEA]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-40"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-black"></span>
              </span>
              <span className="text-[11px] font-inter font-medium tracking-wide text-[#777777] uppercase">
                Available for Projects
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="group relative py-1 text-[12px] font-inter font-semibold tracking-widest text-black transition-colors"
                >
                  <span className={isActive ? 'text-black' : 'text-[#777777] group-hover:text-black transition-colors'}>
                    {link.label}
                  </span>
                  
                  {/* Minimal Underline */}
                  <span
                    className={`absolute bottom-0 left-0 h-[1.5px] bg-black transition-all duration-200 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </a>
              );
            })}

            {/* Quick CTA */}
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="ml-4 inline-flex items-center gap-1.5 px-4 py-2 text-[11px] font-satoshi font-bold tracking-wider text-white bg-black hover:bg-neutral-800 transition-colors rounded-none"
            >
              LET'S TALK
              <ArrowUpRight size={13} />
            </a>
          </nav>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="md:hidden p-2 text-black hover:bg-[#F5F5F5] transition-colors"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-[73px] z-30 bg-white px-6 py-8 flex flex-col justify-between border-t border-[#EAEAEA] md:hidden"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="font-satoshi text-2xl font-bold tracking-tight text-black hover:text-[#777777] transition-colors flex items-center justify-between border-b border-[#EAEAEA] pb-4"
                >
                  <span>{link.label}</span>
                  <ArrowUpRight size={18} className="text-[#777777]" />
                </a>
              ))}
            </div>

            <div className="pt-6 border-t border-[#EAEAEA]">
              <div className="flex items-center gap-2 mb-4">
                <span className="h-2 w-2 rounded-full bg-black"></span>
                <span className="text-xs font-inter font-medium tracking-wide text-[#777777]">
                  BASED IN HYDERABAD, INDIA
                </span>
              </div>
              <a
                href="mailto:harisai0728ee@gmail.com"
                className="text-sm font-inter text-black underline block"
              >
                harisai0728ee@gmail.com
              </a>
              <a
                href="tel:+918985108403"
                className="text-sm font-inter text-[#777777] mt-1 block"
              >
                +91 8985108403
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
