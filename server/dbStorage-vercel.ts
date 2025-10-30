import { User, InsertUser, Project, InsertProject, Service, InsertService, Testimonial, InsertTestimonial, Message, InsertMessage, Contact, InsertContact, SiteSettings, InsertSiteSettings, Order, InsertOrder, PaymentMethod, InsertPaymentMethod } from "@shared/schema";
import { db } from "./db-vercel";
import { eq, desc, sql as drizzleSql } from "drizzle-orm";
import { users, projects, services, testimonials, messages, contacts, siteSettings, orders, paymentMethods } from "@shared/schema";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { Pool } from '@neondatabase/serverless';
import { hashPassword } from "./auth";
import { IStorage } from "./storage";

const PostgresSessionStore = connectPg(session);

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export class DatabaseStorageVercel implements IStorage {
  sessionStore: session.Store;
  
  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool: pool as any,
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
    await db.delete(projects).where(eq(projects.id, id));
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
    await db.delete(services).where(eq(services.id, id));
    return true;
  }
  
  // Testimonials
  async getTestimonial(id: number): Promise<Testimonial | undefined> {
    const [testimonial] = await db.select().from(testimonials).where(eq(testimonials.id, id));
    return testimonial;
  }
  
  async getTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials).orderBy(testimonials.order);
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
    await db.delete(testimonials).where(eq(testimonials.id, id));
    return true;
  }
  
  // Messages
  async getMessage(id: number): Promise<Message | undefined> {
    const [message] = await db.select().from(messages).where(eq(messages.id, id));
    return message;
  }
  
  async getMessages(userId?: number): Promise<Message[]> {
    if (userId) {
      return await db.select().from(messages).where(eq(messages.userId, userId)).orderBy(desc(messages.createdAt));
    }
    return await db.select().from(messages).orderBy(desc(messages.createdAt));
  }
  
  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db.insert(messages).values(insertMessage).returning();
    return message;
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
    const [contact] = await db.insert(contacts).values(insertContact).returning();
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
    const [order] = await db.insert(orders).values(insertOrder).returning();
    return order;
  }

  async updateOrder(id: number, orderData: Partial<InsertOrder>): Promise<Order | undefined> {
    const [updatedOrder] = await db.update(orders)
      .set(orderData)
      .where(eq(orders.id, id))
      .returning();
    
    return updatedOrder;
  }

  async deleteOrder(id: number): Promise<boolean> {
    await db.delete(orders).where(eq(orders.id, id));
    return true;
  }

  // Payment Methods
  async getPaymentMethod(id: number): Promise<PaymentMethod | undefined> {
    const [paymentMethod] = await db.select().from(paymentMethods).where(eq(paymentMethods.id, id));
    return paymentMethod;
  }

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    return await db.select().from(paymentMethods).orderBy(paymentMethods.id);
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
    const [updatedPaymentMethod] = await db.update(paymentMethods)
      .set(paymentMethodData)
      .where(eq(paymentMethods.id, id))
      .returning();
    
    return updatedPaymentMethod;
  }

  async deletePaymentMethod(id: number): Promise<boolean> {
    await db.delete(paymentMethods).where(eq(paymentMethods.id, id));
    return true;
  }
}
