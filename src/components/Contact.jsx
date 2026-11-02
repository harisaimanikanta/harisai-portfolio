import React, { useState } from 'react';
import { Mail, Phone, ArrowUpRight, ArrowUp, Copy, Check } from 'lucide-react';

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('harisai0728ee@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section id="contact" className="py-16 sm:py-24 md:py-36 bg-black text-white relative">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 flex flex-col justify-between">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-10 sm:mb-16 pb-6 sm:pb-8 border-b border-neutral-800">
          <div>
            <span className="font-satoshi text-xs font-bold tracking-[0.2em] sm:tracking-[0.25em] text-neutral-400 uppercase block mb-2 sm:mb-3">
              07 / INITIATE COLLABORATION
            </span>
            <h2 className="font-satoshi text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter uppercase leading-[0.92]">
              HAVE A PROJECT
              <br />
              IN MIND?
            </h2>
          </div>

          <p className="font-inter text-sm sm:text-base md:text-xl text-neutral-400 max-w-sm">
            Let's create something meaningful. Available for freelance assignments, agency partnerships, and commercial productions.
          </p>
        </div>

        {/* Contact Information & Channels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 py-8 sm:py-12 border-b border-neutral-800">
          {/* Direct Email Column */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <span className="font-mono text-xs text-neutral-400 uppercase tracking-widest block mb-2 sm:mb-3">
                DIRECT INBOX
              </span>
              <a
                href="mailto:harisai0728ee@gmail.com"
                className="font-satoshi text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black hover:text-neutral-300 transition-colors tracking-tight break-all block"
              >
                harisai0728ee@gmail.com
              </a>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mt-6">
                <a
                  href="mailto:harisai0728ee@gmail.com"
                  className="px-6 py-3 bg-white text-black font-satoshi font-bold text-xs tracking-widest uppercase hover:bg-neutral-200 transition-colors inline-flex items-center justify-center gap-2 text-center"
                >
                  <Mail size={14} />
                  <span>SEND AN EMAIL</span>
                </a>

                <button
                  onClick={handleCopyEmail}
                  className="px-6 py-3 border border-neutral-700 hover:border-white text-white font-satoshi font-bold text-xs tracking-widest uppercase transition-colors inline-flex items-center justify-center gap-2"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copied ? 'COPIED TO CLIPBOARD' : 'COPY ADDRESS'}</span>
                </button>
              </div>
            </div>

            <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-neutral-800 flex items-center gap-2.5 sm:gap-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-40"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <span className="font-inter text-xs text-neutral-400 uppercase tracking-wider">
                Typical response time: under 12 hours
              </span>
            </div>
          </div>

          {/* Details & Social Channels */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6 sm:gap-8 lg:border-l lg:border-neutral-800 lg:pl-12">
            <div className="flex flex-col gap-5 sm:gap-6">
              {/* Phone */}
              <div>
                <span className="font-mono text-xs text-neutral-400 uppercase tracking-widest block mb-1">
                  CALL OR WHATSAPP
                </span>
                <a
                  href="tel:+918985108403"
                  className="font-satoshi text-lg sm:text-xl md:text-2xl font-bold hover:text-neutral-300 transition-colors block"
                >
                  +91 8985108403
                </a>
              </div>

              {/* Location */}
              <div>
                <span className="font-mono text-xs text-neutral-400 uppercase tracking-widest block mb-1">
                  LOCATION &amp; TIMEZONE
                </span>
                <span className="font-satoshi text-base sm:text-lg font-medium text-white block">
                  Hyderabad, Telangana, India (IST / UTC+5:30)
                </span>
                <span className="text-xs text-neutral-400 font-inter mt-0.5 block">
                  Open to remote global contracts
                </span>
              </div>

              {/* Social Channels */}
              <div className="pt-2 sm:pt-4">
                <span className="font-mono text-xs text-neutral-400 uppercase tracking-widest block mb-2 sm:mb-3">
                  CONNECT &amp; SOCIAL
                </span>
                <div className="flex flex-wrap gap-3 sm:gap-4">
                  {[
                    { label: 'LINKEDIN', href: 'https://linkedin.com' },
                    { label: 'INSTAGRAM', href: 'https://instagram.com' },
                    { label: 'WHATSAPP', href: 'https://wa.me/918985108403' },
                    { label: 'YOUTUBE', href: 'https://youtube.com' },
                  ].map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono tracking-wider text-neutral-300 hover:text-white underline inline-flex items-center gap-1 group"
                    >
                      <span>{s.label}</span>
                      <ArrowUpRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Back to Top */}
            <div className="pt-4 sm:pt-6">
              <button
                onClick={scrollToTop}
                className="inline-flex items-center gap-2 text-xs font-satoshi font-bold tracking-widest uppercase text-neutral-400 hover:text-white transition-colors"
              >
                <span>BACK TO TOP</span>
                <ArrowUp size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Minimal Attribution */}
        <div className="pt-8 sm:pt-12 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs font-mono text-neutral-400 text-center sm:text-left">
          <div>
            DESIGNED &amp; DEVELOPED WITH INTENTION.
          </div>
          <div>
            &copy; HARI SAI 2026. ALL RIGHTS RESERVED.
          </div>
        </div>
      </div>
    </section>
  );
}
