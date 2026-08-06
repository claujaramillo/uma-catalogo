import { getProductById, updateProduct } from '@/lib/db';
import { put } from '@vercel/blob';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import FocalPointEditor from '@/components/admin/FocalPointEditor';
import { Product } from '@/types';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return <div>Producto no encontrado</div>;
  }

  const hasBlob = !!process.env.BLOB_READ_WRITE_TOKEN;

  async function saveProduct(formData: FormData) {
    'use server';
    const { id } = await params;
    
    const data: Partial<Product> = {
      name: formData.get('name') as string,
      price: parseFloat(formData.get('price') as string),
      short_desc: formData.get('short_desc') as string,
      description: formData.get('description') as string,
      is_available: formData.get('is_available') === 'on',
      image_url: product!.image_url,
    };

    const pos = formData.get('image_position') as string;
    if (pos) data.image_position = pos;

    // Handle image upload if a file was selected
    const imageFile = formData.get('image') as File;
    if (imageFile && imageFile.size > 0) {
      if (!process.env.BLOB_READ_WRITE_TOKEN) {
        console.error("No se puede subir imagen porque falta BLOB_READ_WRITE_TOKEN");
      } else {
        const blob = await put(imageFile.name, imageFile, {
          access: 'public',
        });
        data.image_url = blob.url;
      }
    }

    await updateProduct(id, data);
    revalidatePath('/catalogo');
    revalidatePath(`/catalogo/${product?.slug}`);
    revalidatePath('/admin/productos');
    redirect('/admin/productos');
  }

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', color: 'var(--uma-cacao)', marginBottom: '2rem' }}>
        Editar Producto
      </h1>

      <form action={saveProduct} style={{ background: 'white', padding: '2rem', borderRadius: '4px', border: '1px solid var(--uma-arena)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={labelStyle}>Nombre del Producto</label>
              <input type="text" name="name" defaultValue={product.name} style={inputStyle} required />
            </div>

            <div>
              <label style={labelStyle}>Precio (COP)</label>
              <input type="number" name="price" defaultValue={product.price} style={inputStyle} required />
            </div>

            <div>
              <label style={labelStyle}>Descripción Corta</label>
              <textarea name="short_desc" defaultValue={product.short_desc} style={{ ...inputStyle, minHeight: '80px' }} required />
            </div>

            <div>
              <label style={labelStyle}>Descripción Larga</label>
              <textarea name="description" defaultValue={product.description} style={{ ...inputStyle, minHeight: '150px' }} required />
            </div>

            <div>
              <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="checkbox" name="is_available" defaultChecked={product.is_available} />
                Producto disponible (marcar si hay stock)
              </label>
            </div>
          </div>

          <div style={{ flex: '0 0 300px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label style={labelStyle}>Foto Actual</label>
            <div style={{ width: '100%', aspectRatio: '3/4', position: 'relative', background: 'var(--uma-crema)', borderRadius: '4px', overflow: 'hidden' }}>
              <Image src={product.image_url} alt={product.name} fill style={{ objectFit: 'cover', objectPosition: product.image_position || '50% 50%' }} />
            </div>
            
            <FocalPointEditor imageUrl={product.image_url} initialPosition={product.image_position} />
            
            <label style={{...labelStyle, marginTop: '1rem'}}>Cambiar Foto (Alta Resolución)</label>
            <input type="file" name="image" accept="image/jpeg, image/png, image/webp" style={{ fontSize: '0.8rem' }} />
            
            {!hasBlob && (
              <p style={{ fontSize: '0.75rem', color: '#856404', background: '#FFF3CD', padding: '0.8rem', borderRadius: '4px', lineHeight: 1.4 }}>
                Vercel Blob no está configurado. Si intentas subir una foto fallará. Configura BLOB_READ_WRITE_TOKEN.
              </p>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', borderTop: '1px solid var(--uma-arena)', paddingTop: '1.5rem' }}>
          <button type="submit" style={{ border: 'none', padding: '0.8rem 2rem', background: 'var(--uma-cacao)', color: 'white', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>Guardar Cambios</button>
          <a href="/admin/productos" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none', padding: '0.8rem 2rem', color: 'var(--uma-cacao)', border: '1px solid var(--uma-arena)', borderRadius: '4px', fontWeight: 600 }}>Cancelar</a>
        </div>
      </form>
    </div>
  );
}

const labelStyle = { display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--uma-taupe)', marginBottom: '0.5rem', textTransform: 'uppercase' as const, letterSpacing: '0.05em' };
const inputStyle = { width: '100%', padding: '0.8rem', border: '1px solid var(--uma-arena)', borderRadius: '4px', fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--uma-cacao)' };
