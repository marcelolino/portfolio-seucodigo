import { User, InsertUser, Project, InsertProject, Service, InsertService, Testimonial, InsertTestimonial, Message, InsertMessage, Contact, InsertContact, SiteSettings, InsertSiteSettings, Order, InsertOrder, PaymentMethod, InsertPaymentMethod } from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";
import { users, projects, services, testimonials, messages, contacts, siteSettings, orders, paymentMethods } from "@shared/schema";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";
import { hashPassword } from "./auth";
import { IStorage } from "./storage";

const PostgresSessionStore = connectPg(session);

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;
  
  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      tableName: 'session',
      createTableIfMissing: true,
    });
  }
  
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values({
      ...insertUser,
      role: insertUser.role || "user"
    }).returning();
    return user;
  }
  
  async getUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const [updatedUser] = await db.update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    
    return updatedUser;
  }
  
  // Projects
  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }
  
  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects).orderBy(projects.order);
  }
  
  async createProject(insertProject: InsertProject): Promise<Project> {
    const [project] = await db.insert(projects).values(insertProject).returning();
    return project;
  }
  
  async updateProject(id: number, projectData: Partial<InsertProject>): Promise<Project | undefined> {
    const [updatedProject] = await db.update(projects)
      .set(projectData)
      .where(eq(projects.id, id))
      .returning();
    
    return updatedProject;
  }
  
  async deleteProject(id: number): Promise<boolean> {
    const result = await db.delete(projects).where(eq(projects.id, id));
    return true;
  }
  
  // Services
  async getService(id: number): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service;
  }
  
  async getServices(): Promise<Service[]> {
    return await db.select().from(services).orderBy(services.order);
  }
  
  async createService(insertService: InsertService): Promise<Service> {
    const [service] = await db.insert(services).values(insertService).returning();
    return service;
  }
  
  async updateService(id: number, serviceData: Partial<InsertService>): Promise<Service | undefined> {
    const [updatedService] = await db.update(services)
      .set(serviceData)
      .where(eq(services.id, id))
      .returning();
    
    return updatedService;
  }
  
  async deleteService(id: number): Promise<boolean> {
    const result = await db.delete(services).where(eq(services.id, id));
    return true;
  }
  
  // Testimonials
  async getTestimonial(id: number): Promise<Testimonial | undefined> {
    const [testimonial] = await db.select().from(testimonials).where(eq(testimonials.id, id));
    return testimonial;
  }
  
  async getTestimonials(): Promise<Testimonial[]> {
    try {
      return await db.select().from(testimonials).orderBy(testimonials.order);
    } catch (error) {
      console.error("Erro ao buscar depoimentos:", error);
      // Em caso de erro, retornamos um array vazio
      return [];
    }
  }
  
  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const [testimonial] = await db.insert(testimonials).values(insertTestimonial).returning();
    return testimonial;
  }
  
  async updateTestimonial(id: number, testimonialData: Partial<InsertTestimonial>): Promise<Testimonial | undefined> {
    const [updatedTestimonial] = await db.update(testimonials)
      .set(testimonialData)
      .where(eq(testimonials.id, id))
      .returning();
    
    return updatedTestimonial;
  }
  
  async deleteTestimonial(id: number): Promise<boolean> {
    const result = await db.delete(testimonials).where(eq(testimonials.id, id));
    return true;
  }
  
  // Messages
  async getMessage(id: number): Promise<Message | undefined> {
    const [message] = await db.select().from(messages).where(eq(messages.id, id));
    return message;
  }
  
  async getMessages(userId?: number): Promise<Message[]> {
    try {
      if (userId) {
        return await db.select()
          .from(messages)
          .where(eq(messages.userId, userId))
          .orderBy(messages.createdAt);
      }
      
      return await db.select()
        .from(messages)
        .orderBy(messages.createdAt);
    } catch (error) {
      console.error("Erro ao buscar mensagens:", error);
      // Em caso de erro, retornamos um array vazio
      return [];
    }
  }
  
  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    try {
      // Transformando as chaves para corresponder com a estrutura do banco
      const messageData = {
        user_id: insertMessage.userId,
        content: insertMessage.content,
        is_admin: insertMessage.isAdmin || false,
        read: false  // usando "read" em vez de "isRead"
      };
      
      const [message] = await db.insert(messages).values(messageData).returning();
      return message;
    } catch (error) {
      console.error("Erro ao criar mensagem:", error);
      throw error;
    }
  }
  
  // Contacts
  async getContact(id: number): Promise<Contact | undefined> {
    const [contact] = await db.select().from(contacts).where(eq(contacts.id, id));
    return contact;
  }
  
  async getContacts(): Promise<Contact[]> {
    return await db.select().from(contacts).orderBy(desc(contacts.createdAt));
  }
  
  async createContact(insertContact: InsertContact): Promise<Contact> {
    const [contact] = await db.insert(contacts).values({
      ...insertContact,
      isRead: false
    }).returning();
    return contact;
  }

  // Orders
  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async getOrders(): Promise<Order[]> {
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const [order] = await db.insert(orders).values({
      ...insertOrder,
      status: insertOrder.status || "pending",
      priority: insertOrder.priority || "medium"
    }).returning();
    return order;
  }

  async updateOrder(id: number, orderData: Partial<InsertOrder>): Promise<Order | undefined> {
    const [order] = await db.update(orders)
      .set({ ...orderData, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return order;
  }

  async deleteOrder(id: number): Promise<boolean> {
    const result = await db.delete(orders).where(eq(orders.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }
  
  // Site Settings
  async getSiteSettings(): Promise<SiteSettings | undefined> {
    try {
      const allSettings = await db.execute(sql`SELECT * FROM site_settings LIMIT 1`);
      return allSettings.rows[0] as SiteSettings;
    } catch (error) {
      console.error("Erro ao buscar configurações:", error);
      return undefined;
    }
  }
  
  async updateSiteSettings(settings: Partial<InsertSiteSettings>): Promise<SiteSettings> {
    try {
      const existingSettings = await this.getSiteSettings();
      
      if (existingSettings) {
        // Usar SQL direto para evitar problemas de schema
        const result = await db.execute(sql`
          UPDATE site_settings 
          SET 
            site_name = COALESCE(${settings.siteName}, site_name),
            site_title = COALESCE(${settings.siteTitle}, site_title),
            contact_email = COALESCE(${settings.contactEmail}, contact_email),
            contact_phone = COALESCE(${settings.contactPhone}, contact_phone),
            address = COALESCE(${settings.address}, address),
            logo = COALESCE(${settings.logo}, logo),
            github = COALESCE(${settings.github}, github),
            linkedin = COALESCE(${settings.linkedin}, linkedin),
            twitter = COALESCE(${settings.twitter}, twitter),
            instagram = COALESCE(${settings.instagram}, instagram),
            whatsapp = COALESCE(${settings.whatsapp}, whatsapp)
          WHERE id = ${existingSettings.id}
          RETURNING *
        `);
        
        return result.rows[0] as SiteSettings;
      } else {
        // Criar novas configurações usando SQL direto
        const result = await db.execute(sql`
          INSERT INTO site_settings (
            site_name, site_title, contact_email, contact_phone, address,
            logo, github, linkedin, twitter, instagram, whatsapp
          ) VALUES (
            ${settings.siteName || 'SeuCodigo'},
            ${settings.siteTitle || 'Desenvolvedor Full Stack'},
            ${settings.contactEmail || 'contato@seucodigo.com'},
            ${settings.contactPhone || '(11) 9999-8888'},
            ${settings.address || 'São Paulo, SP - Brasil'},
            ${settings.logo || ''},
            ${settings.github || ''},
            ${settings.linkedin || ''},
            ${settings.twitter || ''},
            ${settings.instagram || ''},
            ${settings.whatsapp || ''}
          )
          RETURNING *
        `);
        
        return result.rows[0] as SiteSettings;
      }
    } catch (error) {
      console.error("Erro ao atualizar configurações:", error);
      throw new Error("Erro ao atualizar configurações do site");
    }
  }
  
  // Seed initial data
  async seedInitialData(): Promise<void> {
    // Verifica se já existem dados
    const usersCount = await db.select({ count: db.fn.count() }).from(users);
    
    if (!usersCount[0] || usersCount[0].count === '0') {
      // Cria admin
      const adminPassword = await hashPassword('admin123');
      await this.createUser({
        name: "Admin",
        username: "admin",
        email: "admin@seucodigo.com",
        password: adminPassword,
        role: "admin"
      });
      
      // Cria serviços
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
        },
        {
          title: "Consultoria UX/UI",
          description: "Análise e otimização da experiência do usuário e interface, com testes de usabilidade, prototipagem e redesign orientado à conversão.",
          icon: "ri-layout-line",
          price: "3200.00",
          order: 5
        },
        {
          title: "Implatação de servidor",
          description: "Implatação de servidor ok",
          icon: "ri-server-line",
          price: "355.00",
          order: 0
        }
      ];
      
      for (const service of servicesData) {
        await this.createService(service);
      }
      
      // Cria projetos
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
        await this.createProject(project);
      }
      
      // Cria depoimentos
      const testimonialsData = [
        {
          name: "Maria Silva",
          company: "Silva & Associados",
          position: "Diretora de Marketing",
          avatar: "https://randomuser.me/api/portraits/women/44.jpg",
          content: "A equipe do SeuCodigo entregou nosso projeto antes do prazo e com qualidade excepcional. O processo foi transparente do início ao fim, e estamos extremamente satisfeitos com o resultado.",
          rating: 5,
          order: 0
        },
        {
          name: "João Oliveira",
          company: "Oliveira Tech",
          position: "CEO",
          avatar: "https://randomuser.me/api/portraits/men/32.jpg",
          content: "Após tentativas frustradas com outras empresas, finalmente encontramos uma solução que realmente funciona! O sistema desenvolvido pelo SeuCodigo aumentou nossa produtividade em 40%.",
          rating: 5,
          order: 1
        },
        {
          name: "Carlos Ferreira",
          company: "Ferreira Comércio",
          position: "Proprietário",
          avatar: "https://randomuser.me/api/portraits/men/59.jpg",
          content: "Nosso e-commerce cresceu 300% após a implementação das melhorias sugeridas pela equipe. Especialmente as otimizações de SEO e performance que fizeram toda a diferença.",
          rating: 5,
          order: 2
        },
        {
          name: "Ana Santos",
          company: "Santos Imóveis",
          position: "Gerente de Operações",
          avatar: "https://randomuser.me/api/portraits/women/68.jpg",
          content: "O atendimento consultivo fez toda diferença no nosso projeto. Eles não apenas implementaram o que pedimos, mas sugeriram melhorias que nem tínhamos considerado.",
          rating: 5,
          order: 3
        }
      ];
      
      for (const testimonial of testimonialsData) {
        await this.createTestimonial(testimonial);
      }
      
      // Cria configurações do site
      await this.updateSiteSettings({
        siteName: "João dev",
        siteTitle: "Portfólio & Serviços",
        contactEmail: "marcelo@seucodigo.com",
        contactPhone: "11999938744",
        address: "Rua 282, 45 - Cubatão, SP",
        github: "https://github.com/joaodev",
        linkedin: "https://linkedin.com/in/joaodev",
        twitter: "https://twitter.com/joaodev",
        instagram: "",
        whatsapp: "5511999999999"
      });
    }
  }

  // Payment Methods
  async getPaymentMethod(id: number): Promise<PaymentMethod | undefined> {
    const [paymentMethod] = await db.select().from(paymentMethods).where(eq(paymentMethods.id, id));
    return paymentMethod;
  }

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    return await db.select().from(paymentMethods).orderBy(paymentMethods.provider);
  }

  async getPaymentMethodByProvider(provider: string): Promise<PaymentMethod | undefined> {
    const [paymentMethod] = await db.select().from(paymentMethods).where(eq(paymentMethods.provider, provider));
    return paymentMethod;
  }

  async createPaymentMethod(insertPaymentMethod: InsertPaymentMethod): Promise<PaymentMethod> {
    const [paymentMethod] = await db.insert(paymentMethods).values(insertPaymentMethod).returning();
    return paymentMethod;
  }

  async updatePaymentMethod(id: number, paymentMethodData: Partial<InsertPaymentMethod>): Promise<PaymentMethod | undefined> {
    const [paymentMethod] = await db.update(paymentMethods)
      .set({ ...paymentMethodData, updatedAt: new Date() })
      .where(eq(paymentMethods.id, id))
      .returning();
    return paymentMethod;
  }

  async deletePaymentMethod(id: number): Promise<boolean> {
    const result = await db.delete(paymentMethods).where(eq(paymentMethods.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }
}