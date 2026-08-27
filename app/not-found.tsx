"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const G = {
  green:      '#2B9361',
  greenLight: '#E9F4EE',
  dark:       '#1A1D1F',
  muted:      '#6F767E',
  border:     '#EFEFEF',
  bgWhite:    '#FFFFFF',
  bgAlt:      '#FAFAFA',
  bgWarm:     '#FAF8F4',
};

export default function NotFound() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse coordinates from -1 to 1
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMouse({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <main style={{ fontFamily: "'DM Sans','Inter',sans-serif", overflowX: 'hidden', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', perspective: '1000px' }} className="pt-28 pb-12 sm:pt-36 sm:pb-20 px-4 sm:px-6">
      
      {/* ─── CSS ANIMATIONS ────────────────────────────────────── */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes floatKettlebell {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
          100% { transform: translateY(0px); }
        }
        .outline-text {
          font-size: clamp(4.5rem, 16vw, 14rem);
          font-weight: 900;
          line-height: 0.85;
          letter-spacing: -0.05em;
          color: transparent;
          -webkit-text-stroke: 2.5px ${G.dark};
          transition: color 0.3s, -webkit-text-stroke 0.3s, text-shadow 0.3s;
          cursor: default;
          position: relative;
          z-index: 2;
        }
        .outline-text:hover {
          color: ${G.green};
          -webkit-text-stroke: 2.5px ${G.green};
          text-shadow: 0 20px 60px rgba(43,147,97,0.4);
        }
        .not-found-link {
          color: ${G.muted};
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s;
          padding: 6px 14px;
          border-radius: 99px;
        }
        .not-found-link:hover {
          color: ${G.green} !important;
          background: ${G.greenLight};
          transform: translateY(-2px);
        }
      `}} />

      {/* Dynamic Cursor-Following Glow */}
      <div 
        style={{ 
          position: 'absolute', 
          top: '50%', left: '50%', 
          width: '70vw', height: '70vw', 
          maxWidth: 700, maxHeight: 700, 
          borderRadius: '50%', 
          background: 'radial-gradient(circle,rgba(43,147,97,0.12) 0%,transparent 70%)', 
          pointerEvents: 'none', 
          zIndex: 0, 
          transition: 'transform 0.1s ease-out',
          transform: `translate(calc(-50% + ${mouse.x * 30}px), calc(-50% + ${mouse.y * 30}px))`
        }} 
      />

      <div style={{ maxWidth: 800, margin: '0 auto', width: '100%', position: 'relative', zIndex: 1, textAlign: 'center' }}>
        
        {/* Massive Animated & Interactive 404 */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 'clamp(6px, 1.5vw, 16px)', marginBottom: 20, position: 'relative' }}>
           
           <div className="outline-text" style={{ transition: 'transform 0.2s ease-out', transform: `translate(${mouse.x * -15}px, ${mouse.y * -15}px)` }}>
             4
           </div>
           
           <div 
            style={{ 
              position: 'relative', 
              width: 'clamp(65px, 18vw, 160px)', 
              height: 'clamp(65px, 18vw, 160px)', 
              borderRadius: '50%', 
              overflow: 'hidden', 
              boxShadow: '0 20px 40px rgba(0,0,0,0.12)', 
              zIndex: 1, 
              border: `3px solid ${G.bgWhite}`,
              transition: 'transform 0.15s ease-out',
              transform: `translate(${mouse.x * 12}px, ${mouse.y * 12}px) rotate(${mouse.x * 12}deg)`
            }}
           >
              <div style={{ width: '100%', height: '100%', animation: 'floatKettlebell 6s ease-in-out infinite' }}>
                <Image 
                  src="/images/system/404-kettlebell.jpg"
                  alt="0"
                  fill
                  style={{ objectFit: 'cover' }}
                  priority
                />
              </div>
           </div>

           <div className="outline-text" style={{ transition: 'transform 0.2s ease-out', transform: `translate(${mouse.x * -18}px, ${mouse.y * -18}px)` }}>
             4
           </div>
        </div>

        <h1 style={{ fontSize: 'clamp(28px,4.5vw,50px)', fontWeight: 800, letterSpacing: '-0.03em', color: G.dark, marginBottom: 14, lineHeight: 1.15 }}>
          You wandered off <span style={{ color: G.green, fontStyle: 'italic' }}>the mat.</span>
        </h1>
        <p className="text-sm sm:text-base mb-6 sm:mb-8" style={{ color: G.muted, fontSize: 16, maxWidth: 500, margin: '0 auto 32px', lineHeight: 1.68 }}>
          This page seems to have skipped <strong style={{color: G.dark}}>Leg Day</strong>. It doesn&apos;t exist, has been moved, or is taking a rest day. Let&apos;s get you back on track.
        </p>
        
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" className="btn-primary" style={{ padding: '13px 30px', fontSize: 15, boxShadow: '0 8px 24px rgba(43,147,97,0.25)' }}>
            Back to Home
          </Link>
          <Link href="/contact" className="btn-secondary" style={{ padding: '13px 30px', fontSize: 15, background: G.bgWhite, border: `1px solid ${G.border}` }}>
            Contact Support
          </Link>
        </div>
        
        <div style={{ marginTop: 48, paddingTop: 24 }}>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { label: "Product", href: "/product" },
              { label: "Pricing", href: "/pricing" },
              { label: "Blog", href: "/blog" },
              { label: "Contact", href: "/contact" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="not-found-link"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
