import Link from 'next/link';
import { getSetting } from '@/lib/db';

export default async function HeroSection() {
  const bgImage = await getSetting('home_hero_image', '/hero_uma2.jpg');
  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: 'var(--uma-cacao)',
      }}
    >
      {/* Background image */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }} />

      {/* Subtle dark gradient overlay for text readability */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, rgba(58,40,29,0.15) 0%, rgba(58,40,29,0.4) 40%, rgba(58,40,29,0.85) 100%)',
      }} />



      {/* Content */}
      <div className="container-uma" style={{ position: 'relative', zIndex: 2, textAlign: 'center', paddingTop: '100px', paddingBottom: '80px' }}>


        {/* Pre-heading */}
        <p
          className="animate-fadeInUp delay-100"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--uma-ambar)',
            marginBottom: '1.2rem',
          }}
        >
          Mercado Consciente
        </p>

        {/* Main headline */}
        <h1
          className="animate-fadeInUp delay-200"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.4rem, 6vw, 4.5rem)',
            fontWeight: 500,
            color: 'var(--uma-marfil)',
            lineHeight: 1.15,
            maxWidth: '700px',
            margin: '0 auto 1.5rem',
            letterSpacing: '-0.02em',
          }}
        >
          Lo que le das a tu cuerpo,<br />
          <em style={{ color: 'var(--uma-ambar)', fontStyle: 'italic', fontWeight: 400 }}>se lo das al mundo.</em>
        </h1>

        {/* Subtitle */}
        <p
          className="animate-fadeInUp delay-300"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(1rem, 2vw, 1.15rem)',
            color: 'rgba(250,245,236,0.75)',
            maxWidth: '520px',
            margin: '0 auto 2.5rem',
            lineHeight: 1.7,
          }}
        >
          Productos naturales, biocosmética y snacks conscientes para una vida más plena.
        </p>

        {/* CTAs */}
        <div className="animate-fadeInUp delay-400" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/catalogo" className="btn-primary" style={{ fontSize: '0.9rem', padding: '0.9rem 2.2rem' }}>
            Explorar catálogo
          </Link>
          <Link
            href="#destacados"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              color: 'rgba(250,245,236,0.8)', fontFamily: 'var(--font-body)',
              fontSize: '0.85rem', fontWeight: 500, letterSpacing: '0.04em',
              textDecoration: 'none', transition: 'color 0.2s',
            }}
          >
            Ver destacados ↓
          </Link>
        </div>

        {/* Scroll indicator */}
        <div style={{ marginTop: '4rem', opacity: 0.5 }}>
          <div style={{
            width: '1px', height: '50px',
            background: 'linear-gradient(to bottom, var(--uma-ambar), transparent)',
            margin: '0 auto',
            animation: 'pulse 2s infinite',
          }} />
        </div>
      </div>
    </section>
  );
}
