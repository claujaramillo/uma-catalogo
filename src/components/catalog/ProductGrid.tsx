'use client';
import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from './ProductCard';
import { Product } from '@/types';
import { categories } from '@/lib/data';

interface ProductGridProps {
  products: Product[];
  initialCategory?: string;
  showSearch?: boolean;
  showFilters?: boolean;
}

export default function ProductGrid({
  products,
  initialCategory = 'todos',
  showSearch = true,
  showFilters = true,
}: ProductGridProps) {
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get('categoria');
  
  const [activeCategory, setActiveCategory] = useState(urlCategory || initialCategory);
  const [prevUrlCategory, setPrevUrlCategory] = useState(urlCategory);
  const [searchQuery, setSearchQuery] = useState('');
  type SortOption = 'destacados' | 'precio-asc' | 'precio-desc' | 'nombre-asc';
  const [sortOption, setSortOption] = useState<SortOption>('destacados');

  if (urlCategory !== prevUrlCategory) {
    setPrevUrlCategory(urlCategory);
    if (urlCategory) {
      setActiveCategory(urlCategory);
    }
  }

  const filtered = useMemo(() => {
    let result = products.filter(p => p.is_available);
    if (activeCategory !== 'todos') {
      const cat = categories.find(c => c.slug === activeCategory);
      if (cat) result = result.filter(p => p.category_id === cat.id);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.short_desc.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q)) ||
        p.benefits.some(b => b.toLowerCase().includes(q))
      );
    }
    // Sort
    if (sortOption === 'precio-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'precio-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'nombre-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // destacados
      result.sort((a, b) => (a.is_featured === b.is_featured ? 0 : a.is_featured ? -1 : 1));
    }

    return result;
  }, [products, activeCategory, searchQuery, sortOption]);

  // Count per category for badge
  const countByCategory = useMemo(() => {
    const map: Record<string, number> = { todos: products.filter(p => p.is_available).length };
    categories.forEach(cat => {
      map[cat.slug] = products.filter(p => p.is_available && p.category_id === cat.id).length;
    });
    return map;
  }, [products]);

  return (
    <div>
      {/* Controls Bar */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: '2rem',
        marginBottom: '3.5rem',
        paddingBottom: '2rem',
        borderBottom: '1px solid rgba(220,200,173,0.3)',
      }}>
        {/* Category filter & Sort */}
        {showFilters && (
          <div style={{
            display: 'flex',
            gap: '2.5rem',
            flexWrap: 'wrap',
            flex: '1 1 auto',
          }}>
            <div style={{ position: 'relative', flex: '1', minWidth: '200px', maxWidth: '280px' }}>
              <span style={{ display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--uma-taupe)', marginBottom: '0.4rem', fontWeight: 600 }}>
                Categoría
              </span>
              <select
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                style={{
                  appearance: 'none',
                  width: '100%',
                  padding: '0.6rem 2rem 0.6rem 0',
                  border: 'none',
                  borderBottom: '1px solid var(--uma-arena)',
                  background: 'transparent',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.95rem',
                  color: 'var(--uma-cacao)',
                  outline: 'none',
                  cursor: 'pointer',
                  transition: 'border-color 0.3s',
                }}
                onFocus={e => (e.target.style.borderColor = 'var(--uma-arcilla)')}
                onBlur={e => (e.target.style.borderColor = 'var(--uma-arena)')}
              >
                <option value="todos">Todos los productos ({countByCategory['todos']})</option>
                {categories
                  .filter(cat => (countByCategory[cat.slug] || 0) > 0)
                  .map(cat => (
                    <option key={cat.id} value={cat.slug}>
                      {cat.name} ({countByCategory[cat.slug] || 0})
                    </option>
                  ))}
              </select>
              <span style={{ position: 'absolute', right: '0', bottom: '0.8rem', pointerEvents: 'none', fontSize: '0.6rem', color: 'var(--uma-taupe)' }}>▼</span>
            </div>

            <div style={{ position: 'relative', flex: '1', minWidth: '200px', maxWidth: '280px' }}>
              <span style={{ display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--uma-taupe)', marginBottom: '0.4rem', fontWeight: 600 }}>
                Ordenar por
              </span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                style={{
                  appearance: 'none',
                  width: '100%',
                  padding: '0.6rem 2rem 0.6rem 0',
                  border: 'none',
                  borderBottom: '1px solid var(--uma-arena)',
                  background: 'transparent',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.95rem',
                  color: 'var(--uma-cacao)',
                  outline: 'none',
                  cursor: 'pointer',
                  transition: 'border-color 0.3s',
                }}
                onFocus={e => (e.target.style.borderColor = 'var(--uma-arcilla)')}
                onBlur={e => (e.target.style.borderColor = 'var(--uma-arena)')}
              >
                <option value="destacados">Destacados</option>
                <option value="precio-asc">Precio: Menor a Mayor</option>
                <option value="precio-desc">Precio: Mayor a Menor</option>
                <option value="nombre-asc">Nombre: A a la Z</option>
              </select>
              <span style={{ position: 'absolute', right: '0', bottom: '0.8rem', pointerEvents: 'none', fontSize: '0.6rem', color: 'var(--uma-taupe)' }}>▼</span>
            </div>
          </div>
        )}

        {/* Search */}
        {showSearch && (
          <div style={{ position: 'relative', flex: '0 1 320px', minWidth: '240px' }}>
            <span style={{ display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'transparent', marginBottom: '0.4rem', userSelect: 'none' }}>
              Buscar
            </span>
            <span style={{
              position: 'absolute', left: '0', bottom: '0.8rem',
              color: 'var(--uma-taupe)', fontSize: '1rem', pointerEvents: 'none', opacity: 0.7
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </span>
            <input
              type="search"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Buscar productos..."
              style={{
                width: '100%',
                padding: '0.6rem 0 0.6rem 2.2rem',
                border: 'none',
                borderBottom: '1px solid var(--uma-arena)',
                background: 'transparent',
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                color: 'var(--uma-cacao)',
                outline: 'none',
                transition: 'border-color 0.3s',
              }}
              onFocus={e => (e.target.style.borderColor = 'var(--uma-arcilla)')}
              onBlur={e => (e.target.style.borderColor = 'var(--uma-arena)')}
            />
          </div>
        )}
      </div>

      {/* Results count */}
      <p style={{ fontSize: '0.8rem', color: 'var(--uma-taupe)', marginBottom: '1.5rem' }}>
        {filtered.length === 0
          ? 'No se encontraron productos'
          : `Mostrando ${filtered.length} producto${filtered.length !== 1 ? 's' : ''}`}
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--uma-taupe)' }}>
          <p style={{ fontSize: '2rem', marginBottom: '1rem' }}></p>
          <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem' }}>No encontramos ese producto</p>
          <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Prueba con otro término o explora todas las categorías.
          </p>
          <button className="btn-outline" style={{ marginTop: '1.5rem' }} onClick={() => { setSearchQuery(''); setActiveCategory('todos'); }}>
            Ver todos los productos
          </button>
        </div>
      ) : (
        <div className="product-grid" style={{ marginBottom: '3rem' }}>
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
