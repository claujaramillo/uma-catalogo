import type { Metadata } from 'next';
import { Suspense } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductGrid from '@/components/catalog/ProductGrid';
import { getProducts, getSetting } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Catálogo — UMA Mercado Consciente',
  description: 'Explora todos nuestros productos de biocosmética, cuidado personal, snacks naturales y más. Pide por WhatsApp.',
};

export default async function CatalogoPage() {
  const products = await getProducts();
  const bgImage = await getSetting('catalog_hero_image', '/hero_uma2.jpg');
  const focalPoint = await getSetting('catalog_hero_focal', '50% 50%');

  return (
    <>
      <Header />
      <main>
        {/* Page header */}
        <div style={{
          position: 'relative',
          paddingBlock: 'clamp(8rem, 12vw, 12rem) clamp(4rem, 8vw, 6rem)',
          textAlign: 'center',
          background: 'var(--uma-cacao)',
          overflow: 'hidden',
        }}>
          {/* Background image */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: focalPoint,
          }} />

          {/* Suble overlay for readability */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, rgba(43,26,23,0.4) 0%, rgba(43,26,23,0.8) 100%)',
          }} />

          <div className="container-uma" style={{ position: 'relative', zIndex: 2 }}>
            <span style={{
              display: 'inline-block',
              fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 600,
              letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--uma-marfil)',
              background: 'rgba(43, 26, 23, 0.45)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid rgba(252, 251, 248, 0.12)',
              padding: '0.4rem 1rem',
              borderRadius: '20px',
              marginBottom: '1.2rem',
            }}>
              Productos Naturales
            </span>
            <h1 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              color: 'var(--uma-marfil)',
              marginBottom: '1rem',
            }}>
              Catálogo UMA
            </h1>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '1rem',
              color: 'rgba(250,245,236,0.7)', maxWidth: '480px', margin: '0 auto',
              lineHeight: 1.7,
            }}>
              Todo lo que ves, lo puedes pedir directamente por WhatsApp.
            </p>
          </div>
        </div>

        {/* Products section */}
        <div className="section-padding" style={{ background: 'var(--uma-marfil)' }}>
          <div className="container-uma">
            <Suspense fallback={<div style={{ textAlign: 'center', padding: '2rem', color: 'var(--uma-taupe)' }}>Cargando catálogo...</div>}>
              <ProductGrid products={products} />
            </Suspense>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
