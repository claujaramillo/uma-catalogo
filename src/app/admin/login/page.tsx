import { loginAction } from '@/app/admin/actions';

export default function LoginPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--uma-marfil)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: 'white', padding: '3rem', borderRadius: '4px', border: '1px solid var(--uma-arena)', width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--uma-cacao)' }}>UMA Admin</h1>
          <p style={{ color: 'var(--uma-taupe)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Ingresa tus credenciales para acceder</p>
        </div>

        <form action={loginAction} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--uma-taupe)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Contraseña
            </label>
            <input 
              type="password" 
              name="password" 
              style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--uma-arena)', borderRadius: '4px', fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--uma-cacao)' }}
              required 
            />
          </div>

          <button type="submit" style={{ border: 'none', padding: '1rem', background: 'var(--uma-cacao)', color: 'white', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, marginTop: '1rem' }}>
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
}
