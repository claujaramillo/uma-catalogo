import { getSetting, updateSetting } from '@/lib/db';
import { put } from '@vercel/blob';
import { revalidatePath } from 'next/cache';
import Image from 'next/image';
import FocalPointEditor from '@/components/admin/FocalPointEditor';

export default async function ConfigPage() {
  const whatsapp = await getSetting('whatsapp_number', '573101234567');
  const homeHeroImage = await getSetting('home_hero_image', '/hero_uma2.jpg');
  const catalogHeroImage = await getSetting('catalog_hero_image', '/hero_uma2.jpg');
  const homeHeroFocal = await getSetting('home_hero_focal', '50% 50%');
  const catalogHeroFocal = await getSetting('catalog_hero_focal', '50% 50%');
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

    // Guardar Encuadres (siempre presentes gracias a los hidden inputs)
    const homeFocal = formData.get('home_hero_focal') as string;
    if (homeFocal) await updateSetting('home_hero_focal', homeFocal);

    const catalogFocal = formData.get('catalog_hero_focal') as string;
    if (catalogFocal) await updateSetting('catalog_hero_focal', catalogFocal);

    revalidatePath('/', 'layout');
  }

  const helperStyle = { fontSize: '0.8rem', color: 'var(--uma-taupe)', marginBottom: '0.3rem' };

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', color: 'var(--uma-cacao)', marginBottom: '2rem' }}>
        Configuración
      </h1>

      <div style={{ background: 'white', padding: '2.5rem', borderRadius: '4px', border: '1px solid var(--uma-arena)', maxWidth: '800px' }}>
        <h2 style={{ fontSize: '1.2rem', color: 'var(--uma-cacao)', marginBottom: '1.5rem', fontWeight: 600 }}>Número de Contacto (WhatsApp)</h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--uma-taupe)', marginBottom: '2rem', lineHeight: 1.6 }}>
          Este es el número al que llegarán todos los pedidos cuando los clientes hagan clic en &quot;Pedir por WhatsApp&quot;.
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
              style={{ width: '100%', maxWidth: '600px', padding: '0.8rem', border: '1px solid var(--uma-arena)', borderRadius: '4px', fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--uma-cacao)' }}
              required 
            />
          </div>

          {!hasDb && (
            <p style={{ fontSize: '0.75rem', color: '#856404', background: '#FFF3CD', padding: '0.8rem', borderRadius: '4px', maxWidth: '600px' }}>
              Vercel Postgres no está configurado. Los cambios que hagas aquí no se guardarán permanentemente.
            </p>
          )}

          {/* Imágenes de Portada */}
          <h2 style={{ fontSize: '1.2rem', color: 'var(--uma-cacao)', marginBottom: '1rem', marginTop: '3rem', fontWeight: 600, borderTop: '1px solid var(--uma-arena)', paddingTop: '2rem' }}>Imágenes de Portada (Hero)</h2>
          
          <div style={{ background: 'var(--uma-marfil)', padding: '1.5rem', borderRadius: '6px', border: '1px solid var(--uma-arena)', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--uma-cacao)', marginBottom: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Guía para Portadas</h3>
            <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
              <li style={helperStyle}><strong>Formatos:</strong> JPG, PNG o WEBP</li>
              <li style={helperStyle}><strong>Proporción:</strong> Horizontal ancha (16:9 o 21:9)</li>
              <li style={helperStyle}><strong>Resolución:</strong> Recomendada 1920×900 px (Ideal para retina: 2400×1200 px)</li>
              <li style={helperStyle}><strong>Peso:</strong> Menos de 1.5 MB para carga rápida</li>
              <li style={helperStyle}><strong>Composición:</strong> Evitar texto dentro de la imagen. Dejar &quot;aire visual&quot; para que el título de la web se lea bien. Usa el botón &quot;Ajustar encuadre&quot; para centrar el foco importante.</li>
            </ul>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', marginBottom: '2rem' }}>
            
            {/* Home Hero */}
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start', background: 'var(--uma-crema)', padding: '1.5rem', borderRadius: '6px' }}>
              <div style={{ flex: '1', minWidth: '250px' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--uma-cacao)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Portada Inicio (Home)
                </label>
                <input type="file" name="home_hero" accept="image/jpeg, image/png, image/webp" style={{ fontSize: '0.85rem', width: '100%', marginBottom: '1rem' }} />
                <FocalPointEditor imageUrl={homeHeroImage} initialPosition={homeHeroFocal} inputName="home_hero_focal" aspectRatio="horizontal" />
              </div>
              <div style={{ width: '250px', height: '110px', position: 'relative', background: 'var(--uma-marfil)', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--uma-arena)', flexShrink: 0 }}>
                <Image src={homeHeroImage} alt="Home Hero Preview" fill style={{ objectFit: 'cover', objectPosition: homeHeroFocal }} />
              </div>
            </div>

            {/* Catalog Hero */}
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start', background: 'var(--uma-crema)', padding: '1.5rem', borderRadius: '6px' }}>
              <div style={{ flex: '1', minWidth: '250px' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--uma-cacao)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Portada Catálogo
                </label>
                <input type="file" name="catalog_hero" accept="image/jpeg, image/png, image/webp" style={{ fontSize: '0.85rem', width: '100%', marginBottom: '1rem' }} />
                <FocalPointEditor imageUrl={catalogHeroImage} initialPosition={catalogHeroFocal} inputName="catalog_hero_focal" aspectRatio="horizontal" />
              </div>
              <div style={{ width: '250px', height: '110px', position: 'relative', background: 'var(--uma-marfil)', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--uma-arena)', flexShrink: 0 }}>
                <Image src={catalogHeroImage} alt="Catalog Hero Preview" fill style={{ objectFit: 'cover', objectPosition: catalogHeroFocal }} />
              </div>
            </div>

            {!hasBlob && (
              <p style={{ fontSize: '0.75rem', color: '#856404', background: '#FFF3CD', padding: '0.8rem', borderRadius: '4px' }}>
                Vercel Blob no está configurado. No podrás subir imágenes nuevas hasta configurarlo.
              </p>
            )}
          </div>

          <div style={{ borderTop: '1px solid var(--uma-arena)', paddingTop: '1.5rem' }}>
            <button type="submit" style={{ border: 'none', padding: '1rem 2.5rem', background: 'var(--uma-cacao)', color: 'white', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
