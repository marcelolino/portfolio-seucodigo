import { users, projects, services, testimonials, messages, contacts, siteSettings, orders, paymentMethods } from "@shared/schema";
import type { User, InsertUser, Project, InsertProject, Service, InsertService, Testimonial, InsertTestimonial, Message, InsertMessage, Contact, InsertContact, SiteSettings, InsertSiteSettings, Order, InsertOrder, PaymentMethod, InsertPaymentMethod } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";
import { hashPassword } from "./auth";
import createMemoryStore from "memorystore";

const PostgresSessionStore = connectPg(session);
const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined>;
  getUsers(): Promise<User[]>;
  
  // Projects
  getProject(id: number): Promise<Project | undefined>;
  getProjects(): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;
  
  // Services
  getService(id: number): Promise<Service | undefined>;
  getServices(): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: number, service: Partial<InsertService>): Promise<Service | undefined>;
  deleteService(id: number): Promise<boolean>;
  
  // Testimonials
  getTestimonial(id: number): Promise<Testimonial | undefined>;
  getTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  updateTestimonial(id: number, testimonial: Partial<InsertTestimonial>): Promise<Testimonial | undefined>;
  deleteTestimonial(id: number): Promise<boolean>;
  
  // Messages
  getMessage(id: number): Promise<Message | undefined>;
  getMessages(userId?: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  
  // Contacts
  getContact(id: number): Promise<Contact | undefined>;
  getContacts(): Promise<Contact[]>;
  createContact(contact: InsertContact): Promise<Contact>;
  
  // Orders
  getOrder(id: number): Promise<Order | undefined>;
  getOrders(): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: number, order: Partial<InsertOrder>): Promise<Order | undefined>;
  deleteOrder(id: number): Promise<boolean>;
  
  // Payment Methods
  getPaymentMethod(id: number): Promise<PaymentMethod | undefined>;
  getPaymentMethods(): Promise<PaymentMethod[]>;
  getPaymentMethodByProvider(provider: string): Promise<PaymentMethod | undefined>;
  createPaymentMethod(paymentMethod: InsertPaymentMethod): Promise<PaymentMethod>;
  updatePaymentMethod(id: number, paymentMethod: Partial<InsertPaymentMethod>): Promise<PaymentMethod | undefined>;
  deletePaymentMethod(id: number): Promise<boolean>;
  
  // Session store
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private projects: Map<number, Project>;
  private services: Map<number, Service>;
  private testimonials: Map<number, Testimonial>;
  private messages: Map<number, Message>;
  private contacts: Map<number, Contact>;
  
  private userIdCounter: number;
  private projectIdCounter: number;
  private serviceIdCounter: number;
  private testimonialIdCounter: number;
  private messageIdCounter: number;
  private contactIdCounter: number;
  
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.services = new Map();
    this.testimonials = new Map();
    this.messages = new Map();
    this.contacts = new Map();
    
    this.userIdCounter = 1;
    this.projectIdCounter = 1;
    this.serviceIdCounter = 1;
    this.testimonialIdCounter = 1;
    this.messageIdCounter = 1;
    this.contactIdCounter = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
    
    // Seed admin user
    this.createUser({
      username: "admin",
      password: "836a1c15ef1d7f91ca00d01eda029bca68bc44827880eddfce8b862d1891a66e082f717271b761881b7b3fdad7052da41c0d83340f9253e50d08b926566d5796.e45b687a544687772e3df978a162733c", // hashed "admin123" using scrypt
      name: "Admin",
      email: "admin@seucodigo.com",
      role: "admin"
    });
    
    // Seed services
    this.seedServices();
    
    // Seed projects
    this.seedProjects();
    
    // Seed testimonials
    this.seedTestimonials();
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const createdAt = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt,
      avatar: insertUser.avatar || null,
      role: insertUser.role || "user"
    };
    this.users.set(id, user);
    return user;
  }
  
  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Projects
  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.projectIdCounter++;
    const createdAt = new Date();
    const project: Project = { 
      ...insertProject, 
      id, 
      createdAt,
      imageUrl: insertProject.imageUrl || null,
      featured: insertProject.featured || null,
      order: insertProject.order || null,
      price: insertProject.price || null,
      status: insertProject.status || "active"
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: number, projectData: Partial<InsertProject>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;
    
    const updatedProject = { ...project, ...projectData };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: number): Promise<boolean> {
    return this.projects.delete(id);
  }

  // Services
  async getService(id: number): Promise<Service | undefined> {
    return this.services.get(id);
  }

  async getServices(): Promise<Service[]> {
    return Array.from(this.services.values());
  }

  async createService(insertService: InsertService): Promise<Service> {
    const id = this.serviceIdCounter++;
    const createdAt = new Date();
    const service: Service = { 
      ...insertService, 
      id, 
      createdAt,
      imageUrl: insertService.imageUrl || null,
      featured: insertService.featured || null,
      order: insertService.order || null,
      price: insertService.price || null,
      status: insertService.status || "active"
    };
    this.services.set(id, service);
    return service;
  }

  async updateService(id: number, serviceData: Partial<InsertService>): Promise<Service | undefined> {
    const service = this.services.get(id);
    if (!service) return undefined;
    
    const updatedService = { ...service, ...serviceData };
    this.services.set(id, updatedService);
    return updatedService;
  }

  async deleteService(id: number): Promise<boolean> {
    return this.services.delete(id);
  }

  // Testimonials
  async getTestimonial(id: number): Promise<Testimonial | undefined> {
    return this.testimonials.get(id);
  }

  async getTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values());
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const id = this.testimonialIdCounter++;
    const createdAt = new Date();
    const testimonial: Testimonial = { 
      ...insertTestimonial, 
      id, 
      createdAt,
      order: insertTestimonial.order || null,
      position: insertTestimonial.position || null
    };
    this.testimonials.set(id, testimonial);
    return testimonial;
  }

  async updateTestimonial(id: number, testimonialData: Partial<InsertTestimonial>): Promise<Testimonial | undefined> {
    const testimonial = this.testimonials.get(id);
    if (!testimonial) return undefined;
    
    const updatedTestimonial = { ...testimonial, ...testimonialData };
    this.testimonials.set(id, updatedTestimonial);
    return updatedTestimonial;
  }

  async deleteTestimonial(id: number): Promise<boolean> {
    return this.testimonials.delete(id);
  }

  // Messages
  async getMessage(id: number): Promise<Message | undefined> {
    return this.messages.get(id);
  }

  async getMessages(userId?: number): Promise<Message[]> {
    const allMessages = Array.from(this.messages.values());
    
    if (userId) {
      return allMessages.filter(message => message.userId === userId);
    }
    
    return allMessages;
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.messageIdCounter++;
    const createdAt = new Date();
    const message: Message = { 
      ...insertMessage, 
      id, 
      createdAt,
      userId: insertMessage.userId || null,
      receiverId: insertMessage.receiverId || null,
      isAdmin: insertMessage.isAdmin || false,
      isRead: insertMessage.isRead || null
    };
    this.messages.set(id, message);
    return message;
  }

  // Contacts
  async getContact(id: number): Promise<Contact | undefined> {
    return this.contacts.get(id);
  }

  async getContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values());
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = this.contactIdCounter++;
    const createdAt = new Date();
    const contact: Contact = { 
      ...insertContact, 
      id, 
      createdAt,
      isRead: insertContact.isRead || null
    };
    this.contacts.set(id, contact);
    return contact;
  }
  
  // Seed methods
  private seedServices() {
    const serviceData: InsertService[] = [
      {
        title: "Desenvolvimento Web",
        description: "Criação de sites e aplicações web responsivas e otimizadas para performance.",
        icon: "ri-code-s-slash-line"
      },
      {
        title: "Design Responsivo",
        description: "Interfaces que se adaptam perfeitamente a qualquer dispositivo e tamanho de tela.",
        icon: "ri-smartphone-line"
      },
      {
        title: "Desenvolvimento Backend",
        description: "Soluções robustas para o servidor, integrações com APIs e bancos de dados.",
        icon: "ri-database-2-line"
      },
      {
        title: "UI/UX Design",
        description: "Design de interfaces intuitivas e experiências de usuário otimizadas.",
        icon: "ri-palette-line"
      }
    ];
    
    serviceData.forEach(service => this.createService(service));
  }
  
  private seedProjects() {
    const projectData: InsertProject[] = [
      {
        title: "E-commerce Moderno",
        description: "Loja virtual completa com painel administrativo e integração com gateways de pagamento.",
        image: "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
        tags: ["React", "PHP", "MySQL"]
      },
      {
        title: "Dashboard Administrativo",
        description: "Painel de controle para gestão de dados com visualizações e relatórios em tempo real.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
        tags: ["React", "Node.js", "Chart.js"]
      },
      {
        title: "Aplicativo Mobile",
        description: "Aplicativo híbrido para iOS e Android com sincronização de dados e modo offline.",
        image: "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
        tags: ["React Native", "Firebase", "Redux"]
      },
      {
        title: "Site Corporativo",
        description: "Website institucional com blog integrado e área de carreiras para empresa de tecnologia.",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
        tags: ["WordPress", "PHP", "JavaScript"]
      },
      {
        title: "Plataforma de Cursos",
        description: "Ambiente de aprendizado online com vídeos, exercícios e certificados automáticos.",
        image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
        tags: ["React", "Laravel", "PostgreSQL"]
      },
      {
        title: "Rede Social de Nicho",
        description: "Plataforma de comunidade para entusiastas de tecnologia com fórum e eventos.",
        image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
        tags: ["Vue.js", "Node.js", "MongoDB"]
      }
    ];
    
    projectData.forEach(project => this.createProject(project));
  }
  
  private seedTestimonials() {
    const testimonialData: InsertTestimonial[] = [
      {
        name: "Ricardo Oliveira",
        company: "CEO, TechSolutions",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=50&h=50",
        content: "Contratei o desenvolvimento do site da minha empresa e fiquei impressionado com a qualidade e agilidade do serviço. O resultado final superou todas as expectativas!",
        rating: 5
      },
      {
        name: "Ana Beatriz",
        company: "Proprietária, Moda&Estilo",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=50&h=50",
        content: "O desenvolvimento do nosso e-commerce foi executado com extremo profissionalismo. A plataforma é estável, rápida e muito fácil de administrar. Altamente recomendado!",
        rating: 5
      },
      {
        name: "Carlos Mendes",
        company: "Co-fundador, AppNova",
        avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=50&h=50",
        content: "O aplicativo que desenvolveram para nossa startup foi fundamental para nosso crescimento. A interface é intuitiva e os usuários adoram a experiência. O suporte pós-entrega também foi excelente.",
        rating: 4
      },
      {
        name: "Fernanda Costa",
        company: "Gerente, Distribuidora Express",
        avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=50&h=50",
        content: "Precisávamos de um sistema de gestão personalizado e o resultado foi perfeito. Atenderam todas as nossas necessidades específicas e o sistema é muito fácil de usar. Excelente custo-benefício!",
        rating: 5
      }
    ];
    
    testimonialData.forEach(testimonial => this.createTestimonial(testimonial));
  }
}

// Usar o DatabaseStorage para banco de dados PostgreSQL
import { DatabaseStorage } from "./dbStorage";

// Use PostgreSQL database if available, otherwise fallback to memory storage
export const storage = process.env.DATABASE_URL ? new DatabaseStorage() : new MemStorage();
