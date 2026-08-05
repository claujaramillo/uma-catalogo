import { sql } from '@vercel/postgres';
import { products as staticProducts } from './data';
import { Product } from '@/types';

// Verificamos si la base de datos está conectada mediante variables de entorno
const hasDb = !!process.env.POSTGRES_URL;

// ==========================================
// SEED (Inicialización)
// ==========================================
export async function initDb() {
  if (!hasDb) return;

  try {
    // 1. Crear tabla de configuraciones
    await sql`
      CREATE TABLE IF NOT EXISTS settings (
        key VARCHAR(255) PRIMARY KEY,
        value TEXT NOT NULL
      );
    `;

    // 2. Crear tabla de usuarios
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL
      );
    `;

    // 3. Crear tabla de productos
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        slug VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        brand VARCHAR(255),
        category_id VARCHAR(255) NOT NULL,
        short_desc TEXT NOT NULL,
        description TEXT NOT NULL,
        ingredients TEXT,
        benefits TEXT[],
        tags TEXT[],
        price DECIMAL(10,2) NOT NULL,
        price_label VARCHAR(100),
        image_url TEXT NOT NULL,
        is_available BOOLEAN DEFAULT true,
        is_featured BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Insertar usuario admin por defecto si no existe ninguno
    const { rows: users } = await sql`SELECT COUNT(*) FROM users;`;
    if (users[0].count === '0') {
      // uma2026 hashed with bcrypt (cost 10)
      const defaultHash = '$2a$10$T8Z/0.r8I1T.2013YyZ0H.j65R0T2z/lU3tF9W20.n8W3rW/JkOZC'; 
      await sql`
        INSERT INTO users (username, password_hash)
        VALUES ('admin', ${defaultHash});
      `;
    }

    // Insertar configuración inicial si no existe
    await sql`
      INSERT INTO settings (key, value)
      VALUES ('whatsapp_number', '573101234567')
      ON CONFLICT (key) DO NOTHING;
    `;

    // Seed products
    const { rows } = await sql`SELECT COUNT(*) FROM products;`;
    if (rows[0].count === '0') {
      for (const p of staticProducts) {
        await sql`
          INSERT INTO products (
            slug, name, brand, category_id, short_desc, description, ingredients,
            benefits, tags, price, price_label, image_url, is_available, is_featured
          ) VALUES (
            ${p.slug}, ${p.name}, ${p.brand || null}, ${p.category_id}, ${p.short_desc}, ${p.description}, ${p.ingredients || null},
            ${`{${p.benefits.join(',')}}`}, ${`{${p.tags.join(',')}}`}, ${p.price}, ${p.price_label || null}, ${p.image_url}, ${p.is_available}, ${p.is_featured || false}
          );
        `;
      }
    }
    
    console.log('Base de datos inicializada correctamente (tablas, admin y productos).');
  } catch (error) {
    console.error('Error inicializando base de datos:', error);
  }
}

// ==========================================
// USUARIOS (Administradores)
// ==========================================
export interface User {
  id: string;
  username: string;
  password_hash: string;
}

export async function getUserByUsername(username: string): Promise<User | null> {
  if (!hasDb) return null;
  try {
    const { rows } = await sql`SELECT * FROM users WHERE username = ${username};`;
    return rows[0] as User || null;
  } catch {
    return null;
  }
}

export async function getAllUsers(): Promise<User[]> {
  if (!hasDb) return [];
  try {
    const { rows } = await sql`SELECT id, username, password_hash FROM users ORDER BY username ASC;`;
    return rows as User[];
  } catch {
    return [];
  }
}

export async function createUser(username: string, passwordHash: string): Promise<boolean> {
  if (!hasDb) return false;
  try {
    await sql`
      INSERT INTO users (username, password_hash)
      VALUES (${username}, ${passwordHash});
    `;
    return true;
  } catch (e) {
    console.error('Error creando usuario:', e);
    return false;
  }
}

export async function updatePassword(username: string, passwordHash: string): Promise<boolean> {
  if (!hasDb) return false;
  try {
    await sql`
      UPDATE users SET password_hash = ${passwordHash} WHERE username = ${username};
    `;
    return true;
  } catch (e) {
    console.error('Error actualizando password:', e);
    return false;
  }
}

// ==========================================
// SETTINGS (Configuraciones)
// ==========================================
export async function getSetting(key: string, defaultValue: string): Promise<string> {
  if (!hasDb) return defaultValue;
  try {
    const { rows } = await sql`SELECT value FROM settings WHERE key = ${key};`;
    return rows[0]?.value || defaultValue;
  } catch {
    return defaultValue;
  }
}

export async function updateSetting(key: string, value: string): Promise<boolean> {
  if (!hasDb) return false;
  try {
    await sql`
      INSERT INTO settings (key, value)
      VALUES (${key}, ${value})
      ON CONFLICT (key) DO UPDATE SET value = ${value};
    `;
    return true;
  } catch (e) {
    console.error(`Error actualizando setting ${key}:`, e);
    return false;
  }
}

export async function getWhatsAppNumber(): Promise<string> {
  return getSetting('whatsapp_number', '573101234567');
}

export async function updateWhatsAppNumber(newNumber: string): Promise<boolean> {
  return updateSetting('whatsapp_number', newNumber);
}

// ==========================================
// PRODUCTOS
// ==========================================
export async function getProducts(): Promise<Product[]> {
  if (!hasDb) return staticProducts;
  
  try {
    const { rows } = await sql`SELECT * FROM products ORDER BY id ASC;`;
    if (rows.length === 0) return staticProducts; // Si está conectada pero vacía
    
    // Normalizar tipos
    return rows.map(r => ({
      ...r,
      id: r.id.toString(),
      price: parseFloat(r.price)
    })) as Product[];
  } catch (error) {
    console.error('Error obteniendo productos de DB:', error);
    return staticProducts;
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  if (!hasDb) return staticProducts.find(p => p.id === id) || null;

  try {
    const { rows } = await sql`SELECT * FROM products WHERE id = ${parseInt(id)};`;
    if (!rows[0]) return null;
    return {
      ...rows[0],
      id: rows[0].id.toString(),
      price: parseFloat(rows[0].price)
    } as Product;
  } catch {
    return staticProducts.find(p => p.id === id) || null;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!hasDb) return staticProducts.find(p => p.slug === slug) || null;

  try {
    const { rows } = await sql`SELECT * FROM products WHERE slug = ${slug};`;
    if (!rows[0]) return null;
    return {
      ...rows[0],
      id: rows[0].id.toString(),
      price: parseFloat(rows[0].price)
    } as Product;
  } catch {
    return staticProducts.find(p => p.slug === slug) || null;
  }
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<boolean> {
  if (!hasDb) return false;
  
  try {
    await sql`
      UPDATE products 
      SET 
        name = COALESCE(${data.name}, name),
        price = COALESCE(${data.price}, price),
        short_desc = COALESCE(${data.short_desc}, short_desc),
        description = COALESCE(${data.description}, description),
        is_available = COALESCE(${data.is_available}, is_available),
        is_featured = COALESCE(${data.is_featured}, is_featured),
        image_url = COALESCE(${data.image_url}, image_url)
      WHERE id = ${parseInt(id)};
    `;
    return true;
  } catch (e) {
    console.error('Error actualizando producto:', e);
    return false;
  }
}
