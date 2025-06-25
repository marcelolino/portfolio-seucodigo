import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to configure your local database?",
  );
}

export const pool = new Pool({ 
  connectionString: DATABASE_URL,
  // Configurações específicas para PostgreSQL local
  ssl: false, // Desabilita SSL para conexões locais
  max: 20, // Máximo de conexões no pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const db = drizzle(pool, { schema });

// Função para testar a conexão
export async function testConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log('✅ Conexão com PostgreSQL local estabelecida:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('❌ Erro na conexão com PostgreSQL local:', error instanceof Error ? error.message : 'Erro desconhecido');
    return false;
  }
}