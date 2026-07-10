'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logoutAction } from '@/app/admin/actions';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const getNavStyle = (path: string) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    color: pathname === path ? 'var(--uma-marfil)' : 'rgba(220, 200, 173, 0.7)',
    backgroundColor: pathname === path ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
    textDecoration: 'none',
    padding: '0.85rem 1.2rem',
    borderRadius: '4px',
    transition: 'all 0.2s',
    fontSize: '0.95rem',
    fontWeight: 500,
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--uma-marfil)', fontFamily: 'var(--font-body)' }}>
      {/* Sidebar */}
      <aside style={{
        width: '260px',
        background: 'var(--uma-cacao)',
        color: 'var(--uma-arena)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{ padding: '2rem 1.5rem', borderBottom: '1px solid rgba(220, 200, 173, 0.15)' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', color: 'white', fontSize: '1.5rem', marginBottom: '0.5rem' }}>UMA Admin</h2>
          <Link href="/" style={{ color: 'var(--uma-arcilla)', fontSize: '0.8rem', textDecoration: 'none' }}>← Ir a la tienda</Link>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem 1rem', gap: '0.5rem' }}>
          <Link href="/admin" style={getNavStyle('/admin')}>Resumen</Link>
          <Link href="/admin/productos" style={getNavStyle('/admin/productos')}>Productos</Link>
          <Link href="/admin/configuracion" style={getNavStyle('/admin/configuracion')}>Configuración</Link>
          <Link href="/admin/usuarios" style={getNavStyle('/admin/usuarios')}>Usuarios</Link>
          
          <form action={logoutAction} style={{ marginTop: 'auto' }}>
            <button type="submit" style={{ ...getNavStyle(''), width: '100%', textAlign: 'left', cursor: 'pointer', border: 'none', background: 'transparent' }}>
              Cerrar Sesión
            </button>
          </form>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '3rem 4rem', overflowY: 'auto' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
