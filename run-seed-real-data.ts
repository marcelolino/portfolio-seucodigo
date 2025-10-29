#!/usr/bin/env tsx

/**
 * Script para executar seed com dados reais do João Moura
 * 
 * Uso:
 * npx tsx run-seed-real-data.ts
 */

import dotenv from 'dotenv';
import { db } from './server/db';
import { hashPassword } from './server/auth';
import * as schema from "./shared/schema";
import { sql } from 'drizzle-orm';

// Carregar variáveis de ambiente
dotenv.config();

console.log('🚀 Iniciando seed com dados reais...');
console.log(`📧 Contato: joaomoura.gta49@gmail.com`);
console.log(`📱 Telefone: (62) 99888-7766`);
console.log('');

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL não configurado no arquivo .env');
  process.exit(1);
}

async function runRealDataSeed() {
  // Testar conexão primeiro
  console.log("🔌 Testando conexão com o banco...");
  try {
    const result = await db.execute(sql`SELECT NOW()`);
    console.log("✅ Conexão com PostgreSQL estabelecida:", result.rows[0]);
  } catch (error) {
    console.error("❌ Erro na conexão:", error);
    throw new Error("Falha na conexão com o banco de dados");
  }
  
  try {
    // Limpar dados existentes
    console.log("🧹 Limpando dados existentes...");
    await db.delete(schema.messages);
    await db.delete(schema.contacts);
    await db.delete(schema.orders);
    await db.delete(schema.testimonials);
    await db.delete(schema.services);
    await db.delete(schema.projects);
    await db.delete(schema.paymentMethods);
    await db.delete(schema.siteSettings);
    await db.delete(schema.users);
    console.log("  ✅ Dados limpos");

    // Inserir usuários com dados reais
    console.log("👥 Inserindo usuários com dados reais...");
    
    // Admin principal - João Moura
    const adminPassword = await hashPassword("admin123");
    await db.insert(schema.users).values({
      name: "João Moura",
      email: "joaomoura.gta49@gmail.com",
      username: "admin",
      password: adminPassword,
      role: "admin",
      avatar: null,
      createdAt: new Date()
    });
    console.log("  ✅ Admin João Moura criado");

    // Clientes reais do sistema automotivo
    const clientPasswords = [
      { name: "Roberto da Silva Santos", email: "roberto.santos@oficina.com", username: "roberto", password: await hashPassword("roberto123") },
      { name: "Anderson Luiz Ferreira", email: "anderson.ferreira@oficina.com", username: "anderson", password: await hashPassword("anderson123") },
      { name: "Carlos Eduardo Silva", email: "carlos.silva@email.com", username: "carlos", password: await hashPassword("carlos123") },
      { name: "Maria Fernanda Santos", email: "maria.santos@email.com", username: "maria", password: await hashPassword("maria123") }
    ];

    for (const user of clientPasswords) {
      await db.insert(schema.users).values({
        name: user.name,
        email: user.email,
        username: user.username,
        password: user.password,
        role: "user",
        avatar: null,
        createdAt: new Date()
      });
      console.log(`  ✅ Cliente ${user.name} criado`);
    }

    // Projetos reais do portfólio
    console.log("📂 Inserindo projetos do portfólio...");
    const realProjects = [
      {
        title: "Sistema OfiMotors - Gestão Automotiva",
        description: "Sistema completo de gestão para oficinas mecânicas com controle de estoque, ordens de serviço, clientes e fornecedores. Inclui relatórios avançados e dashboard em tempo real.",
        category: "Sistema Empresarial",
        technologies: ["React", "Node.js", "PostgreSQL", "TypeScript", "Express", "Chart.js"],
        image: "https://images.unsplash.com/photo-1486312338219-ce68e2c54347",
        featured: true,
        price: "12000.00",
        status: "completed"
      },
      {
        title: "Portal AutoPeças Brasil",
        description: "E-commerce especializado em autopeças com catálogo completo, sistema de vendas online e integração com fornecedores. Gestão completa de estoque e vendas.",
        category: "E-commerce",
        technologies: ["Next.js", "Stripe", "PostgreSQL", "Tailwind CSS", "React Query"],
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64",
        featured: true,
        price: "8500.00",
        status: "active"
      },
      {
        title: "App Mecânicos Mobile",
        description: "Aplicativo móvel para mecânicos com gestão de ordens de serviço, comunicação com clientes via chat e notificações push para status de serviços.",
        category: "Mobile Development",
        technologies: ["React Native", "Firebase", "Node.js", "Socket.io"],
        image: "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f",
        featured: false,
        price: "6500.00",
        status: "active"
      },
      {
        title: "Dashboard Analytics OfiMotors",
        description: "Dashboard com métricas em tempo real para acompanhamento de vendas, serviços executados, análise de estoque e relatórios gerenciais avançados.",
        category: "Data Visualization",
        technologies: ["React", "D3.js", "Chart.js", "PostgreSQL", "Express"],
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
        featured: false,
        price: "4200.00",
        status: "completed"
      },
      {
        title: "E-commerce Responsivo",
        description: "Loja virtual completa com carrinho de compras, sistema de pagamento e painel administrativo. Desenvolvida com React e Node.js.",
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
        technologies: ["React", "Node.js", "PostgreSQL", "Stripe"],
        price: "2500.00",
        category: "E-commerce",
        status: "completed",
        featured: true
      },
      {
        title: "Aplicativo de Gestão Financeira",
        description: "App mobile para controle de finanças pessoais com gráficos, relatórios e sincronização em nuvem.",
        image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop",
        technologies: ["React Native", "Firebase", "Chart.js"],
        price: "3000.00",
        category: "Mobile",
        status: "completed",
        featured: false
      },
      {
        title: "Portal Institucional",
        description: "Website corporativo moderno com CMS integrado, blog e sistema de contato.",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
        technologies: ["Next.js", "Tailwind CSS", "Strapi"],
        price: "1800.00",
        category: "Website",
        status: "completed",
        featured: false
      }
    ];

    for (const project of realProjects) {
      await db.insert(schema.projects).values({
        title: project.title,
        description: project.description,
        category: project.category,
        technologies: project.technologies,
        image: project.image,
        featured: project.featured,
        price: project.price,
        status: project.status,
        createdAt: new Date()
      });
      console.log(`  ✅ Projeto ${project.title} inserido`);
    }

    // Serviços especializados
    console.log("🛠️ Inserindo serviços especializados...");
    const realServices = [
      {
        title: "Desenvolvimento de Sistemas Empresariais",
        description: "Desenvolvimento completo de sistemas de gestão empresarial personalizados para o setor automotivo e industrial",
        category: "Desenvolvimento",
        price: "180.00",
        duration: "50 horas",
        features: ["Gestão completa", "Relatórios avançados", "API integração", "Dashboard analytics"]
      },
      {
        title: "E-commerce Automotivo",
        description: "Desenvolvimento de plataformas e-commerce especializadas no setor automotivo com catálogo de peças e gestão de vendas",
        category: "E-commerce",
        price: "220.00",
        duration: "60 horas",
        features: ["Catálogo de peças", "Sistema de vendas", "Gestão de estoque", "Integração pagamentos"]
      },
      {
        title: "Aplicativos Mobile para Oficinas",
        description: "Desenvolvimento de apps móveis para gestão de oficinas mecânicas e comunicação com clientes",
        category: "Mobile",
        price: "160.00",
        duration: "45 horas",
        features: ["App nativo", "Notificações push", "Chat em tempo real", "Geolocalização"]
      },
      {
        title: "Consultoria em Sistemas Automotivos",
        description: "Consultoria especializada em digitalização e automação de processos no setor automotivo",
        category: "Consultoria",
        price: "250.00",
        duration: "Por hora",
        features: ["Análise de processos", "Automação", "Integração sistemas", "Treinamento equipe"]
      },
      {
        title: "Desenvolvimento Web Full-Stack",
        description: "Criação de aplicações web completas, desde o frontend até o backend, com tecnologias modernas e escaláveis.",
        price: "150.00",
        category: "Web Development",
        technologies: ["React", "Node.js", "PostgreSQL"],
        duration: "40 horas",
        features: ["Frontend React", "Backend Node.js", "Banco PostgreSQL", "API REST"]
      },
      {
        title: "Aplicativos Mobile Nativos",
        description: "Desenvolvimento de apps para iOS e Android com performance nativa e experiência de usuário excepcional.",
        price: "200.00",
        category: "Mobile Development",
        technologies: ["React Native", "Flutter"],
        duration: "55 horas",
        features: ["App nativo", "Multiplataforma", "Performance otimizada", "UX excepcional"]
      },
      {
        title: "E-commerce Personalizado",
        description: "Lojas virtuais sob medida com carrinho, pagamentos, estoque e painel administrativo completo.",
        price: "250.00",
        category: "E-commerce",
        technologies: ["React", "Stripe", "PostgreSQL"],
        duration: "65 horas",
        features: ["Carrinho de compras", "Pagamentos Stripe", "Gestão de estoque", "Painel admin"]
      }
    ];

    for (const service of realServices) {
      await db.insert(schema.services).values({
        title: service.title,
        description: service.description,
        category: service.category,
        price: service.price,
        technologies: (service as any).technologies || null,
        status: "active",
        featured: false
      });
      console.log(`  ✅ Serviço ${service.title} inserido`);
    }

    // Depoimentos reais de clientes
    console.log("💬 Inserindo depoimentos de clientes...");
    const realTestimonials = [
      {
        name: "Roberto da Silva Santos",
        company: "AutoPeças Brasil Ltda",
        content: "O João desenvolveu um sistema completo de gestão que revolucionou nossa empresa. Controle total do estoque, vendas em tempo real e relatórios que nos ajudam nas decisões estratégicas. Profissional excepcional!",
        rating: 5,
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
      },
      {
        name: "Anderson Luiz Ferreira",
        company: "Oficina Mecânica Express",
        content: "Trabalho impecável! O app móvel desenvolvido facilitou muito nosso atendimento aos clientes. Agora conseguimos dar updates em tempo real sobre os serviços. Recomendo de olhos fechados!",
        rating: 5,
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
      },
      {
        name: "Carlos Eduardo Silva",
        company: "Distribuidora Motores S/A",
        content: "Sistema robusto e confiável. O dashboard de analytics desenvolvido pelo João nos dá uma visão completa do negócio. Conseguimos identificar tendências e otimizar nossos processos.",
        rating: 5,
        image: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5"
      },
      {
        name: "Maria Fernanda Santos",
        company: "Freios & Suspensão Sul",
        content: "A consultoria do João foi fundamental para digitalizarmos nossos processos. Automatizamos tarefas manuais e aumentamos nossa produtividade em 40%. Investimento que se pagou rapidamente!",
        rating: 5,
        image: "https://images.unsplash.com/photo-1494790108755-2616b2f6c4e5"
      }
    ];

    for (const testimonial of realTestimonials) {
      await db.insert(schema.testimonials).values({
        name: testimonial.name,
        company: testimonial.company,
        message: testimonial.content,
        rating: testimonial.rating,
        avatar: testimonial.image,
        createdAt: new Date()
      });
      console.log(`  ✅ Depoimento de ${testimonial.name} inserido`);
    }

    // Configurações do site
    console.log("⚙️ Inserindo configurações do site...");
    await db.insert(schema.siteSettings).values({
      siteName: "João Moura Dev",
      siteTitle: "João Moura - Desenvolvimento de Sistemas Empresariais",
      contactEmail: "joaomoura.gta49@gmail.com",
      contactPhone: "(62) 99888-7766",
      address: "Goiânia, GO",
      github: "https://github.com/joaomoura",
      linkedin: "https://linkedin.com/in/joaomoura-dev",
      twitter: "https://twitter.com/joaomoura_dev",
      instagram: "https://instagram.com/joaomoura.dev",
      whatsapp: "5562998887766",
      updatedAt: new Date()
    });
    console.log("  ✅ Configurações inseridas");

    // Métodos de pagamento
    console.log("💳 Inserindo métodos de pagamento...");
    const paymentMethods = [
      {
        provider: "stripe",
        name: "Cartão de Crédito/Débito",
        enabled: true,
        currency: "BRL",
        config: JSON.stringify({
          publicKey: "pk_test_joaomoura",
          currency: "BRL",
          acceptedCards: ["visa", "mastercard", "elo"]
        })
      },
      {
        provider: "pix",
        name: "PIX",
        enabled: true,
        currency: "BRL",
        config: JSON.stringify({
          pixKey: "joaomoura.gta49@gmail.com",
          bankName: "Banco Inter",
          pixType: "email"
        })
      },
      {
        provider: "bank_transfer",
        name: "Transferência Bancária",
        enabled: true,
        currency: "BRL",
        config: JSON.stringify({
          bankName: "Banco Inter",
          agency: "0001",
          account: "123456-7",
          accountType: "corrente"
        })
      }
    ];

    for (const method of paymentMethods) {
      await db.insert(schema.paymentMethods).values({
        ...method,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log(`  ✅ Método ${method.name} inserido`);
    }

    console.log("\n🎉 Seed com dados reais concluído com sucesso!");
    console.log("\n📊 Dados inseridos:");
    console.log("  👥 5 usuários (1 admin + 4 clientes)");
    console.log("  📂 4 projetos do portfólio");
    console.log("  🛠️ 4 serviços especializados");
    console.log("  💬 4 depoimentos de clientes");
    console.log("  ⚙️ Configurações do site");
    console.log("  💳 3 métodos de pagamento");
    
    console.log("\n🔑 Credenciais de acesso:");
    console.log("  Admin: admin / admin123");
    console.log("  Cliente: roberto / roberto123");
    console.log("  Cliente: anderson / anderson123");
    console.log("  Cliente: carlos / carlos123");

    console.log("\n🚀 Para iniciar o projeto:");
    console.log("  npm run dev");
    console.log("  Acesse: http://localhost:5000");

  } catch (error) {
    console.error("\n❌ Erro no seed:", error.message);
    throw error;
  }
}

// Executar seed
runRealDataSeed()
  .then(() => {
    console.log("\n✅ Processo concluído!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Falha no seed:", error);
    process.exit(1);
  });