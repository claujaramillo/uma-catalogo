import Link from 'next/link';
import Image from 'next/image';
import { categories } from '@/lib/data';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: 'var(--uma-cacao)',
      color: 'var(--uma-marfil)',
      paddingBlock: '3rem',
    }}>
      <div className="container-uma">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2.5rem',
          marginBottom: '2.5rem',
        }}>
          {/* Brand */}
          <div>
            <Image
              src="/logo/uma-logo.svg"
              alt="UMA"
              width={48} height={48}
              style={{ height: '40px', width: 'auto', marginBottom: '1rem', filter: 'brightness(0) invert(1) opacity(0.85)' }}
            />
            <p style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', lineHeight: 1.7, color: 'rgba(250,245,236,0.8)', maxWidth: '220px' }}>
              Mercado consciente para una vida más plena y natural.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--uma-arcilla)', marginBottom: '1rem' }}>
              Catálogo
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {categories.map(cat => (
                <Link key={cat.slug} href={`/catalogo?categoria=${cat.slug}`} style={{ color: 'rgba(250,245,236,0.7)', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }}>
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--uma-arcilla)', marginBottom: '1rem' }}>
              Contacto
            </h4>
            <p style={{ color: 'rgba(250,245,236,0.7)', fontSize: '0.875rem', lineHeight: 1.8 }}>
              Pedidos por WhatsApp<br />
              <span style={{ color: 'var(--uma-ambar)' }}>Respondemos pronto</span>
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          marginTop: '4rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid rgba(220,200,173,0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <p style={{ color: 'rgba(250,245,236,0.7)', fontSize: '0.875rem', marginBottom: '0.4rem' }}>
              © {new Date().getFullYear()} UMA Mercado Consciente. Con amor por la naturaleza.
            </p>
            <p style={{ color: 'rgba(250,245,236,0.5)', fontSize: '0.72rem' }}>
              Cuidamos de ti y del planeta
            </p>
          </div>
          <Link href="/admin" style={{ color: 'rgba(250,245,236,0.35)', textDecoration: 'none', fontSize: '0.7rem' }}>
            Panel Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
