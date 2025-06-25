import { db, testConnection } from '../db-local.js';
import { hashPassword } from '../auth.js';
import * as schema from "../../shared/schema.js";

// Dados para seed
const seedData = {
  users: [
    {
      username: "admin",
      name: "Administrador",
      email: "admin@seucodigo.com",
      password: "admin123",
      role: "admin"
    },
    {
      username: "cliente1",
      name: "João Silva",
      email: "joao@email.com",
      password: "cliente123",
      role: "user"
    }
  ],
  
  projects: [
    {
      title: "E-commerce Responsivo",
      description: "Loja virtual completa com carrinho de compras, sistema de pagamento e painel administrativo. Desenvolvida com React e Node.js.",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
      technologies: ["React", "Node.js", "PostgreSQL", "Stripe"],
      price: "2500.00",
      category: "E-commerce",
      status: "completed"
    },
    {
      title: "Aplicativo de Gestão Financeira",
      description: "App mobile para controle de finanças pessoais com gráficos, relatórios e sincronização em nuvem.",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop",
      technologies: ["React Native", "Firebase", "Chart.js"],
      price: "3000.00",
      category: "Mobile",
      status: "completed"
    },
    {
      title: "Portal Institucional",
      description: "Website corporativo moderno com CMS integrado, blog e sistema de contato.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
      technologies: ["Next.js", "Tailwind CSS", "Strapi"],
      price: "1800.00",
      category: "Website",
      status: "completed"
    }
  ],

  services: [
    {
      title: "Desenvolvimento Web Full-Stack",
      description: "Criação de aplicações web completas, desde o frontend até o backend, com tecnologias modernas e escaláveis.",
      price: "150.00",
      category: "Web Development",
      technologies: ["React", "Node.js", "PostgreSQL"]
    },
    {
      title: "Aplicativos Mobile Nativos",
      description: "Desenvolvimento de apps para iOS e Android com performance nativa e experiência de usuário excepcional.",
      price: "200.00",
      category: "Mobile Development",
      technologies: ["React Native", "Flutter"]
    },
    {
      title: "E-commerce Personalizado",
      description: "Lojas virtuais sob medida com carrinho, pagamentos, estoque e painel administrativo completo.",
      price: "250.00",
      category: "E-commerce",
      technologies: ["React", "Stripe", "PostgreSQL"]
    }
  ],

  testimonials: [
    {
      name: "Carlos Eduardo",
      company: "TechStart",
      position: "CEO",
      message: "O trabalho realizado superou todas as expectativas. A equipe demonstrou excelência técnica e comprometimento total com o projeto.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Ana Paula Rodrigues",
      company: "InovaCorp",
      position: "Diretora",
      message: "Profissionalismo e qualidade excepcionais. O projeto foi entregue no prazo e funcionou perfeitamente desde o primeiro dia.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Roberto Silva",
      company: "DigitalBiz",
      position: "Fundador",
      message: "Impressionante atenção aos detalhes e capacidade de entender exatamente o que precisávamos. Recomendo sem hesitação.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    }
  ],

  siteSettings: {
    siteName: "SeuCodigo",
    siteTitle: "SeuCodigo - Desenvolvimento Web e Mobile",
    siteDescription: "Criamos soluções digitais inovadoras e personalizadas para seu negócio. Desenvolvimento web, mobile e consultoria em tecnologia.",
    contactEmail: "contato@seucodigo.com",
    contactPhone: "(11) 99999-9999",
    address: "São Paulo, SP - Brasil",
    socialMedia: {
      instagram: "https://instagram.com/seucodigo",
      linkedin: "https://linkedin.com/company/seucodigo",
      github: "https://github.com/seucodigo"
    },
    theme: "dark",
    primaryColor: "#00ff88",
    secondaryColor: "#0066cc"
  },

  paymentMethods: [
    {
      provider: "stripe",
      name: "Stripe",
      isActive: true,
      config: {
        publicKey: "pk_test_...",
        currency: "BRL"
      }
    },
    {
      provider: "pix",
      name: "PIX",
      isActive: true,
      config: {
        pixKey: "contato@seucodigo.com",
        bankName: "Banco do Brasil"
      }
    }
  ]
};

async function runMigration() {
  console.log("🚀 Iniciando migração para banco PostgreSQL local...");
  
  // Testar conexão primeiro
  console.log("🔌 Testando conexão com o banco...");
  const connectionOk = await testConnection();
  if (!connectionOk) {
    throw new Error("Falha na conexão com o banco de dados");
  }
  
  try {
    // Limpar tabelas existentes (ordem importante devido às foreign keys)
    console.log("🧹 Limpando dados existentes...");
    try {
      await db.delete(schema.messages);
      await db.delete(schema.contacts);
      await db.delete(schema.orders);
      await db.delete(schema.testimonials);
      await db.delete(schema.services);
      await db.delete(schema.projects);
      await db.delete(schema.paymentMethods);
      await db.delete(schema.siteSettings);
      await db.delete(schema.users);
      console.log("  ✅ Dados existentes removidos");
    } catch (cleanError) {
      console.log("  ℹ️ Algumas tabelas podem não existir ainda (normal na primeira execução)");
    }

    // Inserir usuários com senhas hasheadas
    console.log("👥 Inserindo usuários...");
    for (const userData of seedData.users) {
      const hashedPassword = await hashPassword(userData.password);
      await db.insert(schema.users).values({
        ...userData,
        password: hashedPassword,
        avatar: null,
        createdAt: new Date()
      });
      console.log(`  ✅ Usuário ${userData.name} inserido`);
    }

    // Inserir projetos
    console.log("📁 Inserindo projetos...");
    for (const project of seedData.projects) {
      await db.insert(schema.projects).values({
        ...project,
        imageUrl: null,
        featured: null,
        order: null,
        createdAt: new Date()
      });
      console.log(`  ✅ Projeto ${project.title} inserido`);
    }

    // Inserir serviços
    console.log("⚙️ Inserindo serviços...");
    for (const service of seedData.services) {
      await db.insert(schema.services).values({
        ...service,
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
        imageUrl: null,
        featured: null,
        order: null,
        status: "active",
        createdAt: new Date()
      });
      console.log(`  ✅ Serviço ${service.title} inserido`);
    }

    // Inserir depoimentos
    console.log("💬 Inserindo depoimentos...");
    for (const testimonial of seedData.testimonials) {
      await db.insert(schema.testimonials).values({
        ...testimonial,
        order: null,
        createdAt: new Date()
      });
      console.log(`  ✅ Depoimento de ${testimonial.name} inserido`);
    }

    // Inserir configurações do site
    console.log("⚙️ Inserindo configurações do site...");
    await db.insert(schema.siteSettings).values({
      siteName: seedData.siteSettings.siteName,
      siteTitle: seedData.siteSettings.siteTitle,
      siteDescription: seedData.siteSettings.siteDescription,
      contactEmail: seedData.siteSettings.contactEmail,
      contactPhone: seedData.siteSettings.contactPhone,
      address: seedData.siteSettings.address,
      socialMedia: JSON.stringify(seedData.siteSettings.socialMedia),
      theme: seedData.siteSettings.theme,
      primaryColor: seedData.siteSettings.primaryColor,
      secondaryColor: seedData.siteSettings.secondaryColor,
      createdAt: new Date()
    });
    console.log("  ✅ Configurações inseridas");

    // Inserir métodos de pagamento
    console.log("💳 Inserindo métodos de pagamento...");
    for (const payment of seedData.paymentMethods) {
      await db.insert(schema.paymentMethods).values({
        provider: payment.provider,
        name: payment.name,
        isActive: payment.isActive,
        config: JSON.stringify(payment.config),
        createdAt: new Date()
      });
      console.log(`  ✅ Método ${payment.name} inserido`);
    }

    console.log("🎉 Migração concluída com sucesso!");
    
    // Estatísticas
    const stats = {
      users: seedData.users.length,
      projects: seedData.projects.length,
      services: seedData.services.length,
      testimonials: seedData.testimonials.length,
      paymentMethods: seedData.paymentMethods.length
    };
    
    console.log("\n📊 Estatísticas da migração:");
    Object.entries(stats).forEach(([key, value]) => {
      console.log(`  ${key}: ${value}`);
    });

  } catch (error) {
    console.error("❌ Erro durante a migração:", error);
    throw error;
  }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigration()
    .then(() => {
      console.log("✅ Processo finalizado");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Falha na migração:", error);
      process.exit(1);
    });
}

export { runMigration, seedData };