'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { name: 'Home',     path: '/' },
  { name: 'Product',  path: '/product' },
  { name: 'Pricing',  path: '/pricing' },
  { name: 'About',    path: '/about' },
  { name: 'Blog',     path: '/blog' },
  { name: 'Contact',  path: '/contact' },
];

const G_GREEN = '#2B9361';
const G_BORDER = '#EFEFEF';

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  /* track scroll */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* lock body scroll when mobile menu open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  /* close menu on route change */
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: scrolled ? 12 : 0,
          left: 0,
          right: 0,
          maxWidth: scrolled ? 1000 : '100%',
          width: scrolled ? 'calc(100% - 24px)' : '100%',
          margin: '0 auto',
          zIndex: 200,
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          background: scrolled ? 'rgba(255, 255, 255, 0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(24px) saturate(150%)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(24px) saturate(150%)' : 'none',
          boxShadow: scrolled ? '0 8px 32px rgba(0, 0, 0, 0.06), inset 0 0 0 1px rgba(255, 255, 255, 0.7)' : 'none',
          padding: scrolled ? '8px 0' : '18px 0',
          borderRadius: scrolled ? 100 : 0,
          fontFamily: "'DM Sans','Inter',sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: 1140,
            margin: '0 auto',
            padding: '0 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            width: '100%',
            gap: 12,
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0, zIndex: 2 }}
          >
            <Image
              src="/logo.png"
              alt="FitKalp"
              width={140}
              height={48}
              priority
              style={{
                height: 34,
                width: 'auto',
                objectFit: 'contain',
                display: 'block',
              }}
            />
          </Link>

          {/* Desktop pill nav - Perfectly Centered */}
          <nav
            aria-label="Main navigation"
            style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              background: G_GREEN,
              borderRadius: 999,
              padding: 4,
              gap: 2,
              zIndex: 2,
            }}
            className="fitkalp-desktop-nav"
          >
            {NAV_LINKS.map((link) => {
              const active = pathname === link.path;
              return (
                <Link
                  key={link.name}
                  href={link.path}
                  style={{
                    padding: '7px 17px',
                    fontSize: 14,
                    fontWeight: 500,
                    borderRadius: 999,
                    color: active ? G_GREEN : 'rgba(255,255,255,0.88)',
                    background: active ? '#FFFFFF' : 'transparent',
                    boxShadow: active ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
                    transition: 'all 0.2s ease',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                    lineHeight: 1.4,
                  }}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA buttons */}
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}
            className="fitkalp-desktop-cta"
          >
            <Link
              href="/register?intent=login"
              style={{
                padding: '8px 20px',
                fontSize: 14,
                fontWeight: 600,
                color: '#1A1D1F',
                textDecoration: 'none',
                borderRadius: 999,
                border: '1.5px solid #EFEFEF',
                background: 'transparent',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                lineHeight: 1.4,
                display: 'inline-block',
              }}
            >
              Log In
            </Link>
            <Link
              href="/register"
              className="btn-primary"
              style={{ padding: '8px 20px', fontSize: 14 }}
            >
              Book a Demo
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 8,
              minWidth: 44,
              minHeight: 44,
              alignItems: 'center',
              justifyContent: 'center',
              color: '#1A1D1F',
              zIndex: 300,
              borderRadius: 8,
            }}
            className="fitkalp-mobile-btn"
          >
            {mobileOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          zIndex: 190,
          transform: mobileOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          display: 'flex',
          flexDirection: 'column',
          paddingTop: 88,
          paddingBottom: 'max(32px, env(safe-area-inset-bottom, 32px))',
          paddingLeft: 24,
          paddingRight: 24,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          fontFamily: "'DM Sans','Inter',sans-serif",
        }}
        aria-hidden={!mobileOpen}
      >
        {/* Mobile nav links */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 0, marginBottom: 24 }}>
          {NAV_LINKS.map((link, i) => {
            const active = pathname === link.path;
            return (
              <Link
                key={link.name}
                href={link.path}
                onClick={() => setMobileOpen(false)}
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: active ? G_GREEN : '#1A1D1F',
                  textDecoration: 'none',
                  padding: '16px 0',
                  borderBottom: i < NAV_LINKS.length - 1 ? `1px solid ${G_BORDER}` : 'none',
                  transition: 'color 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  minHeight: 48,
                }}
              >
                <span>{link.name}</span>
                {active && <span style={{ width: 8, height: 8, borderRadius: '50%', background: G_GREEN }} />}
              </Link>
            );
          })}
        </nav>

        {/* Mobile CTA buttons */}
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 16 }}>
          <Link
            href="/register"
            onClick={() => setMobileOpen(false)}
            className="btn-primary"
            style={{ justifyContent: 'center', padding: '14px 24px', fontSize: 16 }}
          >
            Book a Demo
          </Link>
          <Link
            href="/register?intent=login"
            onClick={() => setMobileOpen(false)}
            style={{
              display: 'flex',
              justifyContent: 'center',
              padding: '14px 24px',
              fontSize: 16,
              fontWeight: 600,
              color: '#1A1D1F',
              textDecoration: 'none',
              borderRadius: 999,
              border: '1.5px solid #EFEFEF',
              background: 'transparent',
            }}
          >
            Log In
          </Link>
        </div>
      </div>

      {/* Responsive rules via <style> to avoid Tailwind breakpoint dependency */}
      <style>{`
        .fitkalp-desktop-nav  { display: flex !important; }
        .fitkalp-desktop-cta  { display: flex !important; }
        .fitkalp-mobile-btn   { display: none  !important; }

        @media (max-width: 900px) {
          .fitkalp-desktop-nav { display: none  !important; }
          .fitkalp-desktop-cta { display: none  !important; }
          .fitkalp-mobile-btn  { display: inline-flex  !important; }
        }
      `}</style>
    </>
  );
}
