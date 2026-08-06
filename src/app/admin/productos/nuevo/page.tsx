import { createProduct, getProductBySlug } from '@/lib/db';
import { categories } from '@/lib/data';
import { put } from '@vercel/blob';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function NewProductPage() {
  const hasDb = !!process.env.POSTGRES_URL;
  const hasBlob = !!process.env.BLOB_READ_WRITE_TOKEN;

  async function saveProduct(formData: FormData) {
    'use server';
    
    if (!process.env.POSTGRES_URL) {
      throw new Error("No se puede crear el producto porque la base de datos no está configurada.");
    }

    const name = formData.get('name') as string;
    if (!name || name.trim() === '') throw new Error("Escribe el nombre del producto.");
    
    const priceRaw = formData.get('price') as string;
    const price = parseFloat(priceRaw);
    if (isNaN(price) || price < 0) throw new Error("Agrega un precio válido.");

    const category_id = formData.get('category_id') as string;
    if (!category_id) throw new Error("Selecciona una categoría.");

    let image_url = '';

    // Handle image
    const imageFile = formData.get('image') as File;
    if (imageFile && imageFile.size > 0 && process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(imageFile.name, imageFile, { access: 'public' });
      image_url = blob.url;
    } else {
      const fallbackUrl = formData.get('image_fallback_url') as string;
      if (fallbackUrl) {
        image_url = fallbackUrl;
      }
    }

    if (!image_url) throw new Error("Agrega una imagen o usa una URL existente.");

    // Generate Slug
    const baseSlug = name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
    
    let finalSlug = baseSlug;
    let counter = 2;
    while (await getProductBySlug(finalSlug)) {
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Process Benefits & Tags (Unique and nicely cased)
    const parseList = (str: string) => {
      if (!str) return [];
      const parts = str.split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0)
        .map(s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase());
      return Array.from(new Set(parts));
    };

    const benefits = parseList(formData.get('benefits') as string);
    const tags = parseList(formData.get('tags') as string).map(s => s.toLowerCase());

    const data = {
      name,
      slug: finalSlug,
      price,
      short_desc: formData.get('short_desc') as string || '',
      description: formData.get('description') as string || '',
      category_id,
      benefits,
      tags,
      is_available: formData.get('is_available') === 'on',
      is_featured: formData.get('is_featured') === 'on',
      image_url,
      image_position: '50% 50%', // Default
      sort_order: 999,
    };

    const newId = await createProduct(data);
    if (!newId) {
      throw new Error("Ocurrió un error inesperado al guardar en base de datos.");
    }

    revalidatePath('/catalogo');
    revalidatePath('/admin/productos');
    redirect('/admin/productos');
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .uma-input {
          width: 100%;
          padding: 0.85rem 1rem;
          border: 1px solid var(--uma-arena);
          border-radius: 4px;
          font-family: var(--font-body);
          font-size: 0.95rem;
          color: var(--uma-cacao);
          background-color: var(--uma-marfil);
          transition: all 0.2s ease;
        }
        .uma-input:focus {
          outline: none;
          border-color: var(--uma-taupe);
          background-color: white;
          box-shadow: 0 0 0 3px rgba(220, 200, 173, 0.2);
        }
        .uma-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--uma-taupe);
          margin-bottom: 0.4rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .uma-helper {
          font-size: 0.8rem;
          color: var(--uma-taupe);
          margin-bottom: 0.8rem;
          opacity: 0.8;
        }
        .uma-section {
          background: white;
          padding: 2rem;
          border-radius: 6px;
          border: 1px solid rgba(220, 200, 173, 0.4);
          margin-bottom: 2rem;
        }
        .uma-section-title {
          font-family: var(--font-heading);
          font-size: 1.3rem;
          color: var(--uma-cacao);
          margin-bottom: 1.5rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid rgba(220, 200, 173, 0.3);
        }
        .uma-checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          font-size: 0.95rem;
          color: var(--uma-cacao);
        }
      `}} />

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <Link href="/admin/productos" style={{ color: 'var(--uma-taupe)', textDecoration: 'none', fontSize: '0.9rem', display: 'inline-block', marginBottom: '1rem', transition: 'color 0.2s' }}>
            ← Volver a productos
          </Link>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', color: 'var(--uma-cacao)', margin: '0 0 0.5rem 0' }}>
            Añadir Producto Nuevo
          </h1>
          <p style={{ color: 'var(--uma-taupe)', margin: 0, fontSize: '1.05rem' }}>
            Crea un producto para publicarlo en el catálogo.
          </p>
        </div>

        {/* Local Banner */}
        {!hasDb && (
          <div style={{ marginBottom: '2.5rem', padding: '1.2rem 1.5rem', background: 'rgba(138, 141, 111, 0.1)', color: 'var(--uma-cacao)', borderRadius: '6px', border: '1px solid rgba(138, 141, 111, 0.3)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '1.2rem' }}>ℹ️</span>
            <span style={{ fontSize: '0.95rem', lineHeight: 1.5 }}>
              <strong>Estás en modo local.</strong> Para guardar productos nuevos necesitas configurar Vercel Postgres en tu entorno.
            </span>
          </div>
        )}

        <form action={saveProduct}>
          
          <div className="uma-section">
            <h2 className="uma-section-title">Información básica</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label className="uma-label">Nombre del Producto</label>
                <input type="text" name="name" className="uma-input" placeholder="Ej: Infusión Relax" required />
              </div>

              <div>
                <label className="uma-label">Descripción Corta</label>
                <p className="uma-helper">Un resumen atractivo de una o dos líneas para las tarjetas del catálogo.</p>
                <textarea name="short_desc" className="uma-input" style={{ minHeight: '80px', resize: 'vertical' }} required />
              </div>

              <div>
                <label className="uma-label">Descripción Completa (Opcional)</label>
                <p className="uma-helper">Detalles profundos, ingredientes y modo de uso para la página del producto.</p>
                <textarea name="description" className="uma-input" style={{ minHeight: '120px', resize: 'vertical' }} />
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
            
            {/* Left Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div className="uma-section" style={{ marginBottom: 0 }}>
                <h2 className="uma-section-title">Precio y Categoría</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                    <label className="uma-label">Precio (COP)</label>
                    <input type="number" name="price" className="uma-input" min="0" placeholder="Ej: 45000" required />
                  </div>
                  <div>
                    <label className="uma-label">Categoría</label>
                    <select name="category_id" className="uma-input" required>
                      <option value="">Selecciona la familia del producto</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="uma-section" style={{ marginBottom: 0 }}>
                <h2 className="uma-section-title">Organización y Estado</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                    <label className="uma-label">Beneficios</label>
                    <p className="uma-helper">Separados por comas. Ej: Hidratante, Relajante, Antioxidante.</p>
                    <input type="text" name="benefits" className="uma-input" />
                  </div>
                  
                  <div>
                    <label className="uma-label">Etiquetas adicionales</label>
                    <p className="uma-helper">Opcional. Ej: eco-friendly, vegano.</p>
                    <input type="text" name="tags" className="uma-input" />
                  </div>

                  <div style={{ borderTop: '1px solid rgba(220, 200, 173, 0.3)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <label className="uma-checkbox-label">
                      <input type="checkbox" name="is_available" defaultChecked style={{ width: '18px', height: '18px', accentColor: 'var(--uma-cacao)' }} />
                      Producto activo (Visible para compra)
                    </label>

                    <label className="uma-checkbox-label">
                      <input type="checkbox" name="is_featured" style={{ width: '18px', height: '18px', accentColor: 'var(--uma-cacao)' }} />
                      Destacar en portada
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (Image) */}
            <div>
              <div className="uma-section" style={{ height: '100%', marginBottom: 0 }}>
                <h2 className="uma-section-title">Imagen Principal</h2>
                <div style={{ 
                  background: 'var(--uma-crema)', 
                  padding: '2rem', 
                  borderRadius: '6px', 
                  border: '1px dashed var(--uma-taupe)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: '1rem'
                }}>
                  <div style={{ width: '60px', height: '60px', opacity: 0.5, marginBottom: '0.5rem' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                  </div>
                  
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--uma-cacao)' }}>
                    Sube una imagen limpia, en buena resolución.
                  </p>
                  
                  <input type="file" name="image" accept="image/jpeg, image/png, image/webp" style={{ 
                    marginTop: '1rem', 
                    fontSize: '0.85rem',
                    color: 'var(--uma-taupe)',
                    width: '100%',
                    maxWidth: '250px'
                  }} />

                  {!hasBlob && (
                    <div style={{ marginTop: '1.5rem', width: '100%', textAlign: 'left' }}>
                      <div style={{ padding: '0.8rem', background: 'rgba(255, 255, 255, 0.5)', borderRadius: '4px', border: '1px solid rgba(220, 200, 173, 0.5)', fontSize: '0.8rem', color: 'var(--uma-taupe)' }}>
                        Vercel Blob inactivo. Usa una URL externa o de la carpeta public (ej. /productos/foto.jpg)
                      </div>
                      <input type="text" name="image_fallback_url" placeholder="/productos/ejemplo.jpg" className="uma-input" style={{ marginTop: '0.8rem' }} />
                    </div>
                  )}

                  <p style={{ fontSize: '0.75rem', color: 'var(--uma-taupe)', marginTop: '1.5rem', fontStyle: 'italic', opacity: 0.8 }}>
                    El encuadre se ajustará automáticamente. Podrás modificar el enfoque (Focal Point) editando el producto más adelante.
                  </p>
                </div>
              </div>
            </div>

          </div>

          <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button 
              type="submit" 
              disabled={!hasDb} 
              style={{ 
                border: 'none', 
                padding: '1rem 2.5rem', 
                background: hasDb ? 'var(--uma-cacao)' : 'rgba(220, 200, 173, 0.5)', 
                color: hasDb ? 'var(--uma-marfil)' : 'var(--uma-taupe)', 
                borderRadius: '4px', 
                cursor: hasDb ? 'pointer' : 'not-allowed', 
                fontWeight: 500,
                fontSize: '1rem',
                letterSpacing: '0.02em',
                transition: 'background 0.2s'
              }}
            >
              Crear producto
            </button>
            
            <Link 
              href="/admin/productos" 
              style={{ 
                textDecoration: 'none', 
                padding: '1rem 2rem', 
                color: 'var(--uma-cacao)', 
                fontWeight: 500,
                fontSize: '0.95rem'
              }}
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
