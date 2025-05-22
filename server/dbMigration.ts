import { db } from './db';
import * as schema from '@shared/schema';
import { storage } from './storage';

async function runMigration() {
  console.log('🔄 Iniciando migração do banco de dados...');

  try {
    // Criar tabelas
    console.log('📋 Criando tabelas...');
    
    // Usuários
    await db.execute(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" SERIAL PRIMARY KEY,
        "username" TEXT NOT NULL UNIQUE,
        "password" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "email" TEXT NOT NULL UNIQUE,
        "role" TEXT NOT NULL DEFAULT 'user',
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    console.log('✅ Tabela "users" criada com sucesso');

    // Projetos
    await db.execute(`
      CREATE TABLE IF NOT EXISTS "projects" (
        "id" SERIAL PRIMARY KEY,
        "title" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "category" TEXT NOT NULL,
        "technologies" TEXT[] NOT NULL,
        "image" TEXT NOT NULL,
        "featured" BOOLEAN DEFAULT FALSE,
        "order" INTEGER DEFAULT 0,
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    console.log('✅ Tabela "projects" criada com sucesso');

    // Serviços
    await db.execute(`
      CREATE TABLE IF NOT EXISTS "services" (
        "id" SERIAL PRIMARY KEY,
        "title" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "icon" TEXT NOT NULL,
        "price" NUMERIC(10, 2) NOT NULL,
        "order" INTEGER DEFAULT 0,
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    console.log('✅ Tabela "services" criada com sucesso');

    // Depoimentos
    await db.execute(`
      CREATE TABLE IF NOT EXISTS "testimonials" (
        "id" SERIAL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "position" TEXT NOT NULL,
        "company" TEXT NOT NULL,
        "message" TEXT NOT NULL,
        "avatar" TEXT NOT NULL,
        "rating" INTEGER NOT NULL,
        "order" INTEGER DEFAULT 0,
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    console.log('✅ Tabela "testimonials" criada com sucesso');

    // Mensagens
    await db.execute(`
      CREATE TABLE IF NOT EXISTS "messages" (
        "id" SERIAL PRIMARY KEY,
        "content" TEXT NOT NULL,
        "sender_id" INTEGER,
        "receiver_id" INTEGER,
        "is_admin" BOOLEAN DEFAULT FALSE,
        "read" BOOLEAN DEFAULT FALSE,
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    console.log('✅ Tabela "messages" criada com sucesso');

    // Contatos
    await db.execute(`
      CREATE TABLE IF NOT EXISTS "contacts" (
        "id" SERIAL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "phone" TEXT,
        "subject" TEXT NOT NULL,
        "message" TEXT NOT NULL,
        "read" BOOLEAN DEFAULT FALSE,
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    console.log('✅ Tabela "contacts" criada com sucesso');

    // Configurações do site
    await db.execute(`
      CREATE TABLE IF NOT EXISTS "site_settings" (
        "id" SERIAL PRIMARY KEY,
        "site_name" TEXT NOT NULL DEFAULT 'SeuCodigo',
        "site_title" TEXT NOT NULL DEFAULT 'Soluções em desenvolvimento web e mobile para elevar seu negócio ao próximo nível.',
        "contact_email" TEXT NOT NULL DEFAULT 'contato@seucodigo.com',
        "contact_phone" TEXT DEFAULT '(11) 9999-8888',
        "address" TEXT DEFAULT 'Av. Paulista, 1000, São Paulo - SP',
        "logo" TEXT DEFAULT '',
        "github" TEXT DEFAULT '',
        "linkedin" TEXT DEFAULT '',
        "twitter" TEXT DEFAULT '',
        "instagram" TEXT DEFAULT '',
        "whatsapp" TEXT DEFAULT '',
        "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    console.log('✅ Tabela "site_settings" criada com sucesso');

    // Inicializar dados padrão
    await storage.seedInitialData();
    console.log('✅ Dados iniciais inseridos com sucesso');

    console.log('✅ Migração concluída com sucesso!');
  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
    throw error;
  }
}

runMigration().catch(console.error);