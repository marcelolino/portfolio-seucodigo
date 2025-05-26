import { db } from "../db";
import { users, projects, services, testimonials, siteSettings } from "@shared/schema";
import { 
  seedUsers, 
  seedProjects, 
  seedServices, 
  seedTestimonials, 
  seedSiteSettings,
  generateHashedPasswords 
} from "./seedData";
import { sql, count } from "drizzle-orm";

export async function runCompleteMigration() {
  console.log("🚀 Iniciando migração completa do banco de dados...");

  try {
    // Verificar se já existem dados nas tabelas principais
    const [userCount] = await db.select({ count: count() }).from(users);
    const [projectCount] = await db.select({ count: count() }).from(projects);
    const [serviceCount] = await db.select({ count: count() }).from(services);
    const [testimonialCount] = await db.select({ count: count() }).from(testimonials);
    const [settingsCount] = await db.select({ count: count() }).from(siteSettings);

    console.log("📊 Status atual das tabelas:");
    console.log(`- Usuários: ${userCount.count}`);
    console.log(`- Projetos: ${projectCount.count}`);
    console.log(`- Serviços: ${serviceCount.count}`);
    console.log(`- Depoimentos: ${testimonialCount.count}`);
    console.log(`- Configurações: ${settingsCount.count}`);

    // 1. Criar usuários (se não existirem)
    if (userCount.count === 0) {
      console.log("👤 Criando usuários padrão...");
      const usersWithHashedPasswords = await generateHashedPasswords();
      
      for (const user of usersWithHashedPasswords) {
        await db.insert(users).values(user);
        console.log(`   ✓ Usuário criado: ${user.name} (${user.role})`);
      }
    } else {
      console.log("👤 Usuários já existem, pulando criação...");
    }

    // 2. Criar configurações do site (se não existirem)
    if (settingsCount.count === 0) {
      console.log("⚙️ Criando configurações do site...");
      await db.insert(siteSettings).values(seedSiteSettings);
      console.log("   ✓ Configurações do site criadas");
    } else {
      console.log("⚙️ Configurações do site já existem, pulando criação...");
    }

    // 3. Criar serviços (se não existirem)
    if (serviceCount.count === 0) {
      console.log("🛠️ Criando serviços...");
      for (const service of seedServices) {
        await db.insert(services).values(service);
        console.log(`   ✓ Serviço criado: ${service.title} - R$ ${service.price}`);
      }
    } else {
      console.log("🛠️ Serviços já existem, pulando criação...");
    }

    // 4. Criar projetos (se não existirem)
    if (projectCount.count === 0) {
      console.log("📁 Criando projetos...");
      for (const project of seedProjects) {
        await db.insert(projects).values(project);
        console.log(`   ✓ Projeto criado: ${project.title} (${project.category})`);
      }
    } else {
      console.log("📁 Projetos já existem, pulando criação...");
    }

    // 5. Criar depoimentos (se não existirem)
    if (testimonialCount.count === 0) {
      console.log("💬 Criando depoimentos...");
      for (const testimonial of seedTestimonials) {
        await db.insert(testimonials).values(testimonial);
        console.log(`   ✓ Depoimento criado: ${testimonial.name} - ${testimonial.company}`);
      }
    } else {
      console.log("💬 Depoimentos já existem, pulando criação...");
    }

    // Verificar status final
    const [finalUserCount] = await db.select({ count: count() }).from(users);
    const [finalProjectCount] = await db.select({ count: count() }).from(projects);
    const [finalServiceCount] = await db.select({ count: count() }).from(services);
    const [finalTestimonialCount] = await db.select({ count: count() }).from(testimonials);
    const [finalSettingsCount] = await db.select({ count: count() }).from(siteSettings);

    console.log("\n📈 Status final das tabelas:");
    console.log(`- Usuários: ${finalUserCount.count}`);
    console.log(`- Projetos: ${finalProjectCount.count}`);
    console.log(`- Serviços: ${finalServiceCount.count}`);
    console.log(`- Depoimentos: ${finalTestimonialCount.count}`);
    console.log(`- Configurações: ${finalSettingsCount.count}`);

    console.log("\n✅ Migração completa finalizada com sucesso!");
    
    return {
      success: true,
      message: "Migração executada com sucesso",
      stats: {
        users: finalUserCount.count,
        projects: finalProjectCount.count,
        services: finalServiceCount.count,
        testimonials: finalTestimonialCount.count,
        settings: finalSettingsCount.count
      }
    };

  } catch (error) {
    console.error("❌ Erro durante a migração:", error);
    throw new Error(`Falha na migração: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
}

// Função para resetar todas as tabelas (usar com cuidado!)
export async function resetAllTables() {
  console.log("⚠️ ATENÇÃO: Resetando todas as tabelas...");
  
  try {
    // Deletar dados em ordem para respeitar as foreign keys
    await db.execute(sql`TRUNCATE TABLE orders RESTART IDENTITY CASCADE`);
    await db.execute(sql`TRUNCATE TABLE messages RESTART IDENTITY CASCADE`);
    await db.execute(sql`TRUNCATE TABLE contacts RESTART IDENTITY CASCADE`);
    await db.execute(sql`TRUNCATE TABLE testimonials RESTART IDENTITY CASCADE`);
    await db.execute(sql`TRUNCATE TABLE services RESTART IDENTITY CASCADE`);
    await db.execute(sql`TRUNCATE TABLE projects RESTART IDENTITY CASCADE`);
    await db.execute(sql`TRUNCATE TABLE site_settings RESTART IDENTITY CASCADE`);
    await db.execute(sql`TRUNCATE TABLE users RESTART IDENTITY CASCADE`);
    
    console.log("🗑️ Todas as tabelas foram resetadas");
    
    // Executar migração completa após reset
    return await runCompleteMigration();
    
  } catch (error) {
    console.error("❌ Erro ao resetar tabelas:", error);
    throw new Error(`Falha no reset: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
}

// Função para verificar integridade dos dados
export async function checkDataIntegrity() {
  console.log("🔍 Verificando integridade dos dados...");
  
  try {
    const checks = [];
    
    // Verificar se existe pelo menos um admin
    const adminResult = await db.execute(sql`SELECT COUNT(*) as count FROM users WHERE role = 'admin'`);
    const adminCount = Number((adminResult.rows[0] as any).count);
    checks.push({
      check: "Admin user exists",
      passed: adminCount > 0,
      value: adminCount
    });
    
    // Verificar se existem configurações do site
    const [settingsExist] = await db.select({ count: count() }).from(siteSettings);
    checks.push({
      check: "Site settings exist",
      passed: settingsExist.count > 0,
      value: settingsExist.count
    });
    
    // Verificar se existem serviços com preços válidos
    const servicesResult = await db.execute(sql`SELECT COUNT(*) as count FROM services WHERE price > '0'`);
    const servicesCount = Number((servicesResult.rows[0] as any).count);
    checks.push({
      check: "Services with valid prices",
      passed: servicesCount > 0,
      value: servicesCount
    });
    
    // Verificar se existem projetos
    const [projectsExist] = await db.select({ count: count() }).from(projects);
    checks.push({
      check: "Projects exist",
      passed: projectsExist.count > 0,
      value: projectsExist.count
    });
    
    console.log("\n📋 Resultados da verificação:");
    checks.forEach(check => {
      const status = check.passed ? "✅" : "❌";
      console.log(`${status} ${check.check}: ${check.value}`);
    });
    
    const allPassed = checks.every(check => check.passed);
    console.log(`\n${allPassed ? "✅" : "❌"} Integridade dos dados: ${allPassed ? "OK" : "FALHOU"}`);
    
    return {
      success: allPassed,
      checks
    };
    
  } catch (error) {
    console.error("❌ Erro na verificação de integridade:", error);
    throw new Error(`Falha na verificação: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
}