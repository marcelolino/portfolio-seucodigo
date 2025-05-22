import { db } from './db';
import { users, projects, services, testimonials, siteSettings } from '@shared/schema';
import { hashPassword } from './auth';

async function seedData() {
  console.log('🌱 Iniciando seed de dados...');

  try {
    // Verificar e criar administrador
    const existingUsers = await db.select().from(users);
    
    if (existingUsers.length === 0) {
      console.log('👤 Criando usuário administrador...');
      const adminPassword = await hashPassword('admin123');
      await db.insert(users).values({
        name: "Admin",
        username: "admin",
        email: "admin@seucodigo.com",
        password: adminPassword,
        role: "admin"
      });
      console.log('✅ Administrador criado com sucesso');
    }

    // Verificar e criar serviços
    const existingServices = await db.select().from(services);
    
    if (existingServices.length === 0) {
      console.log('🔧 Criando serviços...');
      
      const servicesData = [
        {
          title: "Desenvolvimento Web",
          description: "Criação de websites e aplicações web modernas, otimizadas para SEO e com alta performance, utilizando as tecnologias mais avançadas do mercado.",
          icon: "ri-code-line",
          price: "4500.00",
          order: 1
        },
        {
          title: "Design Responsivo",
          description: "Desenvolvimento de sites e aplicativos que se adaptam a qualquer dispositivo, garantindo a melhor experiência para seus usuários em smartphones, tablets e desktops.",
          icon: "ri-smartphone-line",
          price: "2500.00",
          order: 2
        },
        {
          title: "E-commerce",
          description: "Implementação de lojas virtuais completas com gestão de produtos, integração de pagamentos, controle de estoque e relatórios detalhados de vendas.",
          icon: "ri-shopping-cart-line",
          price: "6000.00",
          order: 3
        },
        {
          title: "Marketing Digital",
          description: "Estratégias completas de marketing digital, incluindo SEO, gerenciamento de redes sociais, campanhas de anúncios e email marketing.",
          icon: "ri-line-chart-line",
          price: "1800.00",
          order: 4
        }
      ];
      
      for (const service of servicesData) {
        await db.insert(services).values(service);
      }
      console.log('✅ Serviços criados com sucesso');
    }

    // Verificar e criar projetos
    const existingProjects = await db.select().from(projects);
    
    if (existingProjects.length === 0) {
      console.log('📁 Criando projetos...');
      
      const projectsData = [
        {
          title: "E-commerce Responsivo",
          description: "Desenvolvimento de uma plataforma completa de e-commerce com design responsivo, integração de pagamentos, gerenciamento de estoque e painel administrativo.",
          category: "Web",
          technologies: ["React", "Node.js", "MongoDB"],
          image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc",
          featured: true,
          order: 0
        },
        {
          title: "Aplicativo de Gestão Financeira",
          description: "Aplicativo web para controle financeiro pessoal e empresarial, com gráficos em tempo real, exportação de relatórios e análises detalhadas.",
          category: "Mobile",
          technologies: ["React Native", "Firebase", "ChartJS"],
          image: "https://images.unsplash.com/photo-1579170053380-58064b2dee67",
          featured: true,
          order: 1
        },
        {
          title: "Portal Institucional",
          description: "Portal completo para empresa do setor imobiliário, com integração de busca de imóveis, formulários de contato e área administrativa.",
          category: "Web",
          technologies: ["WordPress", "PHP", "MySQL"],
          image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab",
          featured: true,
          order: 2
        }
      ];
      
      for (const project of projectsData) {
        await db.insert(projects).values(project);
      }
      console.log('✅ Projetos criados com sucesso');
    }

    // Verificar e criar depoimentos
    const existingTestimonials = await db.select().from(testimonials);
    
    if (existingTestimonials.length === 0) {
      console.log('💬 Criando depoimentos...');
      
      const testimonialsData = [
        {
          name: "Maria Silva",
          company: "Silva & Associados",
          position: "Diretora de Marketing",
          avatar: "https://randomuser.me/api/portraits/women/44.jpg",
          message: "A equipe do SeuCodigo entregou nosso projeto antes do prazo e com qualidade excepcional. O processo foi transparente do início ao fim, e estamos extremamente satisfeitos com o resultado.",
          rating: 5,
          order: 0
        },
        {
          name: "João Oliveira",
          company: "Oliveira Tech",
          position: "CEO",
          avatar: "https://randomuser.me/api/portraits/men/32.jpg",
          message: "Após tentativas frustradas com outras empresas, finalmente encontramos uma solução que realmente funciona! O sistema desenvolvido pelo SeuCodigo aumentou nossa produtividade em 40%.",
          rating: 5,
          order: 1
        },
        {
          name: "Carlos Ferreira",
          company: "Ferreira Comércio",
          position: "Proprietário",
          avatar: "https://randomuser.me/api/portraits/men/59.jpg",
          message: "Nosso e-commerce cresceu 300% após a implementação das melhorias sugeridas pela equipe. Especialmente as otimizações de SEO e performance que fizeram toda a diferença.",
          rating: 5,
          order: 2
        }
      ];
      
      for (const testimonial of testimonialsData) {
        await db.insert(testimonials).values(testimonial);
      }
      console.log('✅ Depoimentos criados com sucesso');
    }

    // Verificar e criar configurações do site
    const existingSettings = await db.select().from(siteSettings);
    
    if (existingSettings.length === 0) {
      console.log('⚙️ Criando configurações do site...');
      
      await db.insert(siteSettings).values({
        siteName: "SeuCodigo",
        siteTitle: "Soluções em desenvolvimento web e mobile para elevar seu negócio ao próximo nível.",
        contactEmail: "contato@seucodigo.com",
        contactPhone: "(11) 9999-8888",
        address: "Av. Paulista, 1000, São Paulo - SP",
        github: "https://github.com/seucodigo",
        linkedin: "https://linkedin.com/in/seucodigo",
        twitter: "https://twitter.com/seucodigo",
        instagram: "https://instagram.com/seucodigo",
        whatsapp: "5511999999999"
      });
      console.log('✅ Configurações do site criadas com sucesso');
    }

    console.log('✅ Seed concluído com sucesso!');
  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
    throw error;
  }
}

seedData().catch(console.error);