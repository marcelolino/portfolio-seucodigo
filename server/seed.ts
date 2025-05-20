import { storage } from "./storage";
import { hashPassword } from "./auth";

async function seed() {
  console.log("🌱 Iniciando seed de dados...");

  // Criar projetos
  const projects = [
    {
      title: "E-commerce Responsivo",
      description: "Desenvolvimento de uma plataforma completa de e-commerce com design responsivo, integração de pagamentos e painel administrativo personalizado.",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      category: "E-commerce",
      technologies: ["React", "Node.js", "PostgreSQL"],
      featured: true,
      order: 1
    },
    {
      title: "Aplicativo de Gestão Financeira",
      description: "Aplicativo web para controle financeiro pessoal e empresarial, com gráficos em tempo real, exportação de relatórios e categorização automática de despesas.",
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      category: "Aplicativo Web",
      technologies: ["React", "MongoDB", "Express"],
      featured: true,
      order: 2
    },
    {
      title: "Portal Institucional",
      description: "Portal completo para empresa do setor imobiliário, com integração de busca de imóveis, formulários de contato e área de cliente.",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      category: "Website",
      technologies: ["HTML", "CSS", "JavaScript", "WordPress"],
      featured: true,
      order: 3
    },
    {
      title: "Sistema de Agendamento Online",
      description: "Plataforma para agendamento de consultas médicas com integração de calendário, notificações por email e SMS, e painel administrativo.",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      category: "Aplicativo Web",
      technologies: ["Vue.js", "Node.js", "PostgreSQL"],
      featured: false,
      order: 4
    },
    {
      title: "Marketplace de Cursos",
      description: "Plataforma de venda e distribuição de cursos online com sistema de matrícula, área do aluno e certificação digital.",
      image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      category: "E-learning",
      technologies: ["React", "Firebase", "Node.js"],
      featured: false,
      order: 5
    }
  ];

  for (const projectData of projects) {
    try {
      await storage.createProject(projectData);
      console.log(`✅ Projeto criado: ${projectData.title}`);
    } catch (error) {
      console.error(`❌ Erro ao criar projeto: ${projectData.title}`, error);
    }
  }

  // Criar serviços
  const services = [
    {
      title: "Design Responsivo",
      description: "Desenvolvimento de sites e aplicativos que se adaptam a qualquer dispositivo, garantindo a melhor experiência para seus usuários em smartphones, tablets e desktops.",
      icon: "smartphone",
      price: "2500.00",
      order: 1
    },
    {
      title: "Desenvolvimento Web",
      description: "Criação de websites e aplicações web modernas, otimizadas para SEO e com alta performance, utilizando as tecnologias mais avançadas do mercado.",
      icon: "code",
      price: "4500.00",
      order: 2
    },
    {
      title: "E-commerce",
      description: "Implementação de lojas virtuais completas com gestão de produtos, integração de pagamentos, controle de estoque e relatórios detalhados de vendas.",
      icon: "shopping-cart",
      price: "6000.00",
      order: 3
    },
    {
      title: "Marketing Digital",
      description: "Estratégias completas de marketing digital, incluindo SEO, gerenciamento de redes sociais, campanhas de anúncios e email marketing.",
      icon: "trending-up",
      price: "1800.00",
      order: 4
    },
    {
      title: "Consultoria UX/UI",
      description: "Análise e otimização da experiência do usuário e interface, com testes de usabilidade, prototipagem e redesign orientado a conversão.",
      icon: "palette",
      price: "3200.00",
      order: 5
    },
    {
      title: "Hospedagem e Suporte",
      description: "Serviços de hospedagem gerenciada em servidores de alta performance, monitoramento 24/7, backups automáticos e suporte técnico especializado.",
      icon: "server",
      price: "120.00",
      order: 6
    }
  ];

  for (const serviceData of services) {
    try {
      await storage.createService(serviceData);
      console.log(`✅ Serviço criado: ${serviceData.title}`);
    } catch (error) {
      console.error(`❌ Erro ao criar serviço: ${serviceData.title}`, error);
    }
  }

  // Criar depoimentos
  const testimonials = [
    {
      name: "Maria Silva",
      company: "Silva & Associados",
      position: "Diretora de Marketing",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      content: "A equipe do SeuCodigo entregou nosso projeto antes do prazo e com qualidade excepcional. O processo foi transparente do início ao fim, e estamos extremamente satisfeitos com o resultado.",
      rating: 5,
      order: 1
    },
    {
      name: "João Oliveira",
      company: "Oliveira Tech",
      position: "CEO",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg",
      content: "Após tentativas frustradas com outras empresas, finalmente encontramos uma solução que realmente funciona! O sistema desenvolvido pelo SeuCodigo aumentou nossa produtividade em 40%.",
      rating: 5,
      order: 2
    },
    {
      name: "Ana Santos",
      company: "Santos Imóveis",
      position: "Gerente de Operações",
      avatar: "https://randomuser.me/api/portraits/women/3.jpg",
      content: "O atendimento consultivo fez toda diferença no nosso projeto. Eles não apenas implementaram o que pedimos, mas sugeriram melhorias que nem tínhamos considerado.",
      rating: 4,
      order: 3
    },
    {
      name: "Carlos Ferreira",
      company: "Ferreira Comércio",
      position: "Proprietário",
      avatar: "https://randomuser.me/api/portraits/men/4.jpg",
      content: "Nosso e-commerce cresceu 300% após a implementação das melhorias sugeridas pela equipe. Especialmente as otimizações de SEO e performance que fizeram toda a diferença.",
      rating: 5,
      order: 4
    },
    {
      name: "Luciana Mendes",
      company: "Mendes Consultoria",
      position: "Consultora Sênior",
      avatar: "https://randomuser.me/api/portraits/women/5.jpg",
      content: "A manutenção mensal tem sido essencial para manter nosso site sempre atualizado e seguro. O suporte é rápido e as atualizações são implementadas sem interromper nossos serviços.",
      rating: 4,
      order: 5
    }
  ];

  for (const testimonialData of testimonials) {
    try {
      await storage.createTestimonial(testimonialData);
      console.log(`✅ Depoimento criado: ${testimonialData.name}`);
    } catch (error) {
      console.error(`❌ Erro ao criar depoimento: ${testimonialData.name}`, error);
    }
  }

  console.log("✅ Seed de dados concluído com sucesso!");
}

export { seed };