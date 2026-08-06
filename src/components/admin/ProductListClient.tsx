'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/data';
import { Product } from '@/types';

type SortOption = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'active-first' | 'featured-first';

export default function ProductListClient({ initialProducts }: { initialProducts: Product[] }) {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('name-asc');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // Filter & Sort Logic
  const filteredAndSorted = useMemo(() => {
    let result = [...initialProducts];

    // Search
    if (search.trim() !== '') {
      const query = search.toLowerCase();
      result = result.filter(p => {
        const nameMatch = p.name.toLowerCase().includes(query);
        const catMatch = p.category_id.toLowerCase().includes(query);
        const priceMatch = p.price.toString().includes(query);
        const statusMatch = p.is_available ? 'activo'.includes(query) : 'agotado'.includes(query) || 'inactivo'.includes(query);
        return nameMatch || catMatch || priceMatch || statusMatch;
      });
    }

    // Sort
    result.sort((a, b) => {
      switch (sort) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'active-first':
          if (a.is_available === b.is_available) return 0;
          return a.is_available ? -1 : 1;
        case 'featured-first':
          if (a.is_featured === b.is_featured) return 0;
          return a.is_featured ? -1 : 1;
        default:
          return 0;
      }
    });

    return result;
  }, [initialProducts, search, sort]);

  // Pagination Logic
  const totalItems = filteredAndSorted.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  
  // Enforce page bounds if search shrinks results
  if (page > totalPages) setPage(1);

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentItems = filteredAndSorted.slice(startIndex, endIndex);

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .uma-admin-select, .uma-admin-input {
          padding: 0.6rem 1rem;
          border: 1px solid rgba(220, 200, 173, 0.5);
          border-radius: 4px;
          font-family: var(--font-body);
          font-size: 0.9rem;
          color: var(--uma-cacao);
          background-color: white;
          transition: all 0.2s;
        }
        .uma-admin-select:focus, .uma-admin-input:focus {
          outline: none;
          border-color: var(--uma-taupe);
          box-shadow: 0 0 0 2px rgba(220, 200, 173, 0.2);
        }
        .uma-pagination-btn {
          padding: 0.5rem 1rem;
          border: 1px solid var(--uma-arena);
          background: white;
          color: var(--uma-cacao);
          border-radius: 4px;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .uma-pagination-btn:hover:not(:disabled) {
          background: var(--uma-marfil);
          border-color: var(--uma-taupe);
        }
        .uma-pagination-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          background: #fcfcfc;
        }
      `}} />

      {/* Toolbar: Search and Sort */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', background: 'var(--uma-marfil)', padding: '1rem', borderRadius: '4px', border: '1px solid rgba(220, 200, 173, 0.3)' }}>
        
        <div style={{ flex: '1 1 300px', display: 'flex', alignItems: 'center', position: 'relative' }}>
          <svg style={{ position: 'absolute', left: '1rem', color: 'var(--uma-taupe)' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input 
            type="text" 
            placeholder="Buscar por nombre, categoría, precio..." 
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="uma-admin-input"
            style={{ width: '100%', paddingLeft: '2.5rem' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--uma-taupe)', fontWeight: 500 }}>Ordenar por:</span>
          <select 
            value={sort} 
            onChange={(e) => { setSort(e.target.value as SortOption); setPage(1); }}
            className="uma-admin-select"
          >
            <option value="name-asc">Nombre (A-Z)</option>
            <option value="name-desc">Nombre (Z-A)</option>
            <option value="price-asc">Precio (Menor a Mayor)</option>
            <option value="price-desc">Precio (Mayor a Menor)</option>
            <option value="active-first">Activos primero</option>
            <option value="featured-first">Destacados primero</option>
          </select>
        </div>
      </div>

      {/* Table Area */}
      <div style={{ background: 'white', borderRadius: '6px', border: '1px solid rgba(220, 200, 173, 0.4)', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
            <thead>
              <tr style={{ background: 'rgba(252, 251, 248, 0.8)', borderBottom: '1px solid rgba(220, 200, 173, 0.4)', textAlign: 'left' }}>
                <th style={{ padding: '1rem 1.5rem', color: 'var(--uma-taupe)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Producto</th>
                <th style={{ padding: '1rem 1.5rem', color: 'var(--uma-taupe)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Precio</th>
                <th style={{ padding: '1rem 1.5rem', color: 'var(--uma-taupe)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Estado</th>
                <th style={{ padding: '1rem 1.5rem', color: 'var(--uma-taupe)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map(product => (
                  <tr key={product.id} style={{ borderBottom: '1px solid rgba(220,200,173,0.2)', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(252, 251, 248, 0.5)'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '45px', height: '45px', position: 'relative', borderRadius: '6px', overflow: 'hidden', background: 'var(--uma-crema)', border: '1px solid rgba(220, 200, 173, 0.3)' }}>
                          <Image src={product.image_url} alt={product.name} fill style={{ objectFit: 'cover' }} sizes="45px" />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--uma-cacao)', fontSize: '0.95rem', marginBottom: '0.1rem' }}>{product.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--uma-taupe)' }}>{product.category_id}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--uma-cacao)', fontWeight: 500 }}>
                      {formatPrice(product.price)}
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span style={{ 
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        padding: '0.3rem 0.7rem', 
                        borderRadius: '20px', 
                        fontSize: '0.75rem', 
                        fontWeight: 600,
                        background: product.is_available ? 'rgba(138, 141, 111, 0.15)' : 'rgba(220, 200, 173, 0.2)',
                        color: product.is_available ? 'var(--uma-cacao)' : 'var(--uma-taupe)'
                      }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: product.is_available ? 'var(--uma-salvia)' : 'var(--uma-taupe)' }}></span>
                        {product.is_available ? 'Activo' : 'Agotado'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                      <Link href={`/admin/productos/editar/${product.id}`} style={{ 
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        color: 'var(--uma-cacao)', 
                        textDecoration: 'none', 
                        fontSize: '0.85rem', 
                        fontWeight: 600,
                        padding: '0.4rem 0.8rem',
                        border: '1px solid rgba(220, 200, 173, 0.4)',
                        borderRadius: '4px',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={e => { e.currentTarget.style.backgroundColor = 'var(--uma-marfil)'; e.currentTarget.style.borderColor = 'var(--uma-taupe)' }}
                      onMouseOut={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'rgba(220, 200, 173, 0.4)' }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--uma-taupe)' }}>
                    <svg style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <p style={{ margin: 0, fontSize: '0.95rem' }}>No encontramos productos con esa búsqueda.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', borderTop: '1px solid rgba(220, 200, 173, 0.3)', background: 'rgba(252, 251, 248, 0.3)' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--uma-taupe)' }}>
              Mostrando {startIndex + 1}–{endIndex} de {totalItems} productos
            </span>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))} 
                disabled={page === 1}
                className="uma-pagination-btn"
              >
                Anterior
              </button>
              <span style={{ fontSize: '0.85rem', color: 'var(--uma-cacao)', fontWeight: 500, margin: '0 0.5rem' }}>
                Página {page} de {totalPages}
              </span>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
                disabled={page === totalPages}
                className="uma-pagination-btn"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
