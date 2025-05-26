import { hashPassword } from "../auth";
import { InsertUser, InsertProject, InsertService, InsertTestimonial, InsertSiteSettings } from "@shared/schema";

export const seedUsers: InsertUser[] = [
  {
    name: "Admin",
    username: "admin",
    email: "admin@seucodigo.com",
    password: "", // Será definido durante a execução
    role: "admin"
  },
  {
    name: "João Silva",
    username: "joao",
    email: "joao@exemplo.com",
    password: "", // Será definido durante a execução
    role: "user"
  }
];

export const seedProjects: InsertProject[] = [
  {
    title: "E-commerce Responsivo",
    description: "Plataforma completa de e-commerce com painel administrativo, gestão de produtos, sistema de pagamentos integrado e design responsivo para todas as telas.",
    category: "Web",
    technologies: ["React", "Node.js", "MongoDB", "Stripe"],
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
  },
  {
    title: "Sistema de Reservas Online",
    description: "Plataforma de reservas para restaurantes e eventos, com calendário integrado, notificações automáticas e painel de controle.",
    category: "Web",
    technologies: ["Vue.js", "Laravel", "PostgreSQL"],
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306",
    featured: false,
    order: 3
  },
  {
    title: "App de Delivery",
    description: "Aplicativo mobile para delivery de comida com rastreamento em tempo real, sistema de avaliações e integração com múltiplos restaurantes.",
    category: "Mobile",
    technologies: ["Flutter", "Firebase", "Google Maps API"],
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b",
    featured: true,
    order: 4
  },
  {
    title: "Dashboard Analytics",
    description: "Dashboard interativo para análise de dados empresariais com visualizações dinâmicas, relatórios automatizados e integração com APIs.",
    category: "Web",
    technologies: ["React", "D3.js", "Python", "FastAPI"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
    featured: false,
    order: 5
  }
];

export const seedServices: InsertService[] = [
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
  },
  {
    title: "Consultoria UX/UI",
    description: "Análise e otimização da experiência do usuário e interface, com testes de usabilidade, prototipagem e redesign orientado à conversão.",
    icon: "ri-layout-line",
    price: "3200.00",
    order: 5
  },
  {
    title: "Desenvolvimento Mobile",
    description: "Criação de aplicativos nativos e híbridos para Android e iOS, com integração de APIs, notificações push e publicação nas lojas.",
    icon: "ri-smartphone-line",
    price: "5500.00",
    order: 6
  },
  {
    title: "Manutenção e Suporte",
    description: "Serviços de manutenção contínua, atualizações de segurança, backup automático e suporte técnico especializado para seus projetos.",
    icon: "ri-tools-line",
    price: "800.00",
    order: 7
  },
  {
    title: "Integração de APIs",
    description: "Desenvolvimento e integração de APIs REST e GraphQL, conectando diferentes sistemas e plataformas de forma segura e eficiente.",
    icon: "ri-plug-line",
    price: "2200.00",
    order: 8
  }
];

export const seedTestimonials: InsertTestimonial[] = [
  {
    name: "Maria Silva",
    company: "Silva & Associados",
    position: "Diretora de Marketing",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b1c0",
    message: "O trabalho realizado superou todas as nossas expectativas. A equipe demonstrou profissionalismo excepcional e entregou um projeto que transformou nossa presença digital.",
    rating: 5,
    order: 0
  },
  {
    name: "Carlos Mendes",
    company: "TechStart",
    position: "CEO",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
    message: "Excelente qualidade de código e atenção aos detalhes. O projeto foi entregue no prazo e funcionou perfeitamente desde o primeiro dia. Recomendo fortemente!",
    rating: 5,
    order: 1
  },
  {
    name: "Ana Costa",
    company: "Boutique Fashion",
    position: "Proprietária",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    message: "Nossa loja online aumentou as vendas em 300% após o lançamento. O design é lindo e a funcionalidade é impecável. Estamos muito satisfeitos!",
    rating: 5,
    order: 2
  },
  {
    name: "Roberto Santos",
    company: "Consultoria Digital",
    position: "Diretor Técnico",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    message: "Parceria excepcional! A comunicação foi clara durante todo o processo e o resultado final superou nossas expectativas. Já estamos planejando novos projetos juntos.",
    rating: 5,
    order: 3
  },
  {
    name: "Luciana Ferreira",
    company: "Café & Cia",
    position: "Gerente",
    avatar: "https://images.unsplash.com/photo-1554151228-14d9def656e4",
    message: "O sistema de reservas desenvolvido revolucionou nosso atendimento. Agora conseguimos gerenciar melhor nossos clientes e aumentamos nossa eficiência operacional.",
    rating: 5,
    order: 4
  },
  {
    name: "Fernando Lima",
    company: "Imóveis Prime",
    position: "Corretor",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    message: "O portal imobiliário criado facilitou muito nossa vida. Os clientes conseguem encontrar imóveis facilmente e nós temos mais controle sobre os leads. Excelente trabalho!",
    rating: 5,
    order: 5
  }
];

export const seedSiteSettings: InsertSiteSettings = {
  siteName: "SeuCodigo",
  siteTitle: "Desenvolvedor Full Stack - Transformando Ideias em Realidade Digital",
  contactEmail: "contato@seucodigo.com",
  contactPhone: "(11) 99999-8888",
  address: "São Paulo, SP - Brasil",
  logo: "",
  github: "https://github.com/seuusuario",
  linkedin: "https://linkedin.com/in/seuusuario",
  twitter: "https://twitter.com/seuusuario",
  instagram: "https://instagram.com/seuusuario",
  whatsapp: "5511999998888"
};

// Função para gerar senhas hasheadas
export async function generateHashedPasswords() {
  const users = [...seedUsers];
  
  // Gerar senhas hasheadas
  users[0].password = await hashPassword("admin123"); // Admin
  users[1].password = await hashPassword("user123");  // João
  
  return users;
}