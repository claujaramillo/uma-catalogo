import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getCategoryById, formatPrice, generateWhatsAppUrl } from '@/lib/data';
import { getProductBySlug, getProducts, getWhatsAppNumber } from '@/lib/db';
import { stripEmojis } from '@/lib/utils';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: 'Producto no encontrado — UMA' };
  return {
    title: `${stripEmojis(product.name)} — UMA Mercado Consciente`,
    description: stripEmojis(product.short_desc),
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const category = getCategoryById(product.category_id);
  const whatsappNumber = await getWhatsAppNumber();
  const waUrl = generateWhatsAppUrl(product, whatsappNumber);

  // Related products from same category
  const allProducts = await getProducts();
  const related = allProducts
    .filter(p => p.category_id === product.category_id && p.id !== product.id && p.is_available)
    .slice(0, 3);

  const fit = product.image_fit || (product.tags.includes('no-crop') ? 'contain' : 'cover');
  const position = product.image_position || 'center center';

  return (
    <>
      <Header />
      <main style={{ paddingTop: '70px' }}>
        {/* Breadcrumb */}
        <div style={{ background: 'var(--uma-crema)', borderBottom: '1px solid var(--uma-arena)' }}>
          <div className="container-uma" style={{ paddingBlock: '0.75rem' }}>
            <nav style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.8rem', color: 'var(--uma-taupe)' }}>
              <Link href="/" className="link-editorial" style={{ color: 'var(--uma-taupe)', textDecoration: 'none' }}>Inicio</Link>
              <span>/</span>
              <Link href="/catalogo" className="link-editorial" style={{ color: 'var(--uma-taupe)', textDecoration: 'none' }}>Catálogo</Link>
              <span>/</span>
              <span style={{ color: 'var(--uma-arcilla)' }}>{stripEmojis(product.name)}</span>
            </nav>
          </div>
        </div>

        {/* Product detail */}
        <div className="section-padding" style={{ background: 'var(--uma-marfil)' }}>
          <div className="container-uma">
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 'clamp(2rem, 6vw, 5rem)',
              alignItems: 'start',
            }}>
              {/* Left — Image */}
              <div>
                <div style={{
                  borderRadius: '4px',
                  overflow: 'hidden',
                  background: 'var(--uma-crema)',
                  aspectRatio: '1/1',
                  position: 'relative',
                }}>
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    style={{ 
                      objectFit: fit, 
                      objectPosition: position,
                      padding: '0'
                    }}
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />

                </div>
              </div>

              {/* Right — Info */}
              <div style={{ position: 'sticky', top: '100px' }}>
                {/* Category + brand */}
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                  {category && (
                    <span className="tag-badge">
                      {stripEmojis(category.name)}
                    </span>
                  )}
                  {product.brand && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--uma-arcilla)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      {product.brand}
                    </span>
                  )}
                </div>

                {/* Name */}
                <h1 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
                  fontWeight: 600,
                  color: 'var(--uma-cacao)',
                  lineHeight: 1.2,
                  marginBottom: '0.75rem',
                }}>
                  {stripEmojis(product.name)}
                </h1>

                {/* Price */}
                <div style={{ 
                  marginBottom: '2rem', 
                  display: 'flex', 
                  alignItems: 'baseline', 
                  gap: '0.5rem',
                  borderBottom: '1px solid rgba(220,200,173,0.3)',
                  paddingBottom: '1.5rem'
                }}>
                  <span style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.8rem',
                    fontWeight: 600,
                    color: 'var(--uma-cacao)',
                  }}>
                    {formatPrice(product.price)}
                  </span>
                  {product.price_label && (
                    <span style={{ color: 'var(--uma-taupe)', fontSize: '0.9rem', letterSpacing: '0.02em' }}>
                      {product.price_label}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.95rem',
                  color: 'var(--uma-taupe)',
                  lineHeight: 1.8,
                  marginBottom: '1.5rem',
                  whiteSpace: 'pre-line'
                }}>
                  {stripEmojis(product.description)}
                </p>

                {/* Benefits */}
                {product.benefits.length > 0 && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{
                      fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em',
                      textTransform: 'uppercase', color: 'var(--uma-arcilla)', marginBottom: '0.75rem',
                    }}>
                      Beneficios
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {product.benefits.map(b => (
                        <span key={b} className="benefit-chip">{stripEmojis(b)}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Ingredients */}
                {product.ingredients && (
                  <div style={{
                    marginBottom: '2rem',
                    paddingTop: '1.5rem',
                    borderTop: '1px solid rgba(220,200,173,0.3)',
                  }}>
                    <p style={{
                      fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.12em',
                      textTransform: 'uppercase', color: 'var(--uma-arcilla)', marginBottom: '0.8rem',
                    }}>
                      Ingredientes
                    </p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--uma-taupe)', lineHeight: 1.8 }}>
                      {product.ingredients}
                    </p>
                  </div>
                )}

                {/* Tags */}
                {product.tags.length > 0 && (
                  <div style={{ marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {product.tags.map(tag => (
                      <span key={tag} className="tag-badge">#{stripEmojis(tag)}</span>
                    ))}
                  </div>
                )}

                {/* WhatsApp CTA */}
                {product.is_available ? (
                  <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Pedir por WhatsApp
                  </a>
                ) : (
                  <div style={{
                    background: 'var(--uma-crema)', border: '1px solid var(--uma-arena)',
                    borderRadius: '4px', padding: '1rem', textAlign: 'center',
                    color: 'var(--uma-taupe)', fontSize: '0.875rem',
                  }}>
                    Este producto no está disponible por el momento
                  </div>
                )}

                {/* Back link */}
                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                  <Link href="/catalogo" className="link-editorial" style={{
                    fontSize: '0.8rem', color: 'var(--uma-taupe)', textDecoration: 'none',
                    letterSpacing: '0.04em',
                  }}>
                    ← Volver al catálogo
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="section-padding" style={{ background: 'var(--uma-crema)' }}>
            <div className="container-uma">
              <h2 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.4rem, 3vw, 2rem)',
                color: 'var(--uma-cacao)',
                marginBottom: '2rem',
                textAlign: 'center',
              }}>
                También te puede interesar
              </h2>
              <div className="product-grid">
                {related.map(p => {
                  const pPosition = p.image_position || 'center center';
                  return (
                  <Link key={p.id} href={`/catalogo/${p.slug}`} style={{ textDecoration: 'none' }}>
                    <article className="product-card">
                      <div className="product-card__img-wrap">
                        <Image src={p.image_url} alt={p.name} width={400} height={400} className="product-card__img" style={{ objectFit: 'cover', objectPosition: pPosition, width: '100%', height: '100%' }} />
                      </div>
                      <div className="product-card__body">
                        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', color: 'var(--uma-cacao)', marginBottom: '0.4rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{stripEmojis(p.name)}</h3>
                        <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 500, color: 'var(--uma-cacao)' }}>{formatPrice(p.price)}</span>
                      </div>
                    </article>
                  </Link>
                )})}
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
