import { getProducts, initDb } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { formatPrice } from '@/lib/data';

export default async function AdminDashboard() {
  const products = await getProducts();
  const hasDb = !!process.env.POSTGRES_URL;

  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.is_available).length;
  const outOfStock = totalProducts - activeProducts;
  const categoriesCount = new Set(products.map(p => p.category_id)).size;
  const averagePrice = products.length ? products.reduce((acc, p) => acc + p.price, 0) / products.length : 0;

  async function handleInitDb() {
    'use server';
    await initDb();
    revalidatePath('/admin');
  }

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', color: 'var(--uma-cacao)', marginBottom: '2rem' }}>
        Resumen de la Tienda
      </h1>

      {!hasDb && (
        <div style={{ background: '#FFF3CD', border: '1px solid #FFEEBA', padding: '1.5rem', borderRadius: '4px', marginBottom: '2rem', color: '#856404' }}>
          <h3 style={{ marginBottom: '0.5rem', fontWeight: 600 }}>Base de datos no conectada</h3>
          <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
            Actualmente estás viendo los datos de prueba. Para poder guardar cambios, necesitas conectar Vercel Postgres en tu panel de Vercel y agregar la variable POSTGRES_URL a tu entorno.
          </p>
        </div>
      )}

      {hasDb && (
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '4px', border: '1px solid var(--uma-arena)', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ color: 'var(--uma-cacao)', marginBottom: '0.3rem' }}>Base de datos conectada</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--uma-taupe)' }}>Si acabas de conectar la base de datos y no ves tus productos, haz clic en inicializar para copiarlos.</p>
          </div>
          <form action={handleInitDb}>
            <button className="btn-outline" style={{ padding: '0.6rem 1rem', fontSize: '0.8rem' }}>Inicializar / Migrar Datos</button>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        <div style={{ background: 'white', padding: '2rem', borderRadius: '4px', border: '1px solid var(--uma-arena)' }}>
          <h3 style={{ color: 'var(--uma-taupe)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem', fontWeight: 600 }}>Total Productos</h3>
          <p style={{ fontSize: '3rem', fontFamily: 'var(--font-heading)', color: 'var(--uma-cacao)', lineHeight: 1 }}>{totalProducts}</p>
        </div>
        
        <div style={{ background: 'white', padding: '2rem', borderRadius: '4px', border: '1px solid var(--uma-arena)' }}>
          <h3 style={{ color: 'var(--uma-taupe)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem', fontWeight: 600 }}>Productos Activos</h3>
          <p style={{ fontSize: '3rem', fontFamily: 'var(--font-heading)', color: 'var(--uma-cacao)', lineHeight: 1 }}>
            {activeProducts}
          </p>
        </div>

        <div style={{ background: 'white', padding: '2rem', borderRadius: '4px', border: '1px solid var(--uma-arena)' }}>
          <h3 style={{ color: 'var(--uma-taupe)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem', fontWeight: 600 }}>Agotados</h3>
          <p style={{ fontSize: '3rem', fontFamily: 'var(--font-heading)', color: 'var(--uma-cacao)', lineHeight: 1 }}>
            {outOfStock}
          </p>
        </div>

        <div style={{ background: 'white', padding: '2rem', borderRadius: '4px', border: '1px solid var(--uma-arena)' }}>
          <h3 style={{ color: 'var(--uma-taupe)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem', fontWeight: 600 }}>Categorías</h3>
          <p style={{ fontSize: '3rem', fontFamily: 'var(--font-heading)', color: 'var(--uma-cacao)', lineHeight: 1 }}>
            {categoriesCount}
          </p>
        </div>

        <div style={{ background: 'white', padding: '2rem', borderRadius: '4px', border: '1px solid var(--uma-arena)', gridColumn: '1 / -1' }}>
          <h3 style={{ color: 'var(--uma-taupe)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem', fontWeight: 600 }}>Precio Promedio del Catálogo</h3>
          <p style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', color: 'var(--uma-cacao)', lineHeight: 1 }}>
            {formatPrice(averagePrice)}
          </p>
        </div>
      </div>
    </div>
  );
}
