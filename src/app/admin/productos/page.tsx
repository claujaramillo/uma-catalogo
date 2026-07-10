import { getProducts } from '@/lib/db';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/data';

export default async function AdminProducts() {
  const products = await getProducts();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', color: 'var(--uma-cacao)' }}>
          Productos
        </h1>
      </div>

      <div style={{ background: 'white', borderRadius: '4px', border: '1px solid var(--uma-arena)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--uma-marfil)', borderBottom: '1px solid var(--uma-arena)', textAlign: 'left' }}>
              <th style={{ padding: '1rem', color: 'var(--uma-taupe)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Producto</th>
              <th style={{ padding: '1rem', color: 'var(--uma-taupe)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Precio</th>
              <th style={{ padding: '1rem', color: 'var(--uma-taupe)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Estado</th>
              <th style={{ padding: '1rem', color: 'var(--uma-taupe)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} style={{ borderBottom: '1px solid rgba(220,200,173,0.3)' }}>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', position: 'relative', borderRadius: '4px', overflow: 'hidden', background: 'var(--uma-crema)' }}>
                      <Image src={product.image_url} alt={product.name} fill style={{ objectFit: 'cover' }} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--uma-cacao)', fontSize: '0.95rem' }}>{product.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--uma-taupe)' }}>{product.category_id}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '1rem', color: 'var(--uma-cacao)' }}>{formatPrice(product.price)}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    padding: '0.25rem 0.6rem', 
                    borderRadius: '20px', 
                    fontSize: '0.75rem', 
                    fontWeight: 600,
                    background: product.is_available ? '#d4edda' : '#f8d7da',
                    color: product.is_available ? '#155724' : '#721c24'
                  }}>
                    {product.is_available ? 'Activo' : 'Agotado'}
                  </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <Link href={`/admin/productos/editar/${product.id}`} style={{ color: 'var(--uma-arcilla)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
