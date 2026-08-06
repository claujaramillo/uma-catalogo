'use server';

import { getUserByUsername, createUser, updatePassword } from '@/lib/db';
import { createSession, deleteSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';

export async function loginAction(prevState: { ok: boolean, error?: string }, formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (!username || !password) {
    return { ok: false, error: 'Todos los campos son obligatorios' };
  }

  const user = await getUserByUsername(username);
  
  if (!user) {
    // Fallback de seguridad: solo activo en desarrollo local
    if (process.env.NODE_ENV === 'development') {
      const adminPassword = process.env.ADMIN_PASSWORD || 'uma2026';
      if (username === 'admin' && password === adminPassword) {
        await createSession(username);
        redirect('/admin');
      }
    }
    return { ok: false, error: 'Usuario o contraseña incorrectos.' };
  }

  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) {
    return { ok: false, error: 'Usuario o contraseña incorrectos.' };
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
