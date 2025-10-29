import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { WebSocketServer, WebSocket } from "ws";
import { z } from "zod";
import { db } from "./db";
import { sql } from "drizzle-orm";
import { 
  insertContactSchema, 
  insertProjectSchema, 
  insertServiceSchema, 
  insertTestimonialSchema,
  insertSiteSettingsSchema,
  insertOrderSchema,
  insertPaymentMethodSchema
} from "@shared/schema";

// Importar Stripe condicionalmente
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

interface WebSocketMessage {
  type: string;
  userId?: number;
  content?: string;
  isAdmin?: boolean;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Configurar autenticação
  setupAuth(app);

  // API routes
  
  // Projects
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar projetos" });
    }
  });
  
  app.get("/api/projects/:id", async (req, res) => {
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
  
  app.post("/api/projects", checkAdmin, async (req, res) => {
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
  
  app.put("/api/projects/:id", checkAdmin, async (req, res) => {
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

  app.patch("/api/projects/:id", checkAdmin, async (req, res) => {
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
  
  app.delete("/api/projects/:id", checkAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteProject(id);
      
      if (!success) {
        return res.status(404).json({ message: "Projeto não encontrado" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Erro ao deletar projeto" });
    }
  });
  
  // Services
  app.get("/api/services", async (req, res) => {
    try {
      const services = await storage.getServices();
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar serviços" });
    }
  });
  
  app.post("/api/services", checkAdmin, async (req, res) => {
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
  
  app.put("/api/services/:id", checkAdmin, async (req, res) => {
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
  
  app.delete("/api/services/:id", checkAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteService(id);
      
      if (!success) {
        return res.status(404).json({ message: "Serviço não encontrado" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Erro ao deletar serviço" });
    }
  });
  
  // Testimonials
  app.get("/api/testimonials", async (req, res) => {
    try {
      const testimonials = await storage.getTestimonials();
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar depoimentos" });
    }
  });
  
  app.post("/api/testimonials", checkAdmin, async (req, res) => {
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
  
  app.put("/api/testimonials/:id", checkAdmin, async (req, res) => {
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
  
  app.delete("/api/testimonials/:id", checkAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteTestimonial(id);
      
      if (!success) {
        return res.status(404).json({ message: "Depoimento não encontrado" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Erro ao deletar depoimento" });
    }
  });
  
  // Messages - visitantes podem buscar suas próprias mensagens (sem autenticação)
  app.get("/api/messages", async (req, res) => {
    try {
      // Para mensagens de visitantes, usamos um parâmetro especial 'visitor'
      if (req.query.visitor === 'true') {
        // Retornar todas as mensagens sem userId (mensagens de visitantes)
        const allMessages = await storage.getMessages(undefined);
        const visitorMessages = allMessages.filter(msg => msg.userId === null);
        
        // Mapear as mensagens para garantir que isRead está disponível para o frontend
        const formattedMessages = visitorMessages.map(msg => ({
          ...msg,
          isRead: msg.read // Garantindo que temos a propriedade isRead para compatibilidade
        }));
        
        return res.json(formattedMessages);
      }
      
      // Se o usuário está autenticado, verifica seu papel
      if (req.isAuthenticated()) {
        const userId = req.user!.role === "admin" ? undefined : req.user!.id;
        const messages = await storage.getMessages(userId);
        
        // Mapear as mensagens para garantir que isRead está disponível para o frontend
        const formattedMessages = messages.map(msg => ({
          ...msg,
          isRead: msg.read // Garantindo que temos a propriedade isRead para compatibilidade
        }));
        
        return res.json(formattedMessages);
      } else {
        // Para visitantes sem o parâmetro especial, retornar array vazio
        return res.json([]);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Erro ao buscar mensagens" });
    }
  });
  
  // Endpoint para criar mensagens via REST API (útil para testes)
  app.post("/api/messages", async (req, res) => {
    try {
      const { content, isAdmin = false } = req.body;
      
      if (!content) {
        return res.status(400).json({ message: "Conteúdo da mensagem é obrigatório" });
      }
      
      // Criar mensagem como visitante (sem userId)
      const newMessage = await storage.createMessage({
        userId: undefined,
        content,
        isAdmin
      });
      
      res.status(200).json(newMessage);
    } catch (error) {
      console.error("Error creating message:", error);
      res.status(500).json({ message: "Erro ao criar mensagem" });
    }
  });
  
  // Contacts
  app.post("/api/contacts", async (req, res) => {
    try {
      const contactData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(contactData);
      res.status(201).json(contact);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Erro ao enviar mensagem de contato" });
    }
  });

  app.get("/api/contacts", checkAdmin, async (req, res) => {
    try {
      const contacts = await storage.getContacts();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar contatos" });
    }
  });

  // Orders
  app.get("/api/orders", checkAdmin, async (req, res) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar pedidos" });
    }
  });

  app.get("/api/orders/:id", checkAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const order = await storage.getOrder(id);
      
      if (!order) {
        return res.status(404).json({ message: "Pedido não encontrado" });
      }
      
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar pedido" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      // Preparar dados do pedido com campos obrigatórios
      const orderData = {
        clientName: req.body.clientName,
        clientEmail: req.body.clientEmail,
        clientPhone: req.body.clientPhone || null,
        projectId: req.body.projectId || null,
        serviceId: req.body.serviceId || null,
        projectTitle: req.body.projectTitle || null,
        description: req.body.description,
        budget: req.body.budget || null,
        totalValue: req.body.totalValue || null,
        deadline: req.body.deadline || null,
        priority: req.body.priority || "medium",
        notes: req.body.notes || null,
        paymentMethod: req.body.paymentMethod || null,
        paymentStatus: "pending",
        paymentId: req.body.paymentId || null
      };
      
      const order = await storage.createOrder(orderData);
      res.status(201).json(order);
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      res.status(500).json({ message: "Erro ao criar pedido" });
    }
  });

  app.put("/api/orders/:id", checkAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const orderData = insertOrderSchema.parse(req.body);
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

  app.delete("/api/orders/:id", checkAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteOrder(id);
      
      if (!success) {
        return res.status(404).json({ message: "Pedido não encontrado" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Erro ao deletar pedido" });
    }
  });
  
  // Site Settings
  app.get("/api/settings", async (req, res) => {
    try {
      const result = await db.execute(sql`SELECT * FROM site_settings LIMIT 1`);
      
      if (result.rows.length > 0) {
        res.json(result.rows[0]);
      } else {
        res.json({
          siteName: 'SeuCodigo',
          siteTitle: 'Desenvolvedor Full Stack',
          contactEmail: 'contato@seucodigo.com',
          contactPhone: '(11) 9999-8888',
          address: 'São Paulo, SP - Brasil',
          logo: '',
          github: '',
          linkedin: '',
          twitter: '',
          instagram: '',
          whatsapp: ''
        });
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      res.json({
        siteName: 'SeuCodigo',
        siteTitle: 'Desenvolvedor Full Stack',
        contactEmail: 'contato@seucodigo.com',
        contactPhone: '(11) 9999-8888',
        address: 'São Paulo, SP - Brasil',
        logo: '',
        github: '',
        linkedin: '',
        twitter: '',
        instagram: '',
        whatsapp: ''
      });
    }
  });
  
  app.put("/api/settings", checkAdmin, async (req, res) => {
    try {
      const settings = req.body;
      
      const existing = await db.execute(sql`SELECT * FROM site_settings LIMIT 1`);
      
      if (existing.rows.length > 0) {
        await db.execute(sql`
          UPDATE site_settings 
          SET 
            site_name = ${settings.siteName || 'SeuCodigo'},
            site_title = ${settings.siteTitle || 'Desenvolvedor Full Stack'},
            contact_email = ${settings.contactEmail || 'contato@seucodigo.com'},
            contact_phone = ${settings.contactPhone || '(11) 9999-8888'},
            address = ${settings.address || 'São Paulo, SP - Brasil'},
            logo = ${settings.logo || ''},
            github = ${settings.github || ''},
            linkedin = ${settings.linkedin || ''},
            twitter = ${settings.twitter || ''},
            instagram = ${settings.instagram || ''},
            whatsapp = ${settings.whatsapp || ''}
          WHERE id = ${existing.rows[0].id}
        `);
      } else {
        await db.execute(sql`
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
        `);
      }
      
      const updated = await db.execute(sql`SELECT * FROM site_settings LIMIT 1`);
      res.json(updated.rows[0]);
      
    } catch (error) {
      console.error("Error updating settings:", error);
      res.status(500).json({ message: "Erro ao atualizar configurações do site" });
    }
  });
  
  app.get("/api/contacts", checkAdmin, async (req, res) => {
    try {
      const contacts = await storage.getContacts();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar mensagens de contato" });
    }
  });
  
  // Users
  app.get("/api/users", checkAdmin, async (req, res) => {
    try {
      const users = await storage.getUsers();
      // Remove password from response
      const sanitizedUsers = users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      res.json(sanitizedUsers);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar usuários" });
    }
  });

  // Update user profile
  app.put("/api/profile", checkAuth, async (req, res) => {
    try {
      const { name, email, username, avatar } = req.body;
      const userId = req.user!.id;
      
      // Check if email or username is already taken by another user
      const existingUserByEmail = await storage.getUserByEmail(email);
      if (existingUserByEmail && existingUserByEmail.id !== userId) {
        return res.status(400).json({ message: "Email já está em uso por outro usuário" });
      }
      
      const existingUserByUsername = await storage.getUserByUsername(username);
      if (existingUserByUsername && existingUserByUsername.id !== userId) {
        return res.status(400).json({ message: "Username já está em uso por outro usuário" });
      }
      
      // Update user profile
      const updatedUser = await storage.updateUser(userId, {
        name,
        email,
        username,
        avatar: avatar || null
      });
      
      if (!updatedUser) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }
      
      // Remove password from response
      const { password, ...userResponse } = updatedUser;
      res.json(userResponse);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Erro ao atualizar perfil" });
    }
  });

  // Rotas de pagamento Stripe
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      if (!stripe) {
        return res.status(400).json({ 
          message: "Stripe não configurado. Configure as chaves do Stripe para aceitar pagamentos." 
        });
      }

      const { amount, orderId } = req.body;
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "brl",
        metadata: {
          orderId: orderId.toString()
        },
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error("Erro ao criar payment intent:", error);
      res.status(500).json({ 
        message: "Erro ao criar intenção de pagamento: " + error.message 
      });
    }
  });

  // Rotas de pagamento Mercado Pago
  app.post("/api/create-mercadopago-preference", async (req, res) => {
    try {
      const { amount, orderId } = req.body;
      
      // Simulação de preferência do Mercado Pago
      // Em produção, use a SDK do Mercado Pago
      const preference = {
        preferenceId: `MP-${Date.now()}-${orderId}`,
        amount: amount,
        orderId: orderId
      };

      res.json({ preferenceId: preference.preferenceId });
    } catch (error: any) {
      console.error("Erro ao criar preferência Mercado Pago:", error);
      res.status(500).json({ 
        message: "Erro ao criar preferência de pagamento: " + error.message 
      });
    }
  });

  // Webhook do Stripe para confirmar pagamentos
  app.post("/api/stripe-webhook", async (req, res) => {
    try {
      const event = req.body;
      
      if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        const orderId = paymentIntent.metadata.orderId;
        
        // Atualizar status do pedido
        await db.execute(sql`
          UPDATE orders 
          SET payment_status = 'completed', payment_method = 'stripe', payment_id = ${paymentIntent.id}
          WHERE id = ${parseInt(orderId)}
        `);
      }

      res.json({ received: true });
    } catch (error) {
      console.error("Erro no webhook Stripe:", error);
      res.status(400).json({ message: "Erro no webhook" });
    }
  });
  
  // Create HTTP server for WebSocket
  const httpServer = createServer(app);
  
  // Set up WebSocket server
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  const clients = new Map<number, WebSocket>();
  const adminClients: WebSocket[] = [];
  
  wss.on('connection', (ws: WebSocket, req) => {
    let userId: number | undefined;
    let isAdmin = false;
    let isVisitor = false;
    let visitorId = Date.now().toString(); // Generate a unique ID for the visitor
    
    // Handle messages
    ws.on('message', async (message: string) => {
      try {
        const data: WebSocketMessage = JSON.parse(message);
        console.log("WebSocket message received:", data.type, data);
        
        switch (data.type) {
          case 'authenticate':
            if (data.userId && data.userId !== null) {
              userId = data.userId;
              const user = await storage.getUser(userId);
              
              if (user) {
                if (user.role === 'admin') {
                  isAdmin = true;
                  adminClients.push(ws);
                  console.log("Admin authenticated:", userId);
                } else {
                  clients.set(userId, ws);
                  console.log("User authenticated:", userId);
                }
              }
            } else if (data.isAdmin) {
              // Admin authentication without userId
              isAdmin = true;
              adminClients.push(ws);
              console.log("Admin authenticated without specific userId");
            } else {
              // This is a visitor without authentication
              isVisitor = true;
              // Store visitor connection in a way that admins can reach it
              clients.set(parseInt(visitorId), ws);
              console.log("Visitor authenticated with visitorId:", visitorId);
            }
            break;
            
          case 'message':
            // Allow messages from visitors too (no auth required)
            if (!userId && !isAdmin && !isVisitor) break;
            
            if (data.content && data.content.trim() !== '') {
              console.log("Message processing - isAdmin:", isAdmin, "userId:", userId, "isVisitor:", isVisitor);
              
              // Save message to database  
              let messageUserId = null;
              if (isAdmin && data.userId) {
                messageUserId = data.userId;
              } else if (userId) {
                messageUserId = userId;
              }
              
              const newMessage = await storage.createMessage({
                userId: messageUserId,
                content: data.content,
                isAdmin: isAdmin
              });
              console.log("Message saved to database:", newMessage);
              
              // Send to appropriate recipients
              const messagePayload = JSON.stringify({
                type: 'message',
                message: newMessage
              });
              
              if (isAdmin && data.userId) {
                // Admin sending to specific user ou visitante
                console.log("Admin sending to userId:", data.userId);
                const userWs = clients.get(data.userId);
                if (userWs && userWs.readyState === WebSocket.OPEN) {
                  userWs.send(messagePayload);
                  console.log("Message sent to user/visitor:", data.userId);
                } else {
                  console.log("User/visitor not connected or connection closed:", data.userId);
                }
              } else if (isVisitor || userId) {
                // Visitor ou user enviando mensagem, mandar para todos os admins
                console.log("User/visitor sending to all admins. AdminClients count:", adminClients.length);
                adminClients.forEach((adminWs, index) => {
                  if (adminWs.readyState === WebSocket.OPEN) {
                    adminWs.send(messagePayload);
                    console.log("Message sent to admin #", index);
                  } else {
                    console.log("Admin #", index, "connection not open");
                  }
                });
              }
              
              // Echo back to sender
              ws.send(messagePayload);
            }
            break;
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });
    
    // Handle disconnection
    ws.on('close', () => {
      if (userId) {
        clients.delete(userId);
      }
      if (isAdmin) {
        const index = adminClients.indexOf(ws);
        if (index !== -1) {
          adminClients.splice(index, 1);
        }
      }
    });
  });

  // Payment Methods API routes
  app.get("/api/payment-methods", checkAdmin, async (req, res) => {
    try {
      const paymentMethods = await storage.getPaymentMethods();
      res.json(paymentMethods);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar métodos de pagamento" });
    }
  });

  app.post("/api/payment-methods", checkAdmin, async (req, res) => {
    try {
      const data = insertPaymentMethodSchema.parse(req.body);
      const paymentMethod = await storage.createPaymentMethod(data);
      res.json(paymentMethod);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Erro ao criar método de pagamento" });
    }
  });

  app.put("/api/payment-methods/:id", checkAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = req.body;
      const paymentMethod = await storage.updatePaymentMethod(id, data);
      
      if (!paymentMethod) {
        return res.status(404).json({ message: "Método de pagamento não encontrado" });
      }
      
      res.json(paymentMethod);
    } catch (error) {
      res.status(500).json({ message: "Erro ao atualizar método de pagamento" });
    }
  });

  app.delete("/api/payment-methods/:id", checkAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deletePaymentMethod(id);
      
      if (!success) {
        return res.status(404).json({ message: "Método de pagamento não encontrado" });
      }
      
      res.json({ message: "Método de pagamento removido com sucesso" });
    } catch (error) {
      res.status(500).json({ message: "Erro ao remover método de pagamento" });
    }
  });
  
  return httpServer;
}

// Middleware to check if user is authenticated
function checkAuth(req: Request, res: Response, next: Function) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Não autenticado" });
  }
  next();
}

// Middleware to check if user is admin
function checkAdmin(req: Request, res: Response, next: Function) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Não autenticado" });
  }
  
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Acesso negado" });
  }
  
  next();
}
