import { hashPassword } from "../auth";
import { InsertUser, InsertProject, InsertService, InsertTestimonial, InsertSiteSettings } from "@shared/schema";

export const seedUsers: InsertUser[] = [
  {
    name: "Admin",
    username: "admin",
    email: "admin@seucodigo.com",
    password: "admin123", // Será hasheado durante a execução
    role: "admin"
  },
  {
    name: "João Silva",
    username: "joao",
    email: "joao@exemplo.com",
    password: "user123", // Será hasheado durante a execução
    role: "user"
  },
  {
    name: "Maria Santos",
    username: "maria",
    email: "maria@exemplo.com",
    password: "user123", // Será hasheado durante a execução
    role: "user"
  }
];

export const seedProjects: InsertProject[] = [
  {
    title: "E-commerce Responsivo",
    description: "Plataforma completa de e-commerce com painel administrativo, gestão de produtos, sistema de pagamentos integrado e design responsivo para todas as telas.",
    category: "E-commerce",
    technologies: ["React", "Node.js", "MongoDB", "Stripe"],
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc",
    featured: true,
    order: 0,
    price: "2500.00",
    status: "completed"
  },
  {
    title: "Aplicativo de Gestão Financeira",
    description: "Aplicativo web para controle financeiro pessoal e empresarial, com gráficos em tempo real, exportação de relatórios e análises detalhadas.",
    category: "Mobile App",
    technologies: ["React Native", "Firebase", "ChartJS"],
    image: "https://images.unsplash.com/photo-1579170053380-58064b2dee67",
    featured: true,
    order: 1,
    price: "3000.00",
    status: "active"
  },
  {
    title: "Portal Institucional",
    description: "Portal completo para empresa do setor imobiliário, com integração de busca de imóveis, formulários de contato e área administrativa.",
    category: "Website",
    technologies: ["WordPress", "PHP", "MySQL"],
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab",
    featured: true,
    order: 2,
    price: "1800.00",
    status: "completed"
  },
  {
    title: "Sistema de Reservas Online",
    description: "Plataforma de reservas para restaurantes e eventos, com calendário integrado, notificações automáticas e painel de controle.",
    category: "Web App",
    technologies: ["Vue.js", "Laravel", "PostgreSQL"],
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306",
    featured: false,
    order: 3,
    price: "2200.00",
    status: "in_progress"
  },
  {
    title: "App de Delivery",
    description: "Aplicativo mobile para delivery de comida com rastreamento em tempo real, sistema de avaliações e integração com múltiplos restaurantes.",
    category: "Mobile App",
    technologies: ["Flutter", "Firebase", "Google Maps API"],
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b",
    featured: true,
    order: 4,
    price: "4000.00",
    status: "active"
  },
  {
    title: "Dashboard Analytics",
    description: "Dashboard interativo para análise de dados empresariais com visualizações dinâmicas, relatórios automatizados e integração com APIs.",
    category: "Web App",
    technologies: ["React", "D3.js", "Python", "FastAPI"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
    featured: false,
    order: 5,
    price: "3500.00",
    status: "completed"
  }
];

export const seedServices: InsertService[] = [
  {
    title: "Desenvolvimento Web Full-Stack",
    description: "Desenvolvimento completo de aplicações web utilizando tecnologias modernas como React, Node.js, e bancos de dados relacionais. Inclui design responsivo, otimização de performance e integração com APIs.",
    category: "Desenvolvimento Web",
    technologies: ["React", "Node.js", "TypeScript", "PostgreSQL", "MongoDB"],
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    featured: true,
    order: 0,
    price: "1500.00",
    status: "active"
  },
  {
    title: "Aplicativos Mobile Nativos",
    description: "Criação de aplicativos mobile para iOS e Android utilizando React Native ou Flutter. Inclui integração com APIs, notificações push e publicação nas lojas.",
    category: "Mobile",
    technologies: ["React Native", "Flutter", "Firebase", "API Integration"],
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c",
    featured: true,
    order: 1,
    price: "2000.00",
    status: "active"
  },
  {
    title: "E-commerce Personalizado",
    description: "Desenvolvimento de plataformas de e-commerce sob medida com sistema de pagamentos, gestão de estoque, painel administrativo e integrações com marketplaces.",
    category: "E-commerce",
    technologies: ["Shopify", "WooCommerce", "Stripe", "PayPal", "APIs"],
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d",
    featured: true,
    order: 2,
    price: "2500.00",
    status: "active"
  },
  {
    title: "Consultoria em Tecnologia",
    description: "Consultoria especializada em arquitetura de software, otimização de performance, migração de sistemas e implementação de melhores práticas de desenvolvimento.",
    category: "Consultoria",
    technologies: ["Architecture", "Performance", "Security", "DevOps"],
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40",
    featured: false,
    order: 3,
    price: "800.00",
    status: "active"
  },
  {
    title: "Manutenção e Suporte",
    description: "Serviços de manutenção contínua, atualizações de segurança, backup de dados e suporte técnico especializado para sistemas web e mobile.",
    category: "Suporte",
    technologies: ["Maintenance", "Security Updates", "Backup", "Monitoring"],
    image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e",
    featured: false,
    order: 4,
    price: "500.00",
    status: "active"
  },
  {
    title: "Integração de APIs",
    description: "Desenvolvimento e integração de APIs REST e GraphQL, conectando sistemas externos, automatizando processos e criando ecossistemas integrados.",
    category: "Integração",
    technologies: ["REST API", "GraphQL", "Webhooks", "Microservices"],
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31",
    featured: false,
    order: 5,
    price: "1200.00",
    status: "active"
  }
];

export const seedTestimonials: InsertTestimonial[] = [
  {
    name: "Carlos Eduardo",
    company: "TechStart Soluções",
    position: "CEO",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
    message: "Trabalho excepcional! O time do SeuCodigo desenvolveu nossa plataforma de e-commerce em tempo recorde, superando todas as expectativas. A qualidade do código e atenção aos detalhes são impressionantes.",
    rating: 5,
    order: 0
  },
  {
    name: "Ana Paula Rodrigues",
    company: "Marketing Digital Pro",
    position: "Diretora de Marketing",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b589",
    message: "O aplicativo mobile que desenvolveram para nossa empresa aumentou nosso engajamento em 300%. A interface é intuitiva e o desempenho é excelente. Recomendo fortemente!",
    rating: 5,
    order: 1
  },
  {
    name: "Roberto Silva",
    company: "Construtora Moderna",
    position: "Diretor Comercial",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    message: "Nossa nova plataforma de gestão imobiliária revolucionou nossos processos. A automação implementada nos economiza horas de trabalho diariamente. Profissionais extremamente competentes.",
    rating: 5,
    order: 2
  },
  {
    name: "Fernanda Costa",
    company: "Restaurante Sabor & Arte",
    position: "Proprietária",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    message: "O sistema de reservas online que criaram aumentou nossas reservas em 150%. É fácil de usar tanto para nós quanto para nossos clientes. Investimento que valeu muito a pena!",
    rating: 5,
    order: 3
  },
  {
    name: "Marcos Oliveira",
    company: "FinanceFlow",
    position: "CTO",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    message: "A consultoria técnica prestada foi fundamental para otimizar nossa arquitetura. Conseguimos reduzir custos de infraestrutura em 40% mantendo alta performance. Equipe muito experiente.",
    rating: 5,
    order: 4
  },
  {
    name: "Juliana Mendes",
    company: "EduTech Online",
    position: "Fundadora",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f",
    message: "Nosso dashboard de analytics ficou incrível! As visualizações de dados são claras e ajudam muito na tomada de decisões estratégicas. O suporte pós-entrega também é exemplar.",
    rating: 5,
    order: 5
  }
];

export const seedSiteSettings: InsertSiteSettings = {
  siteName: "SeuCodigo",
  siteTitle: "SeuCodigo - Desenvolvimento de Software Sob Medida",
  contactEmail: "contato@seucodigo.com",
  contactPhone: "+55 (11) 99999-9999",
  address: "São Paulo, SP - Brasil",
  logo: "https://images.unsplash.com/photo-1557804506-669a67965ba0",
  github: "https://github.com/seucodigo",
  linkedin: "https://linkedin.com/company/seucodigo",
  twitter: "https://twitter.com/seucodigo",
  instagram: "https://instagram.com/seucodigo",
  whatsapp: "+55 (11) 99999-9999"
};

export async function generateHashedPasswords() {
  for (const user of seedUsers) {
    user.password = await hashPassword(user.password);
  }
}