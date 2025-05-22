import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { WebSocketServer, WebSocket } from "ws";
import { z } from "zod";
import { 
  insertContactSchema, 
  insertProjectSchema, 
  insertServiceSchema, 
  insertTestimonialSchema,
  insertSiteSettingsSchema
} from "@shared/schema";

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
  
  // Site Settings
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getSiteSettings();
      res.json(settings || {});
    } catch (error) {
      console.error("Error fetching settings:", error);
      res.status(500).json({ message: "Erro ao buscar configurações do site" });
    }
  });
  
  app.put("/api/settings", checkAdmin, async (req, res) => {
    try {
      const settingsData = insertSiteSettingsSchema.partial().parse(req.body);
      const settings = await storage.updateSiteSettings(settingsData);
      res.json(settings);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
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
            if (data.userId) {
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
              const newMessage = await storage.createMessage({
                userId: isAdmin ? data.userId : userId, // userId para mensagens admin->user, null para visitantes
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
