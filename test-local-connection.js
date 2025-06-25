#!/usr/bin/env node

/**
 * Script para testar conexão PostgreSQL local
 */

import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:123@localhost:5432/portfolio';

console.log('🔍 Testando conexão PostgreSQL local...');
console.log(`📍 URL: ${connectionString.replace(/:[^:@]*@/, ':***@')}`);

const pool = new Pool({ 
  connectionString,
  ssl: false,
  max: 1,
  connectionTimeoutMillis: 5000,
});

async function testConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT version(), current_database(), current_user');
    client.release();
    
    console.log('✅ Conexão estabelecida com sucesso!');
    console.log(`📊 Versão PostgreSQL: ${result.rows[0].version.split(' ')[0]} ${result.rows[0].version.split(' ')[1]}`);
    console.log(`🗄️ Banco atual: ${result.rows[0].current_database}`);
    console.log(`👤 Usuário: ${result.rows[0].current_user}`);
    
    // Testar se consegue criar/listar tabelas
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log(`📋 Tabelas existentes: ${tables.rows.length > 0 ? tables.rows.map(r => r.table_name).join(', ') : 'Nenhuma'}`);
    
    await pool.end();
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Erro na conexão:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Soluções possíveis:');
      console.log('1. Inicie PostgreSQL: sudo service postgresql start');
      console.log('2. Verifique se está na porta 5432: sudo netstat -tlnp | grep 5432');
    } else if (error.code === '3D000') {
      console.log('\n💡 Banco não existe:');
      console.log('1. Crie o banco: createdb portfolio');
      console.log('2. Ou: sudo -u postgres createdb portfolio');
    } else if (error.code === '28P01') {
      console.log('\n💡 Problema de autenticação:');
      console.log('1. Verifique usuário/senha no .env');
      console.log('2. Configure PostgreSQL: sudo -u postgres psql');
      console.log('3. ALTER USER postgres PASSWORD \'123\';');
    }
    
    await pool.end();
    process.exit(1);
  }
}

testConnection();