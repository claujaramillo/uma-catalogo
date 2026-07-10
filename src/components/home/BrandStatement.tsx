'use client';

export default function BrandStatement() {
  const values = [
    { title: 'Natural', desc: 'Ingredientes de la tierra, sin compromisos.' },
    { title: 'Limpio', desc: 'Sin tóxicos, sin parabenos, sin mentiras.' },
    { title: 'Consciente', desc: 'Empaques que cuidan el planeta tanto como tu piel.' },
    { title: 'Humano', desc: 'Hecho con amor, para gente que siente.' },
  ];

  return (
    <section
      className="section-padding"
      style={{ background: 'var(--uma-crema)' }}
    >
      <div className="container-uma">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '4rem',
          alignItems: 'center',
        }}>
          {/* Left — Quote */}
          <div>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '0.72rem', fontWeight: 700,
              letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--uma-arcilla)',
              marginBottom: '1.2rem',
            }}>
              Nuestra filosofía
            </p>
            <blockquote style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)',
              fontWeight: 500,
              color: 'var(--uma-cacao)',
              lineHeight: 1.4,
              margin: 0,
              paddingLeft: '1.5rem',
              borderLeft: '3px solid var(--uma-arcilla)',
            }}>
              "Cada producto que eliges es una decisión pequeña con un impacto enorme."
            </blockquote>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '0.875rem',
              color: 'var(--uma-taupe)', marginTop: '1.5rem', lineHeight: 1.8,
              maxWidth: '420px',
            }}>
              En UMA creemos que el bienestar comienza en lo que le das a tu cuerpo — y lo que dejas en el planeta.
              Cada producto del catálogo está elegido con criterio, amor y conciencia.
            </p>
          </div>

          {/* Right — Values grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1.5rem',
          }}>
            {values.map(v => (
              <div key={v.title} style={{
                background: 'white',
                borderRadius: '4px',
                padding: '1.5rem',
                border: '1px solid rgba(220,200,173,0.4)',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(58,40,29,0.08)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'none';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                }}
              >
                <h3 style={{
                  fontFamily: 'var(--font-heading)', fontSize: '1.1rem',
                  fontWeight: 600, color: 'var(--uma-cacao)', marginBottom: '0.4rem',
                }}>
                  {v.title}
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--uma-taupe)', lineHeight: 1.6 }}>
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
