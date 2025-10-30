import express, { type Request, Response, NextFunction } from "express";
import { DatabaseStorageVercel } from "../server/dbStorage-vercel";
import { setupAuth } from "../server/auth";

import { z } from "zod";
import { db, sql } from "../server/db-vercel";
import { sql as drizzleSql } from "drizzle-orm";
import { 
  insertContactSchema, 
  insertProjectSchema, 
  insertServiceSchema, 
  insertTestimonialSchema,
  insertSiteSettingsSchema,
  insertOrderSchema,
  insertPaymentMethodSchema
} from "../shared/schema";

const storage = new DatabaseStorageVercel();

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

let stripe: any = null;
if (process.env.STRIPE_SECRET_KEY) {
  try {
    const Stripe = require("stripe");
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-10-16",
    });
  } catch (error) {
    console.log("Stripe não configurado");
  }
}

function checkAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Não autenticado" });
  }
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Acesso negado" });
  }
  next();
}

setupAuth(app, storage, "");

app.get("/projects", async (req, res) => {
  try {
    const projects = await storage.getProjects();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar projetos" });
  }
});

app.get("/projects/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const project = await storage.getProject(id);
    
    if (!project) {
      return res.status(404).json({ message: "Projeto não encontrado" });
    }
    
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar projeto" });
  }
});

app.post("/projects", checkAdmin, async (req, res) => {
  try {
    const projectData = insertProjectSchema.parse(req.body);
    const project = await storage.createProject(projectData);
    res.status(201).json(project);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
    }
    res.status(500).json({ message: "Erro ao criar projeto" });
  }
});

app.put("/projects/:id", checkAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const projectData = insertProjectSchema.partial().parse(req.body);
    
    const project = await storage.updateProject(id, projectData);
    
    if (!project) {
      return res.status(404).json({ message: "Projeto não encontrado" });
    }
    
    res.json(project);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
    }
    res.status(500).json({ message: "Erro ao atualizar projeto" });
  }
});

app.patch("/projects/:id", checkAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const projectData = insertProjectSchema.partial().parse(req.body);
    
    const project = await storage.updateProject(id, projectData);
    
    if (!project) {
      return res.status(404).json({ message: "Projeto não encontrado" });
    }
    
    res.json(project);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
    }
    res.status(500).json({ message: "Erro ao atualizar projeto" });
  }
});

app.delete("/projects/:id", checkAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const success = await storage.deleteProject(id);
    
    if (!success) {
      return res.status(404).json({ message: "Projeto não encontrado" });
    }
    
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar projeto" });
  }
});

app.get("/services", async (req, res) => {
  try {
    const services = await storage.getServices();
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar serviços" });
  }
});

app.get("/services/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const service = await storage.getService(id);
    
    if (!service) {
      return res.status(404).json({ message: "Serviço não encontrado" });
    }
    
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar serviço" });
  }
});

app.post("/services", checkAdmin, async (req, res) => {
  try {
    const serviceData = insertServiceSchema.parse(req.body);
    const service = await storage.createService(serviceData);
    res.status(201).json(service);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
    }
    res.status(500).json({ message: "Erro ao criar serviço" });
  }
});

app.put("/services/:id", checkAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const serviceData = insertServiceSchema.partial().parse(req.body);
    
    const service = await storage.updateService(id, serviceData);
    
    if (!service) {
      return res.status(404).json({ message: "Serviço não encontrado" });
    }
    
    res.json(service);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
    }
    res.status(500).json({ message: "Erro ao atualizar serviço" });
  }
});

app.delete("/services/:id", checkAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const success = await storage.deleteService(id);
    
    if (!success) {
      return res.status(404).json({ message: "Serviço não encontrado" });
    }
    
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar serviço" });
  }
});

app.get("/testimonials", async (req, res) => {
  try {
    const testimonials = await storage.getTestimonials();
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar depoimentos" });
  }
});

app.post("/testimonials", checkAdmin, async (req, res) => {
  try {
    const testimonialData = insertTestimonialSchema.parse(req.body);
    const testimonial = await storage.createTestimonial(testimonialData);
    res.status(201).json(testimonial);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
    }
    res.status(500).json({ message: "Erro ao criar depoimento" });
  }
});

app.put("/testimonials/:id", checkAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const testimonialData = insertTestimonialSchema.partial().parse(req.body);
    
    const testimonial = await storage.updateTestimonial(id, testimonialData);
    
    if (!testimonial) {
      return res.status(404).json({ message: "Depoimento não encontrado" });
    }
    
    res.json(testimonial);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
    }
    res.status(500).json({ message: "Erro ao atualizar depoimento" });
  }
});

