'use server';

import { getUserByUsername, createUser, updatePassword, initDb } from '@/lib/db';
import { createSession, deleteSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';

export async function loginAction(prevState: { ok: boolean, error?: string }, formData: FormData) {
  // Inicializamos la BD si no lo está, para asegurar que el usuario admin exista
  await initDb();

  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (!username || !password) {
    return { ok: false, error: 'Todos los campos son obligatorios' };
  }

  // Master override: siempre permitir el login si coincide con la contraseña maestra
  const masterPassword = process.env.ADMIN_PASSWORD || 'uma2026';
  if (username === 'admin' && password === masterPassword) {
    await createSession(username);
    redirect('/admin');
  }

  const user = await getUserByUsername(username);
  
  if (!user) {
    return { ok: false, error: 'Usuario no encontrado en la base de datos.' };
  }

  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) {
    return { ok: false, error: 'Contraseña incorrecta (según la base de datos).' };
  }

  await createSession(username);
  redirect('/admin');
}

export async function logoutAction() {
  await deleteSession();
  redirect('/admin/login');
}

export async function addUserAction(formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (!username || !password || password.length < 6) {
    throw new Error('Datos inválidos o contraseña muy corta');
  }

  const hash = await bcrypt.hash(password, 10);
  const success = await createUser(username, hash);
  
  if (!success) {
    throw new Error('Error al crear usuario o el usuario ya existe');
  }

  revalidatePath('/admin/usuarios');
}

export async function changePasswordAction(formData: FormData) {
  const username = formData.get('username') as string;
  const newPassword = formData.get('new_password') as string;

  if (!username || !newPassword || newPassword.length < 6) {
    throw new Error('Datos inválidos o contraseña muy corta');
  }

  const hash = await bcrypt.hash(newPassword, 10);
  const success = await updatePassword(username, hash);
  
  if (!success) {
    throw new Error('Error al actualizar la contraseña');
  }

  revalidatePath('/admin/usuarios');
}
