import { getAllUsers } from '@/lib/db';
import { addUserAction, changePasswordAction } from '@/app/admin/actions';

export default async function UsersPage() {
  const users = await getAllUsers();
  const hasDb = !!process.env.POSTGRES_URL;

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', color: 'var(--uma-cacao)', marginBottom: '2rem' }}>
        Usuarios
      </h1>

      {!hasDb && (
        <div style={{ background: '#FFF3CD', border: '1px solid #FFEEBA', padding: '1.5rem', borderRadius: '4px', marginBottom: '2rem', color: '#856404' }}>
          <h3 style={{ marginBottom: '0.5rem', fontWeight: 600 }}>Base de datos no conectada</h3>
          <p style={{ fontSize: '0.9rem' }}>
            Las funciones de usuarios requieren una base de datos real. Por ahora, solo puedes acceder con &quot;admin&quot; y la contraseña por defecto.
          </p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        {/* Lista de usuarios */}
        <div style={{ background: 'white', padding: '2rem', borderRadius: '4px', border: '1px solid var(--uma-arena)' }}>
          <h2 style={{ fontSize: '1.2rem', color: 'var(--uma-cacao)', marginBottom: '1.5rem', fontWeight: 600 }}>Usuarios Registrados</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {users.length > 0 ? users.map(u => (
              <li key={u.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'var(--uma-marfil)', borderRadius: '4px' }}>
                <span style={{ fontWeight: 600, color: 'var(--uma-cacao)' }}>@{u.username}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--uma-taupe)' }}>ID: {u.id.slice(0,8)}...</span>
              </li>
            )) : (
              <li style={{ color: 'var(--uma-taupe)', fontSize: '0.9rem' }}>admin (Usuario local por defecto)</li>
            )}
          </ul>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Agregar usuario */}
          <div style={{ background: 'white', padding: '2rem', borderRadius: '4px', border: '1px solid var(--uma-arena)' }}>
            <h2 style={{ fontSize: '1.2rem', color: 'var(--uma-cacao)', marginBottom: '1.5rem', fontWeight: 600 }}>Agregar Nuevo Usuario</h2>
            <form action={addUserAction} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Nombre de usuario</label>
                <input type="text" name="username" style={inputStyle} required />
              </div>
              <div>
                <label style={labelStyle}>Contraseña</label>
                <input type="password" name="password" minLength={6} style={inputStyle} required />
              </div>
              <button type="submit" disabled={!hasDb} style={btnStyle}>Agregar Usuario</button>
            </form>
          </div>

          {/* Cambiar contraseña */}
          <div style={{ background: 'white', padding: '2rem', borderRadius: '4px', border: '1px solid var(--uma-arena)' }}>
            <h2 style={{ fontSize: '1.2rem', color: 'var(--uma-cacao)', marginBottom: '1.5rem', fontWeight: 600 }}>Cambiar Contraseña</h2>
            <form action={changePasswordAction} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Nombre de usuario</label>
                <select name="username" style={inputStyle} required>
                  {users.length > 0 ? users.map(u => (
                    <option key={u.id} value={u.username}>{u.username}</option>
                  )) : (
                    <option value="admin">admin</option>
                  )}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Nueva Contraseña</label>
                <input type="password" name="new_password" minLength={6} style={inputStyle} required />
              </div>
              <button type="submit" disabled={!hasDb} style={btnStyle}>Actualizar Contraseña</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

const labelStyle = { display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--uma-taupe)', marginBottom: '0.5rem', textTransform: 'uppercase' as const, letterSpacing: '0.05em' };
const inputStyle = { width: '100%', padding: '0.8rem', border: '1px solid var(--uma-arena)', borderRadius: '4px', fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--uma-cacao)' };
const btnStyle = { border: 'none', padding: '1rem', background: 'var(--uma-cacao)', color: 'white', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 };
