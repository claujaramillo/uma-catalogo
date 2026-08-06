import { getProducts } from '@/lib/db';
import Link from 'next/link';
import ProductListClient from '@/components/admin/ProductListClient';

export default async function AdminProducts() {
  const products = await getProducts();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', color: 'var(--uma-cacao)' }}>
          Productos
        </h1>
        <Link 
          href="/admin/productos/nuevo"
          className="uma-btn-primary"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.7rem 1.5rem',
            background: 'var(--uma-cacao)',
            color: 'var(--uma-marfil)',
            textDecoration: 'none',
            borderRadius: '4px',
            fontSize: '0.9rem',
            fontWeight: 600,
            transition: 'background 0.2s',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Añadir producto nuevo
        </Link>
      </div>

      <ProductListClient initialProducts={products} />
    </div>
  );
}
