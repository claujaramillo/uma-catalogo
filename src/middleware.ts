import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback_secret_key_for_uma_catalog_dev_only'
);

export async function middleware(req: NextRequest) {
  // Ignorar peticiones a la ruta de login para no hacer un loop
  if (req.nextUrl.pathname === '/admin/login') {
    return NextResponse.next();
  }

  if (req.nextUrl.pathname.startsWith('/admin')) {
    const sessionCookie = req.cookies.get('uma_session')?.value;
    
    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }

    try {
      // Verificar el token JWT (compatible con Edge Runtime)
      await jwtVerify(sessionCookie, SECRET_KEY);
      return NextResponse.next();
    } catch (error) {
      // Si el token expira o es inválido, redirigir al login
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
