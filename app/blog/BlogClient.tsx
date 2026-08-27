'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import { BLOG_POSTS } from './data';

const CATEGORIES = ['All', 'Gym Management', 'Payments & GST', 'Growth', 'Technology'];

/* ── Design tokens (Finora system) ──────────────────────── */
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



export default function BlogClient() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredPosts = activeCategory === 'All' 
    ? BLOG_POSTS 
    : BLOG_POSTS.filter(post => post.category === activeCategory);

  return (
    <main style={{ fontFamily: "'DM Sans','Inter',sans-serif", overflowX: 'hidden' }}>
      
      {/* ═══ 1. HERO ═══════════════════════════════════════════════ */}
      <section className="pt-28 pb-8 sm:pt-36 sm:pb-14 text-center">
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 16px' }} className="px-4 sm:px-6">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 18px', borderRadius: 999,
              background: G.bgWhite, border: `1px solid ${G.border}`,
              fontSize: 13, fontWeight: 500, color: G.muted,
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: G.green, display: 'inline-block' }} />
              Resources
            </span>
          </div>
          
          <h1 style={{ fontSize: 'clamp(30px,5vw,56px)', fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.1, color: G.dark, marginBottom: 16 }}>
            Guides for Indian <span style={{ color: G.green, fontStyle: 'italic' }}>Gym Owners</span>
          </h1>
          <p className="text-sm sm:text-base" style={{ fontSize: 16, color: G.muted, maxWidth: 640, margin: '0 auto', lineHeight: 1.7 }}>
            Practical advice, operational tips, and insights to help you run a more profitable fitness business.
          </p>
        </div>
      </section>

      {/* ═══ 2. CATEGORY FILTERS ════════════════════════════════════ */}
      <section className="px-4 sm:px-6 pb-2">
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          <div
            className="flex items-center justify-start sm:justify-center gap-2.5 overflow-x-auto pb-2 hide-scrollbar"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                style={{
                  whiteSpace: 'nowrap',
                  padding: '8px 18px',
                  borderRadius: 999,
                  fontSize: 13.5,
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: activeCategory === category ? `1px solid ${G.green}` : `1px solid ${G.border}`,
                  transition: 'all 0.2s ease',
                  background: activeCategory === category ? G.green : G.bgWhite,
                  color: activeCategory === category ? '#FFFFFF' : G.muted,
                  boxShadow: activeCategory === category
                    ? '0 4px 14px rgba(43,147,97,0.25)'
                    : '0 2px 6px rgba(0,0,0,0.03)',
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 3. BLOG GRID ═══════════════════════════════════════════ */}
      <section className="py-8 sm:py-16 px-4 sm:px-6" style={{ minHeight: 450 }}>
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          {filteredPosts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: G.muted, fontSize: 16 }}>
              No articles found in this category.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map(post => (
                <article 
                  key={post.id} 
                  className="glass-card"
                  style={{ 
                    borderRadius: 24, 
                    padding: '24px 22px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    textAlign: 'left'
                  }}
                >
                  <div style={{ marginBottom: 16 }}>
                    <span style={{ display: 'inline-block', padding: '4px 12px', background: G.greenLight, color: G.green, fontSize: 12, fontWeight: 600, borderRadius: 999 }}>
                      {post.category}
                    </span>
                  </div>
                  
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: G.dark, marginBottom: 14, lineHeight: 1.35 }}>
                    <Link href={`/blog/${post.slug}`} style={{ color: 'inherit', textDecoration: 'none' }} onMouseEnter={(e) => (e.currentTarget.style.color = G.green)} onMouseLeave={(e) => (e.currentTarget.style.color = G.dark)}>
                      {post.title}
                    </Link>
                  </h2>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12.5, color: G.muted, marginBottom: 24, marginTop: 'auto' }}>
                    <span>{post.date}</span>
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#D1D5DB' }} />
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={13} />
                      {post.readTime}
                    </span>
                  </div>
                  
                  <Link href={`/blog/${post.slug}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13.5, fontWeight: 600, color: G.green, textDecoration: 'none' }}>
                    Read Article <ArrowRight size={15} />
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══ 4. CTA ═════════════════════════════════════════════════ */}
      <section className="py-10 sm:py-16 px-4 sm:px-6 text-center">
        <div style={{ maxWidth: 540, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(22px,3.5vw,34px)', fontWeight: 700, letterSpacing: '-0.02em', color: G.dark, marginBottom: 12, lineHeight: 1.25 }}>
            New articles <span style={{ color: G.green, fontStyle: 'italic' }}>every week</span>.
          </h2>
          <p className="text-sm sm:text-base" style={{ fontSize: 15, color: G.muted, marginBottom: 24, lineHeight: 1.65 }}>
            Subscribe for updates on gym management best practices and product updates.
          </p>
          <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
            <input 
              type="email" 
              placeholder="Enter your email" 
              required
              style={{ flex: '1 1 220px', padding: '12px 18px', borderRadius: 999, border: `1.5px solid ${G.border}`, fontSize: 14, background: G.bgAlt, outline: 'none' }}
              onFocus={(e) => { e.currentTarget.style.borderColor = G.green; e.currentTarget.style.background = G.bgWhite; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = G.border; e.currentTarget.style.background = G.bgAlt; }}
            />
            <button type="submit" className="btn-primary" style={{ padding: '12px 28px', fontSize: 14 }}>
              Subscribe
            </button>
          </form>
        </div>
      </section>

    </main>
  );
}
