import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "../../shared/schema.js";
import { hashPassword } from '../auth.js';

// Configurar WebSocket para Neon
neonConfig.webSocketConstructor = ws;

// URL do banco PostgreSQL fornecida
const DATABASE_URL = "postgresql://neondb_owner:npg_8SC0GMqKxEUy@ep-shiny-mode-a55x91xd.us-east-2.aws.neon.tech/neondb?sslmode=require";

const pool = new Pool({ connectionString: DATABASE_URL });
const db = drizzle({ client: pool, schema });

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
    },
    {
      username: "cliente2",
      name: "Maria Santos",
      email: "maria@email.com",
      password: "cliente123",
      role: "user"
    }
  ],
  
  projects: [
    {
      title: "E-commerce Responsivo",
      description: "Loja virtual completa com carrinho de compras, sistema de pagamento e painel administrativo. Desenvolvida com React e Node.js.",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
      tags: ["React", "Node.js", "PostgreSQL", "Stripe"],
      price: "2500.00",
      category: "E-commerce",
      status: "completed",
      demoUrl: "https://demo-ecommerce.com",
      repositoryUrl: "https://github.com/seucodigo/ecommerce"
    },
    {
      title: "Aplicativo de Gestão Financeira",
      description: "App mobile para controle de finanças pessoais com gráficos, relatórios e sincronização em nuvem.",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop",
      tags: ["React Native", "Firebase", "Chart.js"],
      price: "3000.00",
      category: "Mobile",
      status: "completed",
      demoUrl: "https://demo-financeiro.com"
    },
    {
      title: "Portal Institucional",
      description: "Website corporativo moderno com CMS integrado, blog e sistema de contato.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
      tags: ["Next.js", "Tailwind CSS", "Strapi"],
      price: "1800.00",
      category: "Website",
      status: "completed",
      demoUrl: "https://demo-portal.com"
    },
    {
      title: "Sistema de Reservas Online",
      description: "Plataforma para agendamento de serviços com calendario integrado e notificações automáticas.",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop",
      tags: ["Vue.js", "Express", "MongoDB"],
      price: "2200.00",
      category: "Sistema",
      status: "in-progress"
    },
    {
      title: "App de Delivery",
      description: "Aplicativo completo para delivery com rastreamento em tempo real e sistema de pagamento.",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop",
      tags: ["Flutter", "Firebase", "Google Maps"],
      price: "4000.00",
      category: "Mobile",
      status: "planning"
    },
    {
      title: "Dashboard Analytics",
      description: "Painel de controle com métricas em tempo real, relatórios customizáveis e integração com APIs.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
      tags: ["React", "D3.js", "Python", "FastAPI"],
      price: "3500.00",
      category: "Dashboard",
      status: "completed"
    }
  ],

  services: [
    {
      title: "Desenvolvimento Web Full-Stack",
      description: "Criação de aplicações web completas, desde o frontend até o backend, com tecnologias modernas e escaláveis.",
      price: "150.00",
      category: "Web Development",
      features: ["Frontend React/Vue", "Backend Node.js/Python", "Banco de dados", "Deploy e hospedagem"],
      duration: "2-8 semanas"
    },
    {
      title: "Aplicativos Mobile Nativos",
      description: "Desenvolvimento de apps para iOS e Android com performance nativa e experiência de usuário excepcional.",
      price: "200.00",
      category: "Mobile Development",
      features: ["React Native/Flutter", "Integração com APIs", "App Store Deploy", "Push Notifications"],
      duration: "3-10 semanas"
    },
    {
      title: "E-commerce Personalizado",
      description: "Lojas virtuais sob medida com carrinho, pagamentos, estoque e painel administrativo completo.",
      price: "250.00",
      category: "E-commerce",
      features: ["Carrinho de compras", "Gateway de pagamento", "Gestão de estoque", "SEO otimizado"],
      duration: "4-12 semanas"
    },
    {
      title: "Consultoria em Tecnologia",
      description: "Análise técnica, arquitetura de sistemas e consultoria estratégica para projetos digitais.",
      price: "120.00",
      category: "Consultoria",
      features: ["Análise técnica", "Arquitetura de sistemas", "Code Review", "Documentação"],
      duration: "1-4 semanas"
    },
    {
      title: "Manutenção e Suporte",
      description: "Suporte técnico contínuo, atualizações de segurança e melhorias em sistemas existentes.",
      price: "80.00",
      category: "Suporte",
      features: ["Monitoramento 24/7", "Atualizações de segurança", "Backup automático", "Suporte técnico"],
      duration: "Mensal"
    },
    {
      title: "Integração de APIs",
      description: "Conexão entre sistemas diferentes através de APIs REST, GraphQL e webhooks.",
      price: "100.00",
      category: "Integração",
      features: ["APIs REST/GraphQL", "Webhooks", "Autenticação", "Documentação"],
      duration: "1-3 semanas"
    }
  ],

  testimonials: [
    {
      name: "Carlos Eduardo",
      company: "CEO, TechStart",
      content: "O trabalho realizado superou todas as expectativas. A equipe demonstrou excelência técnica e comprometimento total com o projeto.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Ana Paula Rodrigues",
      company: "Diretora, InovaCorp",
      content: "Profissionalismo e qualidade excepcionais. O projeto foi entregue no prazo e funcionou perfeitamente desde o primeiro dia.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Roberto Silva",
      company: "Fundador, DigitalBiz",
      content: "Impressionante atenção aos detalhes e capacidade de entender exatamente o que precisávamos. Recomendo sem hesitação.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Fernanda Costa",
      company: "Gerente de TI, ModernaTech",
      content: "A solução desenvolvida transformou nossos processos internos. A qualidade do código é excepcional e a documentação impecável.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Marcos Oliveira",
      company: "CTO, StartupX",
      content: "Parceria estratégica que resultou em um produto incrível. A comunicação foi clara e o suporte pós-entrega é exemplar.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Juliana Mendes",
      company: "Proprietária, EcommercePlus",
      content: "Minha loja online nunca funcionou tão bem! As vendas aumentaram 300% após o novo sistema. Investimento que valeu cada centavo.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face"
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
  console.log("🚀 Iniciando migração para banco Neon PostgreSQL...");
  
  try {
    // Limpar tabelas existentes
    console.log("🧹 Limpando tabelas...");
    await db.delete(schema.messages);
    await db.delete(schema.contacts);
    await db.delete(schema.orders);
    await db.delete(schema.testimonials);
    await db.delete(schema.services);
    await db.delete(schema.projects);
    await db.delete(schema.paymentMethods);
    await db.delete(schema.siteSettings);
    await db.delete(schema.users);

    // Inserir usuários com senhas hasheadas
    console.log("👥 Inserindo usuários...");
    for (const userData of seedData.users) {
      const hashedPassword = await hashPassword(userData.password);
      const user = await db.insert(schema.users).values({
        ...userData,
        password: hashedPassword,
        createdAt: new Date()
      }).returning();
      console.log(`  ✅ Usuário ${userData.name} inserido`);
    }

    // Inserir projetos
    console.log("📁 Inserindo projetos...");
    for (const project of seedData.projects) {
      await db.insert(schema.projects).values({
        ...project,
        createdAt: new Date()
      });
      console.log(`  ✅ Projeto ${project.title} inserido`);
    }

    // Inserir serviços
    console.log("⚙️ Inserindo serviços...");
    for (const service of seedData.services) {
      await db.insert(schema.services).values({
        ...service,
        createdAt: new Date()
      });
      console.log(`  ✅ Serviço ${service.title} inserido`);
    }

    // Inserir depoimentos
    console.log("💬 Inserindo depoimentos...");
    for (const testimonial of seedData.testimonials) {
      await db.insert(schema.testimonials).values({
        ...testimonial,
        createdAt: new Date()
      });
      console.log(`  ✅ Depoimento de ${testimonial.name} inserido`);
    }

    // Inserir configurações do site
    console.log("⚙️ Inserindo configurações do site...");
    await db.insert(schema.siteSettings).values({
      ...seedData.siteSettings,
      createdAt: new Date()
    });
    console.log("  ✅ Configurações inseridas");

    // Inserir métodos de pagamento
    console.log("💳 Inserindo métodos de pagamento...");
    for (const payment of seedData.paymentMethods) {
      await db.insert(schema.paymentMethods).values({
        ...payment,
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
  } finally {
    await pool.end();
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