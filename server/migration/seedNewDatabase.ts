import { db } from "../db";
import { 
  users, 
  projects, 
  services, 
  testimonials, 
  siteSettings, 
  paymentMethods,
  type InsertUser,
  type InsertProject,
  type InsertService,
  type InsertTestimonial,
  type InsertSiteSettings,
  type InsertPaymentMethod
} from "../../shared/schema";
import { hashPassword } from "../auth";

async function seedDatabase() {
  console.log("🌱 Iniciando seed do banco de dados...");

  try {
    // Criar usuário admin
    console.log("👤 Criando usuário admin...");
    const adminPassword = await hashPassword("admin123");
    
    const adminUser: InsertUser = {
      username: "admin",
      password: adminPassword,
      name: "Admin",
      email: "admin@seucodigo.com",
      role: "admin"
    };

    await db.insert(users).values(adminUser);
    console.log("✅ Usuário admin criado");

    // Criar usuários de teste
    console.log("👥 Criando usuários de teste...");
    const testPassword = await hashPassword("cliente123");
    
    const testUsers: InsertUser[] = [
      {
        username: "cliente1",
        password: testPassword,
        name: "João Silva",
        email: "joao@email.com",
        role: "user"
      },
      {
        username: "cliente2",
        password: testPassword,
        name: "Maria Santos",
        email: "maria@email.com",
        role: "user"
      }
    ];

    await db.insert(users).values(testUsers);
    console.log("✅ Usuários de teste criados");

    // Criar serviços
    console.log("🛠️ Criando serviços...");
    const servicesData: InsertService[] = [
      {
        title: "Desenvolvimento Web Full-Stack",
        description: "Criação de aplicações web completas com React, Node.js e PostgreSQL. Soluções modernas e responsivas para seu negócio.",
        category: "Desenvolvimento Web",
        technologies: ["React", "Node.js", "PostgreSQL"],
        image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
        price: 2500,
        imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
        featured: true,
        status: "active"
      },
      {
        title: "Aplicativos Mobile Nativos",
        description: "Desenvolvimento de apps nativos para iOS e Android com React Native. Performance e experiência do usuário excepcionais.",
        category: "Mobile",
        technologies: ["React Native", "iOS", "Android"],
        image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
        price: 3500,
        imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
        featured: true,
        status: "active"
      },
      {
        title: "E-commerce Personalizado",
        description: "Lojas virtuais completas com carrinho, pagamentos, gestão de produtos e dashboard administrativo.",
        category: "E-commerce",
        technologies: ["React", "Stripe", "PayPal"],
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
        price: 4000,
        imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
        featured: true,
        status: "active"
      },
      {
        title: "Consultoria em Tecnologia",
        description: "Orientação técnica para projetos, arquitetura de software e escolha das melhores tecnologias para seu negócio.",
        category: "Consultoria",
        technologies: ["Arquitetura", "Planejamento", "Tecnologia"],
        image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
        price: 200,
        imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
        featured: false,
        status: "active"
      },
      {
        title: "Manutenção e Suporte",
        description: "Suporte técnico contínuo para suas aplicações, correções de bugs e implementação de melhorias.",
        category: "Suporte",
        technologies: ["Manutenção", "Debugging", "Otimização"],
        image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
        price: 150,
        imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
        featured: false,
        status: "active"
      },
      {
        title: "Integração de APIs",
        description: "Conecte suas aplicações com sistemas externos, pagamentos, notificações e muito mais.",
        category: "Desenvolvimento Web",
        technologies: ["REST API", "GraphQL", "Webhooks"],
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
        price: 800,
        imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
        featured: false,
        status: "active"
      }
    ];

    await db.insert(services).values(servicesData);
    console.log("✅ Serviços criados");

    // Criar projetos
    console.log("🚀 Criando projetos...");
    const projectsData: InsertProject[] = [
      {
        title: "E-commerce Responsivo",
        description: "Loja virtual completa com carrinho de compras, sistema de pagamento integrado e painel administrativo. Desenvolvida com React e Node.js.",
        category: "E-commerce",
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
        technologies: ["React", "Node.js", "PostgreSQL", "Stripe"],
        githubUrl: "https://github.com/seucodigo/ecommerce-project",
        liveUrl: "https://ecommerce-demo.seucodigo.com",
        featured: true,
        status: "active"
      },
      {
        title: "Aplicativo de Gestão Financeira",
        description: "App mobile para controle financeiro pessoal com gráficos, relatórios e sincronização na nuvem.",
        category: "Mobile",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
        technologies: ["React Native", "Firebase", "Chart.js"],
        githubUrl: "https://github.com/seucodigo/finance-app",
        liveUrl: "https://finance-app.seucodigo.com",
        featured: true,
        status: "active"
      },
      {
        title: "Portal Institucional",
        description: "Website institucional moderno com CMS personalizado, otimizado para SEO e totalmente responsivo.",
        category: "Desenvolvimento Web",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
        technologies: ["Next.js", "Tailwind CSS", "Prisma"],
        githubUrl: "https://github.com/seucodigo/institutional-site",
        liveUrl: "https://institutional.seucodigo.com",
        featured: true,
        status: "active"
      },
      {
        title: "Sistema de Reservas Online",
        description: "Plataforma completa para agendamento de serviços com calendário interativo e notificações automáticas.",
        category: "Desenvolvimento Web",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
        technologies: ["Vue.js", "Express", "MongoDB"],
        githubUrl: "https://github.com/seucodigo/booking-system",
        liveUrl: "https://booking.seucodigo.com",
        featured: false,
        status: "active"
      },
      {
        title: "App de Delivery",
        description: "Aplicativo de delivery com rastreamento em tempo real, sistema de pagamento e avaliações.",
        category: "Mobile",
        image: "https://images.unsplash.com/photo-1586816001966-79b736744398?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
        technologies: ["React Native", "Socket.io", "Redis"],
        githubUrl: "https://github.com/seucodigo/delivery-app",
        liveUrl: "https://delivery.seucodigo.com",
        featured: false,
        status: "active"
      },
      {
        title: "Dashboard Analytics",
        description: "Painel de controle com métricas em tempo real, gráficos interativos e relatórios customizáveis.",
        category: "Desenvolvimento Web",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
        technologies: ["React", "D3.js", "GraphQL"],
        githubUrl: "https://github.com/seucodigo/analytics-dashboard",
        liveUrl: "https://analytics.seucodigo.com",
        featured: false,
        status: "active"
      }
    ];

    await db.insert(projects).values(projectsData);
    console.log("✅ Projetos criados");

    // Criar depoimentos
    console.log("💬 Criando depoimentos...");
    const testimonialsData: InsertTestimonial[] = [
      {
        name: "Ricardo Oliveira",
        company: "CEO, TechSolutions",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=50&h=50",
        message: "Contratei o desenvolvimento do site da minha empresa e fiquei impressionado com a qualidade e agilidade do serviço. O resultado final superou todas as expectativas!",
        rating: 5
      },
      {
        name: "Ana Beatriz",
        company: "Proprietária, Moda&Estilo",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=50&h=50",
        message: "O desenvolvimento do nosso e-commerce foi executado com extremo profissionalismo. A plataforma é estável, rápida e muito fácil de administrar. Altamente recomendado!",
        rating: 5
      },
      {
        name: "Carlos Mendes",
        company: "Co-fundador, AppNova",
        avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=50&h=50",
        message: "O aplicativo que desenvolveram para nossa startup foi fundamental para nosso crescimento. A interface é intuitiva e os usuários adoram a experiência. O suporte pós-entrega também foi excelente.",
        rating: 4
      },
      {
        name: "Fernanda Costa",
        company: "Gerente, Distribuidora Express",
        avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=50&h=50",
        message: "Precisávamos de um sistema de gestão personalizado e o resultado foi perfeito. Atenderam todas as nossas necessidades específicas e o sistema é muito fácil de usar. Excelente custo-benefício!",
        rating: 5
      },
      {
        name: "Roberto Lima",
        company: "Diretor, Consultoria Empresarial",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=50&h=50",
        message: "A consultoria técnica que recebemos foi fundamental para definir a arquitetura do nosso produto. Conhecimento técnico sólido e orientações muito práticas. Recomendo sem hesitação!",
        rating: 5
      },
      {
        name: "Juliana Rodrigues",
        company: "Fundadora, EcoVerde",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=50&h=50",
        message: "O site institucional que criaram para nossa empresa de sustentabilidade ficou lindo e totalmente alinhado com nossos valores. A navegação é fluida e o design é moderno. Muito satisfeita!",
        rating: 5
      }
    ];

    await db.insert(testimonials).values(testimonialsData);
    console.log("✅ Depoimentos criados");

    // Criar configurações do site
    console.log("⚙️ Criando configurações do site...");
    const siteSettingsData: InsertSiteSettings = {
      siteName: "SeuCodigo",
      siteTitle: "Desenvolvimento Web & Aplicações Móveis",
      siteDescription: "Transformamos suas ideias em soluções digitais inovadoras. Especialistas em desenvolvimento web, aplicações móveis e consultoria em tecnologia.",
      contactEmail: "contato@seucodigo.com",
      contactPhone: "+55 11 99999-9999",
      socialMedia: {
        github: "https://github.com/seucodigo",
        linkedin: "https://linkedin.com/company/seucodigo",
        instagram: "https://instagram.com/seucodigo",
        twitter: "https://twitter.com/seucodigo"
      },
      themeColor: "#00ffff",
      logo: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100"
    };

    await db.insert(siteSettings).values(siteSettingsData);
    console.log("✅ Configurações do site criadas");

    // Criar métodos de pagamento
    console.log("💳 Criando métodos de pagamento...");
    const paymentMethodsData: InsertPaymentMethod[] = [
      {
        name: "PIX",
        provider: "pix",
        isActive: true,
        config: {
          pixKey: "contato@seucodigo.com",
          pixKeyType: "email",
          merchantName: "SeuCodigo Desenvolvimento",
          merchantCity: "São Paulo"
        }
      },
      {
        name: "Cartão de Crédito",
        provider: "stripe",
        isActive: true,
        config: {
          publishableKey: "pk_test_51234567890abcdef",
          webhookSecret: "whsec_test_123456"
        }
      }
    ];

    await db.insert(paymentMethods).values(paymentMethodsData);
    console.log("✅ Métodos de pagamento criados");

    console.log("🎉 Seed concluído com sucesso!");
    console.log("\n📊 Dados criados:");
    console.log("- 3 usuários (1 admin + 2 clientes)");
    console.log("- 6 serviços");
    console.log("- 6 projetos");
    console.log("- 6 depoimentos");
    console.log("- 1 configuração do site");
    console.log("- 2 métodos de pagamento");
    console.log("\n🔑 Credenciais de acesso:");
    console.log("Admin: admin / admin123");
    console.log("Cliente: cliente1 / cliente123");
    console.log("Cliente: cliente2 / cliente123");

  } catch (error) {
    console.error("❌ Erro durante o seed:", error);
    throw error;
  }
}

// Executar seed se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => {
      console.log("✅ Processo finalizado");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Falha no seed:", error);
      process.exit(1);
    });
}

export { seedDatabase };