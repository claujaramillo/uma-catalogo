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
    transition: 'all 0.2s ease',
    fontSize: '0.95rem',
    fontWeight: 500,
  });

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .uma-admin-nav-link:hover {
          background-color: rgba(255, 255, 255, 0.05) !important;
          color: rgba(220, 200, 173, 0.95) !important;
        }
        .uma-admin-nav-link.active:hover {
          background-color: rgba(255, 255, 255, 0.15) !important;
          color: var(--uma-marfil) !important;
        }
        .uma-admin-nav-link:focus-visible {
          outline: 2px solid rgba(220, 200, 173, 0.5);
          outline-offset: 2px;
        }
      `}} />
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--uma-marfil)', fontFamily: 'var(--font-body)' }}>
        {/* Sidebar */}
        <aside style={{
          width: '260px',
          background: 'var(--uma-cacao)',
          color: 'var(--uma-arena)',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          overflowY: 'auto'
        }}>
          <div style={{ padding: '2.5rem 1.5rem 2rem', borderBottom: '1px solid rgba(220, 200, 173, 0.15)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.2rem' }}>
            <img 
              src="/logo/uma-logo.svg" 
              alt="UMA Logo" 
              style={{ width: '110px', height: 'auto', filter: 'brightness(0) invert(1)', opacity: 0.95 }} 
            />
            <Link href="/" style={{ color: 'var(--uma-arcilla)', fontSize: '0.8rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem', opacity: 0.9, transition: 'opacity 0.2s' }} onMouseOver={e => e.currentTarget.style.opacity = '1'} onMouseOut={e => e.currentTarget.style.opacity = '0.9'}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              Ir a la tienda
            </Link>
          </div>
          
          <nav style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem 1rem', gap: '0.5rem' }}>
            <Link href="/admin" className={`uma-admin-nav-link ${pathname === '/admin' ? 'active' : ''}`} style={getNavStyle('/admin')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              Resumen
            </Link>
            <Link href="/admin/productos" className={`uma-admin-nav-link ${pathname.startsWith('/admin/productos') ? 'active' : ''}`} style={getNavStyle(pathname.startsWith('/admin/productos') ? pathname : '/admin/productos')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
              Productos
            </Link>
            <Link href="/admin/configuracion" className={`uma-admin-nav-link ${pathname === '/admin/configuracion' ? 'active' : ''}`} style={getNavStyle('/admin/configuracion')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>
              Configuración
            </Link>
            <Link href="/admin/usuarios" className={`uma-admin-nav-link ${pathname === '/admin/usuarios' ? 'active' : ''}`} style={getNavStyle('/admin/usuarios')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Usuarios
            </Link>
            
            <form action={logoutAction} style={{ marginTop: 'auto' }}>
              <button type="submit" className="uma-admin-nav-link" style={{ ...getNavStyle(''), width: '100%', textAlign: 'left', cursor: 'pointer', border: 'none', background: 'transparent' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
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
    </>
  );
}
