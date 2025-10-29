#!/usr/bin/env node

/**
 * Script para executar migração no PostgreSQL local
 * 
 * Uso:
 * node run-local-migration.js
 * 
 * Certifique-se de ter:
 * 1. PostgreSQL rodando localmente
 * 2. Banco 'portfolio' criado
 * 3. .env configurado com DATABASE_URL
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Carregar variáveis de ambiente
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env') });

console.log('🔧 Configuração do ambiente:');
console.log(`   DATABASE_URL: ${process.env.DATABASE_URL ? 'Configurado' : 'NÃO CONFIGURADO'}`);
console.log('');

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL não configurado no arquivo .env');
  console.log('');
  console.log('📝 Crie um arquivo .env na raiz do projeto com:');
  console.log('DATABASE_URL=postgresql://postgres:123@localhost:5432/portfolio');
  console.log('');
  process.exit(1);
}

// Importar e executar migração
import('./server/migration/migrate-local.ts')
  .then(({ runMigration }) => {
    return runMigration();
  })
  .then(() => {
    console.log('');
    console.log('🎉 Migração local concluída com sucesso!');
    console.log('');
    console.log('🚀 Próximos passos:');
    console.log('1. npm run dev (para desenvolvimento)');
    console.log('2. Acesse http://localhost:5000');
    console.log('3. Login: admin/admin123');
    console.log('');
    process.exit(0);
  })
  .catch((error) => {
    console.error('');
    console.error('❌ Erro na migração:', error.message);
    console.error('');
    console.log('🔍 Verifique se:');
    console.log('1. PostgreSQL está rodando (psql -U postgres)');
    console.log('2. Banco "portfolio" existe (CREATE DATABASE portfolio;)');
    console.log('3. Credenciais no .env estão corretas');
    console.log('4. Não há conflitos de porta');
    console.error('');
    process.exit(1);
  });