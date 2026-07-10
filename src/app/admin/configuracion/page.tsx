import { getSetting, updateSetting } from '@/lib/db';
import { put } from '@vercel/blob';
import { revalidatePath } from 'next/cache';
import Image from 'next/image';

export default async function ConfigPage() {
  const whatsapp = await getSetting('whatsapp_number', '573101234567');
  const homeHeroImage = await getSetting('home_hero_image', '/hero_uma2.jpg');
  const catalogHeroImage = await getSetting('catalog_hero_image', '/hero_uma2.jpg');
  const hasDb = !!process.env.POSTGRES_URL;
  const hasBlob = !!process.env.BLOB_READ_WRITE_TOKEN;

  async function saveConfig(formData: FormData) {
    'use server';
    
    // Guardar WhatsApp
    const number = formData.get('whatsapp') as string;
    await updateSetting('whatsapp_number', number);

    // Guardar Imágenes si se subieron
    const homeFile = formData.get('home_hero') as File;
    if (homeFile && homeFile.size > 0 && process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(homeFile.name, homeFile, { access: 'public' });
      await updateSetting('home_hero_image', blob.url);
    }

    const catalogFile = formData.get('catalog_hero') as File;
    if (catalogFile && catalogFile.size > 0 && process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(catalogFile.name, catalogFile, { access: 'public' });
      await updateSetting('catalog_hero_image', blob.url);
    }

    revalidatePath('/', 'layout');
  }

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', color: 'var(--uma-cacao)', marginBottom: '2rem' }}>
        Configuración
      </h1>

      <div style={{ background: 'white', padding: '2.5rem', borderRadius: '4px', border: '1px solid var(--uma-arena)', maxWidth: '600px' }}>
        <h2 style={{ fontSize: '1.2rem', color: 'var(--uma-cacao)', marginBottom: '1.5rem', fontWeight: 600 }}>Número de Contacto (WhatsApp)</h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--uma-taupe)', marginBottom: '2rem', lineHeight: 1.6 }}>
          Este es el número al que llegarán todos los pedidos cuando los clientes hagan clic en "Pedir por WhatsApp". 
          Asegúrate de incluir el código de país sin el símbolo + (ejemplo: 573101234567 para Colombia).
        </p>

        <form action={saveConfig} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--uma-taupe)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Número de Teléfono
            </label>
            <input 
              type="text" 
              name="whatsapp" 
              defaultValue={whatsapp} 
              style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--uma-arena)', borderRadius: '4px', fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--uma-cacao)' }}
              required 
            />
          </div>

          {!hasDb && (
            <p style={{ fontSize: '0.75rem', color: '#856404', background: '#FFF3CD', padding: '0.8rem', borderRadius: '4px' }}>
              Vercel Postgres no está configurado. Los cambios que hagas aquí no se guardarán permanentemente.
            </p>
          )}

        {/* Imágenes de Portada */}
        <h2 style={{ fontSize: '1.2rem', color: 'var(--uma-cacao)', marginBottom: '1.5rem', marginTop: '3rem', fontWeight: 600, borderTop: '1px solid var(--uma-arena)', paddingTop: '2rem' }}>Imágenes de Portada (Hero)</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '2rem' }}>
          
          {/* Home Hero */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--uma-taupe)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Portada Inicio (Home)
            </label>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <div style={{ width: '120px', height: '80px', position: 'relative', background: 'var(--uma-crema)', borderRadius: '4px', overflow: 'hidden' }}>
                <Image src={homeHeroImage} alt="Home Hero" fill style={{ objectFit: 'cover' }} />
              </div>
              <input type="file" name="home_hero" accept="image/jpeg, image/png, image/webp" style={{ fontSize: '0.8rem' }} />
            </div>
          </div>

          {/* Catalog Hero */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--uma-taupe)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Portada Catálogo
            </label>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <div style={{ width: '120px', height: '80px', position: 'relative', background: 'var(--uma-crema)', borderRadius: '4px', overflow: 'hidden' }}>
                <Image src={catalogHeroImage} alt="Catalog Hero" fill style={{ objectFit: 'cover' }} />
              </div>
              <input type="file" name="catalog_hero" accept="image/jpeg, image/png, image/webp" style={{ fontSize: '0.8rem' }} />
            </div>
          </div>

          {!hasBlob && (
            <p style={{ fontSize: '0.75rem', color: '#856404', background: '#FFF3CD', padding: '0.8rem', borderRadius: '4px' }}>
              Vercel Blob no está configurado. No podrás subir imágenes nuevas hasta configurarlo.
            </p>
          )}
        </div>

        <button type="submit" style={{ border: 'none', padding: '1rem 2rem', background: 'var(--uma-cacao)', color: 'white', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>
          Guardar Cambios
        </button>
      </form>
      </div>
    </div>
  );
}
