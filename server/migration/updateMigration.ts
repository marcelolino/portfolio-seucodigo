
import { db } from "../db";
import { sql } from "drizzle-orm";

export async function runUpdatedMigration() {
  console.log("🔄 Iniciando migração atualizada do banco de dados...");

  try {
    // 1. Criar tabela users
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" SERIAL PRIMARY KEY,
        "username" TEXT NOT NULL UNIQUE,
        "password" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "email" TEXT NOT NULL UNIQUE,
        "avatar" TEXT,
        "role" TEXT NOT NULL DEFAULT 'user',
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    console.log("✅ Tabela 'users' criada/atualizada");

    // 2. Criar tabela projects
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "projects" (
        "id" SERIAL PRIMARY KEY,
        "title" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "category" TEXT NOT NULL,
        "technologies" TEXT[] NOT NULL,
        "image" TEXT NOT NULL,
        "image_url" TEXT,
        "featured" BOOLEAN DEFAULT FALSE,
        "order" INTEGER DEFAULT 0,
        "price" NUMERIC(10, 2),
        "status" TEXT NOT NULL DEFAULT 'active',
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    console.log("✅ Tabela 'projects' criada/atualizada");

    // 3. Criar tabela services
    await db.execute(sql`
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
    console.log("✅ Tabela 'services' criada/atualizada");

    // 4. Criar tabela testimonials
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "testimonials" (
        "id" SERIAL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "company" TEXT NOT NULL,
        "position" TEXT,
        "avatar" TEXT NOT NULL,
        "message" TEXT NOT NULL,
        "rating" INTEGER NOT NULL,
        "order" INTEGER DEFAULT 0,
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    console.log("✅ Tabela 'testimonials' criada/atualizada");

    // 5. Criar tabela messages
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "messages" (
        "id" SERIAL PRIMARY KEY,
        "user_id" INTEGER REFERENCES "users"("id"),
        "receiver_id" INTEGER,
        "content" TEXT NOT NULL,
        "is_admin" BOOLEAN NOT NULL DEFAULT FALSE,
        "read" BOOLEAN DEFAULT FALSE,
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    console.log("✅ Tabela 'messages' criada/atualizada");

    // 6. Criar tabela contacts
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "contacts" (
        "id" SERIAL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "subject" TEXT NOT NULL,
        "message" TEXT NOT NULL,
        "is_read" BOOLEAN DEFAULT FALSE,
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    console.log("✅ Tabela 'contacts' criada/atualizada");

    // 7. Criar tabela site_settings
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "site_settings" (
        "id" SERIAL PRIMARY KEY,
        "site_name" TEXT NOT NULL,
        "site_title" TEXT NOT NULL,
        "contact_email" TEXT NOT NULL,
        "contact_phone" TEXT,
        "address" TEXT,
        "logo" TEXT,
        "github" TEXT,
        "linkedin" TEXT,
        "twitter" TEXT,
        "instagram" TEXT,
        "whatsapp" TEXT,
        "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    console.log("✅ Tabela 'site_settings' criada/atualizada");

    // 8. Criar tabela orders
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "orders" (
        "id" SERIAL PRIMARY KEY,
        "client_name" TEXT NOT NULL,
        "client_email" TEXT NOT NULL,
        "client_phone" TEXT,
        "project_id" INTEGER REFERENCES "projects"("id"),
        "service_id" INTEGER REFERENCES "services"("id"),
        "project_title" TEXT,
        "description" TEXT NOT NULL,
        "budget" NUMERIC(10, 2),
        "deadline" TIMESTAMP WITH TIME ZONE,
        "status" TEXT NOT NULL DEFAULT 'pending',
        "priority" TEXT NOT NULL DEFAULT 'medium',
        "notes" TEXT,
        "total_value" NUMERIC(10, 2),
        "payment_method" TEXT,
        "payment_status" TEXT DEFAULT 'pending',
        "payment_id" TEXT,
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    console.log("✅ Tabela 'orders' criada/atualizada");

    // 9. Criar tabela payment_methods
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "payment_methods" (
        "id" SERIAL PRIMARY KEY,
        "provider" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "enabled" BOOLEAN DEFAULT FALSE,
        "currency" TEXT DEFAULT 'BRL',
        "public_key" TEXT,
        "secret_key" TEXT,
        "webhook_secret" TEXT,
        "logo" TEXT,
        "config" TEXT,
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    console.log("✅ Tabela 'payment_methods' criada/atualizada");

    console.log("✅ Migração atualizada concluída com sucesso!");
    return { success: true };

  } catch (error) {
    console.error("❌ Erro durante a migração atualizada:", error);
    throw error;
  }
}
