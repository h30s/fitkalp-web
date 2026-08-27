import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';
import { BLOG_POSTS } from '../data';
import type { Metadata } from 'next';

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

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const post = BLOG_POSTS.find((p) => p.slug === resolvedParams.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found | FitKalp',
    };
  }

  return {
    title: `${post.title} | FitKalp Blog`,
    description: `Read about ${post.title} on FitKalp - Gym Management Software.`,
  };
}

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: Props) {
  const resolvedParams = await params;
  const post = BLOG_POSTS.find((p) => p.slug === resolvedParams.slug);

  if (!post) {
    notFound();
  }

  return (
    <main style={{ fontFamily: "'DM Sans','Inter',sans-serif", overflowX: 'hidden', minHeight: '100vh', paddingBottom: 80 }}>
      {/* ═══ 1. HEADER / META ═══════════════════════════════════════════════ */}
      <section className="pt-28 pb-8 sm:pt-36 sm:pb-10">
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 16px' }} className="px-4 sm:px-6">
          <Link href="/blog" className="back-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: G.muted, textDecoration: 'none', fontSize: 13.5, fontWeight: 500, marginBottom: 24, transition: 'color 0.2s' }}>
            <ArrowLeft size={16} /> Back to all articles
          </Link>
          
          <div style={{ marginBottom: 16 }}>
            <span style={{ display: 'inline-block', padding: '5px 14px', background: G.greenLight, color: G.green, fontSize: 12, fontWeight: 600, borderRadius: 999 }}>
              {post.category}
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(26px,4.5vw,46px)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.18, color: G.dark, marginBottom: 20 }}>
            {post.title}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 13, color: G.muted, borderTop: `1px solid ${G.border}`, paddingTop: 18, flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Calendar size={15} />
              {post.date}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Clock size={15} />
              {post.readTime}
            </span>
          </div>
        </div>
      </section>

      {/* ═══ 2. HERO IMAGE ════════════════════════════════════════════════ */}
      <section style={{ maxWidth: 960, margin: '0 auto' }} className="py-6 sm:py-10 px-4 sm:px-6 flex justify-center">
        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: 20, overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.06)' }}>
          <Image 
            src={post.image} 
            alt={post.title}
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
      </section>

      {/* ═══ 3. ARTICLE CONTENT ═══════════════════════════════════════════ */}
      <section style={{ maxWidth: 800, margin: '0 auto' }} className="px-4 sm:px-6">
        <div 
          className="blog-content p-5 sm:p-8 md:p-12"
          style={{
            background: G.bgWhite,
            borderRadius: 24,
            boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
            border: `1px solid ${G.border}`,
          }}
        >
          <style dangerouslySetInnerHTML={{__html: `
            .back-link:hover {
              color: ${G.green} !important;
            }
            .cta-btn:hover {
              background: #22784F !important;
            }
            .blog-content {
              font-size: 16px;
              line-height: 1.75;
              color: #333;
            }
            @media (min-width: 640px) {
              .blog-content {
                font-size: 17.5px;
                line-height: 1.8;
              }
            }
            .blog-content p {
              margin-bottom: 20px;
            }
            .blog-content h3 {
              font-size: 20px;
              font-weight: 700;
              color: ${G.dark};
              margin-top: 32px;
              margin-bottom: 14px;
              line-height: 1.3;
            }
            @media (min-width: 640px) {
              .blog-content h3 {
                font-size: 23px;
                margin-top: 40px;
                margin-bottom: 16px;
              }
            }
            .blog-content ul {
              margin-bottom: 20px;
              padding-left: 20px;
            }
            .blog-content li {
              margin-bottom: 10px;
            }
            .blog-content strong {
              color: ${G.dark};
            }
          `}} />
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </section>
      
      {/* ═══ 4. BOTTOM CTA ════════════════════════════════════════════════ */}
      <section style={{ maxWidth: 960, margin: '48px auto 0' }} className="px-4 sm:px-6">
        <div
          className="py-10 px-5 sm:py-16 sm:px-8"
          style={{
            background: G.bgWhite,
            border: `1px solid ${G.border}`,
            borderRadius: 28,
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.04)',
          }}
        >
          {/* Decorative green glow */}
          <div style={{ position: 'absolute', top: -80, left: '50%', transform: 'translateX(-50%)', width: 400, height: 300, borderRadius: '50%', background: 'radial-gradient(circle,rgba(43,147,97,0.08) 0%,transparent 70%)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <span style={{ display: 'inline-block', fontSize: 13, color: G.green, fontWeight: 600, background: G.greenLight, padding: '5px 16px', borderRadius: 99, marginBottom: 18 }}>
              Ready to transform your gym?
            </span>
            <h2 style={{ fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 700, letterSpacing: '-0.02em', color: G.dark, marginBottom: 14, lineHeight: 1.18 }}>
              Take control of your <span style={{ color: G.green, fontStyle: 'italic' }}>Growth</span>
            </h2>
            <p className="text-sm sm:text-base" style={{ color: G.muted, fontSize: 15.5, marginBottom: 28, maxWidth: 500, margin: '0 auto 28px', lineHeight: 1.68 }}>
              Join thousands of gym owners who are scaling their business with FitKalp's all-in-one management software.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/register?intent=trial" className="btn-primary w-full sm:w-auto" style={{ padding: '13px 28px', fontSize: 15, minHeight: 48 }}>
                Start Free Trial
              </Link>
              <Link href="/register" className="btn-secondary w-full sm:w-auto" style={{ padding: '13px 28px', fontSize: 15, minHeight: 48 }}>
                Book a Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
