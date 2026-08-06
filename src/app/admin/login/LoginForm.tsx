'use client';
import { useState, useActionState } from 'react';

type ActionState = { ok: boolean; error?: string };

export default function LoginForm({ action }: { action: (prevState: ActionState, formData: FormData) => Promise<ActionState> }) {
  const [showHelp, setShowHelp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, isPending] = useActionState(action, { ok: true, error: '' });

  return (
    <div>
      <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {!state.ok && state.error && (
          <div style={{ background: '#FEE2E2', borderLeft: '4px solid #EF4444', padding: '1rem', borderRadius: '4px', fontSize: '0.85rem', color: '#B91C1C', lineHeight: 1.5 }}>
            {state.error}
          </div>
        )}

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--uma-taupe)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Usuario
          </label>
          <input 
            type="text" 
            name="username" 
            style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--uma-arena)', borderRadius: '4px', fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--uma-cacao)' }}
            required 
          />
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--uma-taupe)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Contraseña
            </label>
            <button 
              type="button" 
              onClick={() => setShowHelp(!showHelp)}
              style={{ background: 'transparent', border: 'none', color: 'var(--uma-arcilla)', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline' }}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
          <div style={{ position: 'relative' }}>
            <input 
              type={showPassword ? 'text' : 'password'}
              name="password" 
              style={{ width: '100%', padding: '0.8rem', paddingRight: '2.5rem', border: '1px solid var(--uma-arena)', borderRadius: '4px', fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--uma-cacao)' }}
              required 
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              style={{
                position: 'absolute',
                right: '0.8rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--uma-taupe)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.2rem',
              }}
            >
              {showPassword ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              )}
            </button>
          </div>
        </div>

        {showHelp && (
          <div style={{ background: '#FFF3CD', borderLeft: '4px solid #856404', padding: '1rem', borderRadius: '4px', fontSize: '0.85rem', color: '#856404', lineHeight: 1.5 }}>
            <p style={{ margin: 0, fontWeight: 600, marginBottom: '0.3rem' }}>Ayuda de acceso seguro</p>
            <p style={{ margin: 0 }}>Para mantener la seguridad del sistema, el restablecimiento de contraseñas no es automático. Contacta al administrador general del sitio para que genere una nueva contraseña temporal desde la base de datos.</p>
          </div>
        )}

        <button 
          type="submit" 
          disabled={isPending}
          style={{ border: 'none', padding: '1rem', background: 'var(--uma-cacao)', color: 'white', borderRadius: '4px', cursor: isPending ? 'not-allowed' : 'pointer', fontWeight: 600, marginTop: '0.5rem', opacity: isPending ? 0.7 : 1 }}
        >
          {isPending ? 'Iniciando...' : 'Iniciar Sesión'}
        </button>
      </form>
    </div>
  );
}
