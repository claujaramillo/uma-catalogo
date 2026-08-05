'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { categories } from '@/lib/data';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isDarkBgInitially = pathname === '/' || pathname === '/catalogo';
  const shouldBeWhite = isDarkBgInitially && !scrolled;

  const getNavLinkStyle = (): React.CSSProperties => ({
    color: shouldBeWhite ? '#ffffff' : 'var(--uma-cacao)',
    fontFamily: 'var(--font-body)',
    fontSize: '0.875rem',
    fontWeight: 500,
    letterSpacing: '0.04em',
    textDecoration: 'none',
    transition: 'color 0.2s',
  });

  return (
    <header
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        transition: 'all 0.35s ease',
        backgroundColor: scrolled ? 'rgba(250, 245, 236, 0.97)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(220,200,173,0.4)' : '1px solid transparent',
        boxShadow: scrolled ? '0 2px 20px rgba(58,40,29,0.06)' : 'none',
      }}
    >
      <div className="container-uma" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px' }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <Image 
            src="/logo/uma-logo.svg" 
            alt="UMA Mercado Consciente" 
            width={48} height={48} 
            priority 
            style={{ 
              height: '42px', 
              width: 'auto',
              filter: shouldBeWhite ? 'brightness(0) invert(1)' : 'none',
              transition: 'filter 0.3s'
            }} 
          />
        </Link>

        {/* Desktop nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="hidden-mobile">
          <Link href="/" style={getNavLinkStyle()}>Inicio</Link>
          
          <div 
            style={{ position: 'relative' }}
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <Link href="/catalogo" style={{ ...getNavLinkStyle(), display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              Catálogo <span style={{ fontSize: '0.6rem' }}>▼</span>
            </Link>
            
            {dropdownOpen && (
              <div style={{ position: 'absolute', top: '100%', left: '-1rem', paddingTop: '0.5rem' }}>
                <div style={{
                  background: 'var(--uma-marfil)',
                  border: '1px solid rgba(220,200,173,0.3)',
                  borderRadius: '2px',
                  padding: '1rem 0',
                  minWidth: '240px',
                  boxShadow: '0 10px 40px rgba(58,40,29,0.08)',
                  display: 'flex', flexDirection: 'column',
                }}>
                  <Link href="/catalogo" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem', color: 'var(--uma-cacao)', textDecoration: 'none' }}>
                    <strong>Todos los productos</strong>
                  </Link>
                  {categories.map(cat => (
                    <Link 
                      key={cat.slug} 
                      href={`/catalogo?categoria=${cat.slug}`} 
                      style={{ padding: '0.5rem 1.2rem', fontSize: '0.85rem', color: 'var(--uma-taupe)', textDecoration: 'none', transition: 'color 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--uma-arcilla)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--uma-taupe)'}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' }}
          className="show-mobile"
          aria-label="Menú"
        >
          <span style={{ display: 'block', width: '22px', height: '2px', background: shouldBeWhite ? '#ffffff' : 'var(--uma-cacao)', marginBottom: '5px', transition: 'all 0.3s', transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
          <span style={{ display: 'block', width: '22px', height: '2px', background: shouldBeWhite ? '#ffffff' : 'var(--uma-cacao)', marginBottom: '5px', transition: 'all 0.3s', opacity: menuOpen ? 0 : 1 }} />
          <span style={{ display: 'block', width: '22px', height: '2px', background: shouldBeWhite ? '#ffffff' : 'var(--uma-cacao)', transition: 'all 0.3s', transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          background: 'var(--uma-marfil)', borderTop: '1px solid var(--uma-arena)',
          padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem',
        }}>
          <Link href="/" style={{ ...getNavLinkStyle(), color: 'var(--uma-cacao)', fontSize: '1rem' }} onClick={() => setMenuOpen(false)}>Inicio</Link>
          <Link href="/catalogo" style={{ ...getNavLinkStyle(), color: 'var(--uma-cacao)', fontSize: '1rem' }} onClick={() => setMenuOpen(false)}>Catálogo (Todos)</Link>
          {categories.map(cat => (
            <Link 
              key={cat.slug} 
              href={`/catalogo?categoria=${cat.slug}`} 
              style={{ ...getNavLinkStyle(), color: 'var(--uma-taupe)', fontSize: '0.9rem', paddingLeft: '1rem' }} 
              onClick={() => setMenuOpen(false)}
            >
              • {cat.name}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) { .hidden-mobile { display: none !important; } .show-mobile { display: block !important; } }
        @media (min-width: 769px) { .show-mobile { display: none !important; } }
      `}</style>
    </header>
  );
}
