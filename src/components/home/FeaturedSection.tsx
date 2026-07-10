import Link from 'next/link';
import ProductCard from '@/components/catalog/ProductCard';
import { Product } from '@/types';

interface FeaturedSectionProps {
  products: Product[];
}

export default function FeaturedSection({ products }: FeaturedSectionProps) {
  return (
    <section id="destacados" className="section-padding" style={{ background: 'var(--uma-marfil)' }}>
      <div className="container-uma">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '0.72rem', fontWeight: 700,
            letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--uma-arcilla)',
            marginBottom: '0.75rem',
          }}>
            Selección especial
          </p>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            color: 'var(--uma-cacao)', marginBottom: '1rem',
          }}>
            Nuestros favoritos
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '1rem',
            color: 'var(--uma-taupe)', maxWidth: '480px', margin: '0 auto',
          }}>
            Una cuidadosa selección de los productos que más amamos y recomendamos.
          </p>
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2.5rem',
        }}>
          {products.slice(0, 6).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <Link href="/catalogo" className="btn-outline">
            Ver catálogo completo →
          </Link>
        </div>
      </div>
    </section>
  );
}
