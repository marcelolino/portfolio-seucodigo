import { db } from "../db";
import { users, projects, services, testimonials, siteSettings } from "@shared/schema";
import { eq, sql } from "drizzle-orm";
import { 
  seedUsers, 
  seedProjects, 
  seedServices, 
  seedTestimonials, 
  seedSiteSettings,
  generateHashedPasswords 
} from "./seedData";

export async function runCompleteMigration() {
  console.log("🚀 Iniciando migração completa...");

  try {
    // Primeiro, gerar senhas hasheadas
    await generateHashedPasswords();
    console.log("✅ Senhas hasheadas geradas");

    // Limpar tabelas existentes (em ordem para respeitar chaves estrangeiras)
    await db.delete(testimonials);
    await db.delete(services);
    await db.delete(projects);
    await db.delete(users).where(sql`username != 'admin'`);
    console.log("🧹 Tabelas limpas");

    // Inserir usuários
    console.log("👥 Inserindo usuários...");
    for (const user of seedUsers) {
      try {
        await db.insert(users).values(user).onConflictDoNothing();
        console.log(`  ✅ Usuário ${user.name} inserido`);
      } catch (error) {
        console.log(`  ⚠️ Usuário ${user.name} já existe ou erro: ${error}`);
      }
    }

    // Inserir projetos
    console.log("📁 Inserindo projetos...");
    for (const project of seedProjects) {
      try {
        await db.insert(projects).values(project);
        console.log(`  ✅ Projeto ${project.title} inserido`);
      } catch (error) {
        console.log(`  ❌ Erro ao inserir projeto ${project.title}: ${error}`);
      }
    }

    // Inserir serviços
    console.log("⚙️ Inserindo serviços...");
    for (const service of seedServices) {
      try {
        await db.insert(services).values(service);
        console.log(`  ✅ Serviço ${service.title} inserido`);
      } catch (error) {
        console.log(`  ❌ Erro ao inserir serviço ${service.title}: ${error}`);
      }
    }

    // Inserir depoimentos
    console.log("💬 Inserindo depoimentos...");
    for (const testimonial of seedTestimonials) {
      try {
        await db.insert(testimonials).values(testimonial);
        console.log(`  ✅ Depoimento de ${testimonial.name} inserido`);
      } catch (error) {
        console.log(`  ❌ Erro ao inserir depoimento de ${testimonial.name}: ${error}`);
      }
    }

    // Atualizar configurações do site
    console.log("⚙️ Atualizando configurações do site...");
    try {
      const existingSettings = await db.select().from(siteSettings).limit(1);
      
      if (existingSettings.length > 0) {
        await db.update(siteSettings)
          .set(seedSiteSettings)
          .where(eq(siteSettings.id, existingSettings[0].id));
        console.log("  ✅ Configurações atualizadas");
      } else {
        await db.insert(siteSettings).values(seedSiteSettings);
        console.log("  ✅ Configurações criadas");
      }
    } catch (error) {
      console.log(`  ❌ Erro ao atualizar configurações: ${error}`);
    }

    console.log("🎉 Migração completa finalizada com sucesso!");
    
    // Mostrar estatísticas
    const stats = await getDataStats();
    console.log("\n📊 Estatísticas finais:");
    console.log(`  👥 Usuários: ${stats.users}`);
    console.log(`  📁 Projetos: ${stats.projects}`);
    console.log(`  ⚙️ Serviços: ${stats.services}`);
    console.log(`  💬 Depoimentos: ${stats.testimonials}`);

  } catch (error) {
    console.error("❌ Erro durante a migração:", error);
    throw error;
  }
}

export async function resetAllTables() {
  console.log("🗑️ Removendo todos os dados...");
  
  try {
    await db.delete(testimonials);
    await db.delete(services);
    await db.delete(projects);
    await db.delete(users);
    
    console.log("✅ Todas as tabelas foram limpas");
  } catch (error) {
    console.error("❌ Erro ao limpar tabelas:", error);
    throw error;
  }
}

export async function checkDataIntegrity() {
  console.log("🔍 Verificando integridade dos dados...");
  
  try {
    const stats = await getDataStats();
    
    console.log("📊 Dados atuais:");
    console.log(`  👥 Usuários: ${stats.users}`);
    console.log(`  📁 Projetos: ${stats.projects}`);
    console.log(`  ⚙️ Serviços: ${stats.services}`);
    console.log(`  💬 Depoimentos: ${stats.testimonials}`);
    
    // Verificar se há usuário admin
    const adminUser = await db.select()
      .from(users)
      .where(eq(users.role, "admin"))
      .limit(1);
    
    if (adminUser.length === 0) {
      console.log("⚠️ Nenhum usuário admin encontrado!");
      return false;
    } else {
      console.log(`✅ Usuário admin encontrado: ${adminUser[0].username}`);
    }
    
    // Verificar configurações do site
    const settings = await db.select().from(siteSettings).limit(1);
    if (settings.length === 0) {
      console.log("⚠️ Configurações do site não encontradas!");
      return false;
    } else {
      console.log(`✅ Configurações do site: ${settings[0].siteName}`);
    }
    
    console.log("✅ Integridade dos dados verificada com sucesso!");
    return true;
    
  } catch (error) {
    console.error("❌ Erro ao verificar integridade:", error);
    return false;
  }
}

async function getDataStats() {
  const [userCount] = await db.select({ count: sql<number>`count(*)` }).from(users);
  const [projectCount] = await db.select({ count: sql<number>`count(*)` }).from(projects);
  const [serviceCount] = await db.select({ count: sql<number>`count(*)` }).from(services);
  const [testimonialCount] = await db.select({ count: sql<number>`count(*)` }).from(testimonials);
  
  return {
    users: userCount.count,
    projects: projectCount.count,
    services: serviceCount.count,
    testimonials: testimonialCount.count
  };
}