app.delete("/testimonials/:id", checkAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const success = await storage.deleteTestimonial(id);
    
    if (!success) {
      return res.status(404).json({ message: "Depoimento não encontrado" });
    }
    
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar depoimento" });
  }
});

app.post("/contact", async (req, res) => {
  try {
    const contactData = insertContactSchema.parse(req.body);
    const contact = await storage.createContact(contactData);
    res.status(201).json({ message: "Mensagem enviada com sucesso!" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
    }
    res.status(500).json({ message: "Erro ao enviar mensagem" });
  }
});

app.get("/contacts", checkAdmin, async (req, res) => {
  try {
    const contacts = await storage.getContacts();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar contatos" });
  }
});

app.get("/orders", checkAdmin, async (req, res) => {
  try {
    const orders = await storage.getOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar pedidos" });
  }
});

app.post("/orders", async (req, res) => {
  try {
    const orderData = insertOrderSchema.parse(req.body);
    const order = await storage.createOrder(orderData);
    res.status(201).json(order);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
    }
    res.status(500).json({ message: "Erro ao criar pedido" });
  }
});

app.put("/orders/:id", checkAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const orderData = insertOrderSchema.partial().parse(req.body);
    
    const order = await storage.updateOrder(id, orderData);
    
    if (!order) {
      return res.status(404).json({ message: "Pedido não encontrado" });
    }
    
    res.json(order);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
    }
    res.status(500).json({ message: "Erro ao atualizar pedido" });
  }
});

app.get("/payment-methods", async (req, res) => {
  try {
    const paymentMethods = await storage.getPaymentMethods();
    res.json(paymentMethods);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar métodos de pagamento" });
  }
});

app.post("/payment-methods", checkAdmin, async (req, res) => {
  try {
    const paymentMethodData = insertPaymentMethodSchema.parse(req.body);
    const paymentMethod = await storage.createPaymentMethod(paymentMethodData);
    res.status(201).json(paymentMethod);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
    }
    res.status(500).json({ message: "Erro ao criar método de pagamento" });
  }
});

app.put("/payment-methods/:id", checkAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const paymentMethodData = insertPaymentMethodSchema.partial().parse(req.body);
    
    const paymentMethod = await storage.updatePaymentMethod(id, paymentMethodData);
    
    if (!paymentMethod) {
      return res.status(404).json({ message: "Método de pagamento não encontrado" });
    }
    
    res.json(paymentMethod);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
    }
    res.status(500).json({ message: "Erro ao atualizar método de pagamento" });
  }
});

app.delete("/payment-methods/:id", checkAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const success = await storage.deletePaymentMethod(id);
    
    if (!success) {
      return res.status(404).json({ message: "Método de pagamento não encontrado" });
    }
    
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar método de pagamento" });
  }
});

app.get("/settings", async (req, res) => {
  try {
    const result = await sql`SELECT * FROM site_settings LIMIT 1`;
    const settings = result[0];
    res.json(settings || {});
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar configurações" });
  }
});

app.put("/settings", checkAdmin, async (req, res) => {
  try {
    const settingsData = insertSiteSettingsSchema.parse(req.body);
    
    const existingSettings = await sql`SELECT id FROM site_settings LIMIT 1`;
    
    if (existingSettings.length > 0) {
      const id = existingSettings[0].id;
      const updates = Object.entries(settingsData)
        .map(([key, value]) => `${key} = ${typeof value === 'string' ? `'${value.replace(/'/g, "''")}'` : value}`)
        .join(', ');
      await sql`UPDATE site_settings SET ${drizzleSql.raw(updates)} WHERE id = ${id}`;
    } else {
      const keys = Object.keys(settingsData).join(', ');
      const values = Object.values(settingsData).map(v => typeof v === 'string' ? `'${v.replace(/'/g, "''")}'` : v).join(', ');
      await sql`INSERT INTO site_settings (${drizzleSql.raw(keys)}) VALUES (${drizzleSql.raw(values)})`;
    }
    
    res.json({ message: "Configurações atualizadas com sucesso" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
    }
    res.status(500).json({ message: "Erro ao atualizar configurações" });
  }
});

app.get("/users", checkAdmin, async (req, res) => {
  try {
    const allUsers = await storage.getUsers();
    const usersWithoutPasswords = allUsers.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    res.json(usersWithoutPasswords);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar usuários" });
  }
});

app.put("/users/:id", checkAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const userData = req.body;
    
    const user = await storage.updateUser(id, userData);
    
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }
    
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar usuário" });
  }
});

if (stripe) {
  app.post("/create-payment-intent", async (req, res) => {
    try {
      const { amount } = req.body;
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: "brl",
      });
      
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
}

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

export default app;
