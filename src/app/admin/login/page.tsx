import { loginAction } from '@/app/admin/actions';
import LoginForm from './LoginForm';

export default function LoginPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--uma-marfil)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: 'white', padding: '3rem', borderRadius: '4px', border: '1px solid var(--uma-arena)', width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--uma-cacao)' }}>UMA Admin</h1>
          <p style={{ color: 'var(--uma-taupe)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Ingresa tus credenciales para acceder</p>
        </div>

        <LoginForm action={loginAction} />
      </div>
    </div>
  );
}
