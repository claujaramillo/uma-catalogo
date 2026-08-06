'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { categories } from '@/lib/data';
import { stripEmojis } from '@/lib/utils';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const pathname = usePathname();
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && searchOpen) {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/catalogo?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchOpen(false);
      setSearchTerm('');
    }
  };

  const isDarkBgInitially = pathname === '/' || pathname === '/catalogo';
  const shouldBeWhite = isDarkBgInitially && !scrolled && !searchOpen;

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
        backgroundColor: (scrolled || searchOpen) ? 'rgba(252, 251, 248, 0.95)' : 'transparent',
        backdropFilter: (scrolled || searchOpen) ? 'blur(12px)' : 'none',
        borderBottom: (scrolled || searchOpen) ? '1px solid rgba(58,36,34,0.06)' : '1px solid transparent',
        boxShadow: (scrolled || searchOpen) ? '0 4px 30px rgba(58,36,34,0.03)' : 'none',
      }}
    >
      <div className="container-uma" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px', position: 'relative' }}>
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

        {/* Right side nav & actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {/* Desktop nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="hidden-mobile">
            <Link href="/" className="link-editorial" style={getNavLinkStyle()}>Inicio</Link>
            
            <div 
              style={{ position: 'relative' }}
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <Link href="/catalogo" className="link-editorial" style={{ ...getNavLinkStyle(), display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                Catálogo <span style={{ fontSize: '0.6rem' }}>▼</span>
              </Link>
              
              {dropdownOpen && (
                <div style={{ position: 'absolute', top: '100%', left: '-1rem', paddingTop: '0.5rem' }}>
                  <div style={{
                    background: 'var(--uma-marfil)',
                    border: '1px solid rgba(58,36,34,0.05)',
                    borderRadius: '4px',
                    padding: '1rem 0',
                    minWidth: '240px',
                    boxShadow: '0 10px 40px rgba(58,36,34,0.06)',
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
                        {stripEmojis(cat.name)}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Search trigger */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            style={{ 
              background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem',
              color: shouldBeWhite ? '#ffffff' : 'var(--uma-cacao)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'color 0.2s, opacity 0.2s',
              opacity: 0.85
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '1'}
            onMouseLeave={e => e.currentTarget.style.opacity = '0.85'}
            aria-label="Buscar productos"
          >
            {searchOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            )}
          </button>

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
      </div>

      {/* Search Overlay */}
      {searchOpen && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: 'var(--uma-marfil)',
          borderBottom: '1px solid rgba(58,36,34,0.06)',
          boxShadow: '0 10px 40px rgba(58,36,34,0.03)',
          padding: '1.5rem 0',
          animation: 'slideDown 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)'
        }}>
          <div className="container-uma">
            <form onSubmit={handleSearch} style={{ position: 'relative', maxWidth: '800px', margin: '0 auto', display: 'flex', alignItems: 'center' }}>
              <span style={{ position: 'absolute', left: '1rem', color: 'var(--uma-taupe)', pointerEvents: 'none' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </span>
              <input
                ref={searchInputRef}
                type="search"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Buscar productos, beneficios, ingredientes..."
                style={{
                  width: '100%',
                  padding: '1rem 3rem 1rem 3rem',
                  fontSize: '1.1rem',
                  fontFamily: 'var(--font-body)',
                  color: 'var(--uma-cacao)',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '1px solid rgba(58,36,34,0.15)',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderBottomColor = 'var(--uma-cacao)'}
                onBlur={e => e.target.style.borderBottomColor = 'rgba(58,36,34,0.15)'}
              />
              <button 
                type="submit"
                style={{ 
                  position: 'absolute', right: '0', 
                  background: 'none', border: 'none', 
                  color: 'var(--uma-arcilla)', fontSize: '0.85rem', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase',
                  cursor: 'pointer', padding: '0.5rem 1rem' 
                }}
              >
                Buscar
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {menuOpen && !searchOpen && (
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
              • {stripEmojis(cat.name)}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 768px) { .hidden-mobile { display: none !important; } .show-mobile { display: block !important; } }
        @media (min-width: 769px) { .show-mobile { display: none !important; } }
      `}</style>
    </header>
  );
}
