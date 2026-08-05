import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { formatPrice } from '@/lib/data';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const position = product.image_position || 'center center';

  return (
    <article className="product-card">
      <Link href={`/catalogo/${product.slug}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Image */}
        <div className="product-card__img-wrap">
          <Image
            src={product.image_url}
            alt={product.name}
            width={400}
            height={400}
            className="product-card__img"
            style={{ 
              objectFit: 'cover', 
              objectPosition: position, 
              width: '100%', 
              height: '100%' 
            }}
          />

          {/* Out of stock overlay */}
          {!product.is_available && (
            <div style={{
              position: 'absolute', inset: 0,
              background: 'rgba(250,245,236,0.75)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ color: 'var(--uma-taupe)', fontWeight: 600, fontSize: '0.85rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Sin stock
              </span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="product-card__body">
          {/* Brand */}
          {product.brand && (
            <p style={{
              fontSize: '0.68rem',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--uma-arcilla)',
              marginBottom: '0.3rem',
            }}>
              {product.brand}
            </p>
          )}

          {/* Name */}
          <h3 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(0.95rem, 2vw, 1.05rem)',
            fontWeight: 500,
            color: 'var(--uma-cacao)',
            marginBottom: '0.4rem',
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {product.name}
          </h3>

          {/* Short desc */}
          <p style={{
            fontSize: '0.8rem',
            color: 'var(--uma-taupe)',
            lineHeight: 1.5,
            marginBottom: '0.9rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {product.short_desc}
          </p>

          {/* Price row */}
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 'auto' }}>
            <div>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.1rem',
                fontWeight: 600,
                color: 'var(--uma-cacao)',
              }}>
                {formatPrice(product.price)}
              </span>
              {product.price_label && (
                <span style={{ fontSize: '0.75rem', color: 'var(--uma-taupe)', marginLeft: '0.25rem' }}>
                  {product.price_label}
                </span>
              )}
            </div>
            <span style={{
              fontSize: '0.75rem',
              color: 'var(--uma-arcilla)',
              fontWeight: 500,
              letterSpacing: '0.03em',
            }}>
              Ver →
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
