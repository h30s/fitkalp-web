'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, MessageCircle, Mail } from 'lucide-react';

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

const footerLinks = {
  'Product 🏋️': [
    { name: 'Product CRM', href: '/product' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Case Studies', href: '/case-studies' },
  ],
  'Company 🏢': [
    { name: 'About Us', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ],
  'Legal ⚖️': [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ],
};

const socials = [
  {
    icon: InstagramIcon,
    href: 'https://www.instagram.com/fitkalp.gym/',
    label: 'Instagram',
    external: true,
  },
  {
    icon: MessageCircle,
    href: 'https://wa.me/919410004994?text=Hi%20Himanshu,%20I%20have%20a%20question%20about%20FitKalp',
    label: 'WhatsApp',
    external: true,
  },
  {
    icon: Mail,
    href: 'mailto:fitkalp.gym@gmail.com',
    label: 'Email',
    external: false,
  },
];

export default function Footer() {
  return (
    <div className="pb-6 px-3 sm:px-4 md:px-8 mt-12">
      {/* 
        Floating Island Footer
        Uses brand-charcoal to perfectly match the theme's dark color.
      */}
      <footer className="bg-brand-charcoal rounded-[1.75rem] md:rounded-[2.5rem] pt-8 sm:pt-10 md:pt-14 pb-6 px-4 sm:px-6 md:px-12 font-inter relative overflow-hidden shadow-2xl">
        
        {/* Subtle Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-green/5 blur-[120px] rounded-full pointer-events-none translate-x-1/3 -translate-y-1/3" />
        
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col gap-8 sm:gap-10">
          
          {/* Top Section: CTA & Brand */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 sm:gap-8 border-b border-white/10 pb-8 sm:pb-10">
            <div className="max-w-xl">
              <Link href="/" className="inline-flex items-center mb-4 group transition-opacity hover:opacity-90">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-3.5 py-1.5 sm:px-4 sm:py-2 shadow-lg border border-white/20">
                  <Image
                    src="/logo.png"
                    alt="FitKalp"
                    width={150}
                    height={52}
                    className="h-8 sm:h-9 w-auto object-contain"
                  />
                </div>
              </Link>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-3 leading-tight">
                Simple software for <br className="hidden sm:block" />
                <span className="text-brand-green">hardworking gyms.</span>
              </h3>
              <p className="text-white/60 text-sm sm:text-base max-w-lg leading-relaxed">
                Built specifically for Indian gym and fitness studio owners. Stop losing time to notebooks and WhatsApp — manage your members and payments with clarity.
              </p>
            </div>
            
            <div className="bg-white/5 border border-white/10 p-4 sm:p-5 rounded-[1.5rem] backdrop-blur-md w-full lg:w-auto">
              <p className="text-white font-medium mb-3 text-sm sm:text-base flex items-center gap-2">
                Have questions or want a walkthrough?
              </p>
              <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
                <Link
                  href="/register"
                  className="bg-brand-green text-white px-5 sm:px-6 py-3 rounded-2xl font-bold hover:bg-brand-green-dark hover:-translate-y-1 transition-all duration-300 shadow-[0_0_20px_rgba(22,163,74,0.3)] text-center text-sm sm:text-base"
                >
                  Book a Demo
                </Link>
                <Link
                  href="/pricing"
                  className="bg-white/10 text-white px-5 sm:px-6 py-3 rounded-2xl font-bold hover:bg-white/20 transition-all duration-300 text-center text-sm sm:text-base"
                >
                  View Pricing
                </Link>
              </div>
            </div>
          </div>

          {/* Middle Section: Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <p className="text-white/50 text-sm mb-4 leading-relaxed">
                FitKalp is simple, reliable gym management CRM software designed for Indian fitness businesses.
              </p>
              <div className="flex gap-3">
                {socials.map((social, i) => (
                  <a
                    key={i}
                    href={social.href}
                    aria-label={social.label}
                    target={social.external ? '_blank' : undefined}
                    rel={social.external ? 'noopener noreferrer' : undefined}
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 transition-all duration-300 hover:bg-brand-green hover:border-brand-green hover:text-white hover:-translate-y-1 hover:rotate-3 shadow-sm"
                  >
                    <social.icon size={18} strokeWidth={2} />
                  </a>
                ))}
              </div>
            </div>

            <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-6">
              {Object.entries(footerLinks).map(([title, links]) => (
                <div key={title} className="flex flex-col">
                  <h4 className="text-white font-bold text-[15px] mb-4">{title}</h4>
                  <ul className="flex flex-col gap-3">
                    {links.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-white/60 hover:text-brand-green transition-colors duration-200 flex items-center gap-2 group text-sm font-medium"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-green opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Section */}
          <div className="pt-6 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-white/5">
            <p className="text-sm text-white/40 font-medium">
              © {new Date().getFullYear()} FitKalp. Building better gyms. 🏆
            </p>
            
            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-2xl border border-white/10 backdrop-blur-sm">
              <span className="text-sm text-white/60">Made with</span>
              <Heart size={14} className="text-brand-green fill-brand-green animate-bounce" />
              <span className="text-sm text-white/60">& lots of ☕ in India</span>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}
