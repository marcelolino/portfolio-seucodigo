import {
  pgTable,
  text,
  serial,
  integer,
  boolean,
  timestamp,
  numeric,
  doublePrecision,
} from "drizzle-orm/pg-core";
// There are no immediately obvious errors in this schema definition.
// The schema appears to be well-structured and uses the Drizzle ORM and Zod libraries correctly.
// However, a thorough review would involve checking:

// 1. Data type consistency between the schema and the actual database tables.
// 2. Validation rules defined in Zod schemas for correctness and security.
// 3. Relationships between tables (foreign keys) for accuracy.
// 4. The intended behavior of each field and its corresponding Zod validation.
// 5. Potential performance implications of certain data types or constraints.

// Without access to the database and specific requirements, it's difficult to identify concrete errors.
// This schema provides a good foundation, but should be validated against the actual implementation.
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  avatar: text("avatar"),
  role: text("role").notNull().default("user"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  technologies: text("technologies").array().notNull(),
  image: text("image").notNull(),
  imageUrl: text("image_url"),
  previewImage1: text("preview_image_1"),
  previewImage2: text("preview_image_2"),
  previewImage3: text("preview_image_3"),
  previewImage4: text("preview_image_4"),
  featured: boolean("featured").default(false),
  order: integer("order").default(0),
  price: numeric("price", { precision: 10, scale: 2 }),
  status: text("status").notNull().default("active"), // active, inactive, in_progress, completed
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  technologies: text("technologies").array(),
  image: text("image"),
  imageUrl: text("image_url"),
  featured: boolean("featured").default(false),
  order: integer("order").default(0),
  price: numeric("price", { precision: 10, scale: 2 }),
  status: text("status").notNull().default("active"), // active, inactive, in_progress, completed
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  company: text("company").notNull(),
  position: text("position"),
  avatar: text("avatar").notNull(),
  message: text("message").notNull(), // Alterado de content para message para corresponder ao banco
  rating: integer("rating").notNull(),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  receiverId: integer("receiver_id"),
  content: text("content").notNull(),
  isAdmin: boolean("is_admin").notNull().default(false),
  isRead: boolean("read").default(false), // Alterado de "is_read" para "read" para corresponder ao banco
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  siteName: text("site_name").notNull(),
  siteTitle: text("site_title").notNull(),
  contactEmail: text("contact_email").notNull(),
  contactPhone: text("contact_phone"),
  address: text("address"),
  logo: text("logo"),
  github: text("github"),
  linkedin: text("linkedin"),
  twitter: text("twitter"),
  instagram: text("instagram"),
  whatsapp: text("whatsapp"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  clientName: text("client_name").notNull(),
  clientEmail: text("client_email").notNull(),
  clientPhone: text("client_phone"),
  projectId: integer("project_id").references(() => projects.id),
  serviceId: integer("service_id").references(() => services.id),
  projectTitle: text("project_title"), // Para projetos customizados
  description: text("description").notNull(),
  budget: numeric("budget", { precision: 10, scale: 2 }),
  deadline: timestamp("deadline"),
  status: text("status").notNull().default("pending"), // pending, approved, in_progress, completed, cancelled
  priority: text("priority").notNull().default("medium"), // low, medium, high, urgent
  notes: text("notes"),
  totalValue: numeric("total_value", { precision: 10, scale: 2 }),
  paymentMethod: text("payment_method"), // stripe, mercadopago
  paymentStatus: text("payment_status").default("pending"), // pending, processing, completed, failed
  paymentId: text("payment_id"), // ID do pagamento no gateway
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const paymentMethods = pgTable("payment_methods", {
  id: serial("id").primaryKey(),
  provider: text("provider").notNull(), // stripe, mercadopago
  name: text("name").notNull(),
  enabled: boolean("enabled").default(false),
  currency: text("currency").default("BRL"),
  publicKey: text("public_key"),
  secretKey: text("secret_key"),
  webhookSecret: text("webhook_secret"),
  logo: text("logo"),
  config: text("config"), // JSON string for additional configuration
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
});

export const insertServiceSchema = createInsertSchema(services).omit({
  id: true,
  createdAt: true,
});

export const insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true,
  createdAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true,
});

export const insertSiteSettingsSchema = createInsertSchema(siteSettings).omit({
  id: true,
  updatedAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPaymentMethodSchema = createInsertSchema(
  paymentMethods,
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof services.$inferSelect;

export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type Testimonial = typeof testimonials.$inferSelect;

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;

export type InsertSiteSettings = z.infer<typeof insertSiteSettingsSchema>;
export type SiteSettings = typeof siteSettings.$inferSelect;

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

export type InsertPaymentMethod = z.infer<typeof insertPaymentMethodSchema>;
export type PaymentMethod = typeof paymentMethods.$inferSelect;

// Extended schemas for validation
export const loginSchema = z.object({
  username: z.string().min(1, "Nome de usuário é obrigatório"),
  password: z.string().min(1, "A senha é obrigatória"),
});

export const registerSchema = insertUserSchema
  .extend({
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export const contactFormSchema = insertContactSchema;

export const orderFormSchema = insertOrderSchema
  .extend({
    clientEmail: z.string().email("Email inválido"),
    budget: z.string().optional(),
    totalValue: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.projectId && !data.serviceId && !data.projectTitle) {
        return false;
      }
      return true;
    },
    {
      message:
        "Selecione um projeto, serviço ou defina um título personalizado",
      path: ["projectId"],
    },
  );
