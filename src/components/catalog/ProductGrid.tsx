'use client';
import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from './ProductCard';
import { Product } from '@/types';
import { categories } from '@/lib/data';
import { stripEmojis } from '@/lib/utils';

function CustomSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedLabel = options.find(o => o.value === value)?.label || '';

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.75rem 1.2rem',
          background: 'var(--uma-blanco)',
          border: isOpen ? '1px solid var(--uma-miel)' : '1px solid rgba(58,36,34,0.12)',
          borderRadius: '6px',
          fontFamily: 'var(--font-body)',
          fontSize: '0.9rem',
          color: 'var(--uma-cacao)',
          cursor: 'pointer',
          outline: 'none',
          boxShadow: isOpen ? '0 0 0 3px rgba(196,154,69,0.1)' : '0 2px 8px rgba(58,36,34,0.02)',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={e => {
          if (!isOpen) e.currentTarget.style.borderColor = 'rgba(58,36,34,0.25)';
        }}
        onMouseLeave={e => {
          if (!isOpen) e.currentTarget.style.borderColor = 'rgba(58,36,34,0.12)';
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selectedLabel}
        </span>
        <span style={{ 
          fontSize: '0.65rem', 
          color: 'var(--uma-taupe)',
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)'
        }}>▼</span>
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          left: 0,
          right: 0,
          background: 'var(--uma-blanco)',
          border: '1px solid rgba(58,36,34,0.08)',
          borderRadius: '6px',
          boxShadow: '0 12px 32px rgba(58,36,34,0.06)',
          zIndex: 50,
          maxHeight: '280px',
          overflowY: 'auto',
          padding: '0.5rem',
        }}>
          {options.map(opt => {
            const isActive = opt.value === value;
            return (
              <div
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                style={{
                  padding: '0.6rem 0.8rem',
                  fontSize: '0.875rem',
                  color: isActive ? 'var(--uma-cacao)' : 'var(--uma-taupe)',
                  fontWeight: isActive ? 500 : 400,
                  cursor: 'pointer',
                  borderRadius: '4px',
                  background: isActive ? 'var(--uma-crema)' : 'transparent',
                  transition: 'background 0.2s ease, color 0.2s ease',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'var(--uma-crema)';
                    e.currentTarget.style.color = 'var(--uma-cacao)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--uma-taupe)';
                  }
                }}
              >
                {opt.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface ProductGridProps {
  products: Product[];
  initialCategory?: string;
  showFilters?: boolean;
}

export default function ProductGrid({
  products,
  initialCategory = 'todos',
  showFilters = true,
}: ProductGridProps) {
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get('categoria');
  const urlQuery = searchParams.get('q') || '';
  
  const [activeCategory, setActiveCategory] = useState(urlCategory || initialCategory);
  const [prevUrlCategory, setPrevUrlCategory] = useState(urlCategory);
  
  // New Filters
  const [benefitFilter, setBenefitFilter] = useState('todos');
  
  // Sort
  type SortOption = 'destacados' | 'precio-asc' | 'precio-desc' | 'nombre-asc' | 'nombre-desc' | 'categoria';
  const [sortOption, setSortOption] = useState<SortOption>('destacados');

  // View Mode
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Load More (Pagination)
  const [visibleCount, setVisibleCount] = useState(12);

  if (urlCategory !== prevUrlCategory) {
    setPrevUrlCategory(urlCategory);
    if (urlCategory) {
      setActiveCategory(urlCategory);
    }
  }

  // Reset pagination when filters change (without useEffect to avoid cascading renders)
  const currentFiltersKey = `${activeCategory}|${urlQuery}|${sortOption}|${benefitFilter}`;
  const [prevFiltersKey, setPrevFiltersKey] = useState(currentFiltersKey);
  
  if (currentFiltersKey !== prevFiltersKey) {
    setPrevFiltersKey(currentFiltersKey);
    setVisibleCount(12);
  }

  // Extract all unique benefits from available products
  const allBenefits = useMemo(() => {
    const set = new Set<string>();
    products.filter(p => p.is_available).forEach(p => p.benefits.forEach(b => set.add(b)));
    return Array.from(set).sort();
  }, [products]);

  const filtered = useMemo(() => {
    let result = products.filter(p => p.is_available);
    
    if (activeCategory !== 'todos') {
      const cat = categories.find(c => c.slug === activeCategory);
      if (cat) result = result.filter(p => p.category_id === cat.id);
    }

    if (benefitFilter !== 'todos') {
      result = result.filter(p => p.benefits.includes(benefitFilter));
    }

    if (urlQuery.trim()) {
      const q = urlQuery.toLowerCase();
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
    } else if (sortOption === 'nombre-desc') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortOption === 'categoria') {
      result.sort((a, b) => a.category_id.localeCompare(b.category_id));
    } else {
      // destacados
      result.sort((a, b) => (a.is_featured === b.is_featured ? 0 : a.is_featured ? -1 : 1));
    }

    return result;
  }, [products, activeCategory, urlQuery, sortOption, benefitFilter]);

  // Count per category for badge (unfiltered by benefit to show true category size)
  const countByCategory = useMemo(() => {
    const map: Record<string, number> = { todos: products.filter(p => p.is_available).length };
    categories.forEach(cat => {
      map[cat.slug] = products.filter(p => p.is_available && p.category_id === cat.id).length;
    });
    return map;
  }, [products]);

  const categoryOptions = [
    { value: 'todos', label: `Todas las categorías (${countByCategory['todos']})` },
    ...categories
      .filter(cat => (countByCategory[cat.slug] || 0) > 0)
      .map(cat => ({
        value: cat.slug,
        label: `${stripEmojis(cat.name)} (${countByCategory[cat.slug] || 0})`
      }))
  ];

  const benefitOptions = [
    { value: 'todos', label: 'Todos los beneficios' },
    ...allBenefits.map(b => ({ value: b, label: stripEmojis(b) }))
  ];

  const sortOptions = [
    { value: 'destacados', label: 'Destacados' },
    { value: 'precio-asc', label: 'Precio: Menor a Mayor' },
    { value: 'precio-desc', label: 'Precio: Mayor a Menor' },
    { value: 'nombre-asc', label: 'Nombre: A - Z' },
    { value: 'nombre-desc', label: 'Nombre: Z - A' },
    { value: 'categoria', label: 'Categoría' },
  ];

  const hasActiveFilters = activeCategory !== 'todos' || benefitFilter !== 'todos';

  const clearFilters = () => {
    setActiveCategory('todos');
    setBenefitFilter('todos');
  };

  return (
    <div>
      {/* Premium Filters Bar */}
      <div style={{
        background: 'var(--uma-blanco)',
        border: '1px solid rgba(58,36,34,0.06)',
        borderRadius: '8px',
        boxShadow: '0 6px 24px rgba(58,36,34,0.03)',
        padding: '1.5rem 2rem',
        marginBottom: '1.5rem',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          gap: '1.5rem',
          justifyContent: 'space-between',
        }}>
          {showFilters && (
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', flex: '1 1 auto' }}>
              <div style={{ flex: '1', minWidth: '220px', maxWidth: '300px' }}>
                <label style={{ display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--uma-taupe)', marginBottom: '0.5rem', fontWeight: 600 }}>Categoría</label>
                <CustomSelect value={activeCategory} onChange={setActiveCategory} options={categoryOptions} />
              </div>
              <div style={{ flex: '1', minWidth: '180px', maxWidth: '280px' }}>
                <label style={{ display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--uma-taupe)', marginBottom: '0.5rem', fontWeight: 600 }}>Beneficio / Uso</label>
                <CustomSelect value={benefitFilter} onChange={setBenefitFilter} options={benefitOptions} />
              </div>
              <div style={{ flex: '1', minWidth: '200px', maxWidth: '280px' }}>
                <label style={{ display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--uma-taupe)', marginBottom: '0.5rem', fontWeight: 600 }}>Ordenar por</label>
                <CustomSelect value={sortOption} onChange={(val) => setSortOption(val as SortOption)} options={sortOptions} />
              </div>
            </div>
          )}
          
          {/* View Toggle controls moved here where Search used to be */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flex: '1', minWidth: '120px' }}>
            <label style={{ display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--uma-taupe)', marginBottom: '0.5rem', fontWeight: 600 }}>Vista</label>
            <div style={{ display: 'flex', gap: '0.3rem', background: 'var(--uma-crema)', padding: '0.25rem', borderRadius: '6px', border: '1px solid rgba(58,36,34,0.06)' }}>
              <button
                onClick={() => setViewMode('grid')}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', border: 'none', borderRadius: '4px', cursor: 'pointer',
                  background: viewMode === 'grid' ? 'var(--uma-blanco)' : 'transparent',
                  color: viewMode === 'grid' ? 'var(--uma-cacao)' : 'var(--uma-taupe)',
                  boxShadow: viewMode === 'grid' ? '0 2px 8px rgba(58,36,34,0.05)' : 'none',
                  transition: 'all 0.2s ease',
                }}
                title="Vista cuadrícula"
                aria-label="Vista cuadrícula"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', border: 'none', borderRadius: '4px', cursor: 'pointer',
                  background: viewMode === 'list' ? 'var(--uma-blanco)' : 'transparent',
                  color: viewMode === 'list' ? 'var(--uma-cacao)' : 'var(--uma-taupe)',
                  boxShadow: viewMode === 'list' ? '0 2px 8px rgba(58,36,34,0.05)' : 'none',
                  transition: 'all 0.2s ease',
                }}
                title="Vista lista"
                aria-label="Vista lista"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Utilities bar: results count, clear filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'center', marginBottom: '2rem', paddingInline: '0.5rem', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--uma-taupe)', fontWeight: 500 }}>
            {filtered.length === 0 ? 'No se encontraron productos' : `Mostrando ${filtered.length} producto${filtered.length !== 1 ? 's' : ''}`}
            {urlQuery && <span style={{ marginLeft: '0.5rem', color: 'var(--uma-cacao)' }}>para &quot;{urlQuery}&quot;</span>}
          </p>
          {hasActiveFilters && (
            <button onClick={clearFilters} style={{ background: 'transparent', border: 'none', color: 'var(--uma-arcilla)', fontSize: '0.75rem', textDecoration: 'underline', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 1rem', background: 'var(--uma-blanco)', borderRadius: '8px', border: '1px solid rgba(58,36,34,0.06)' }}>
          <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--uma-cacao)', marginBottom: '0.5rem' }}>No encontramos productos</p>
          <p style={{ fontSize: '0.95rem', color: 'var(--uma-taupe)', marginBottom: '2rem' }}>
            Prueba ajustando los filtros de búsqueda o eliminando el término buscado.
          </p>
          <button className="btn-primary" onClick={clearFilters}>
            Ver todos los productos
          </button>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? "product-grid" : ""} style={viewMode === 'list' ? { display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' } : { marginBottom: '3rem' }}>
          {filtered.slice(0, visibleCount).map(product => (
            <ProductCard key={product.id} product={product} viewMode={viewMode} />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {visibleCount < filtered.length && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1rem', marginBottom: '4rem' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--uma-taupe)', marginBottom: '1rem' }}>
            Mostrando {visibleCount} de {filtered.length} productos
          </p>
          <button
            onClick={() => setVisibleCount(prev => prev + 12)}
            style={{
              padding: '0.8rem 2.5rem',
              background: 'transparent',
              border: '1px solid var(--uma-cacao)',
              color: 'var(--uma-cacao)',
              borderRadius: '4px',
              fontFamily: 'var(--font-heading)',
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = 'var(--uma-crema)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            Ver más productos
          </button>
        </div>
      )}
    </div>
  );
}
