import { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { ProjectsAdmin } from "@/components/admin/projects-admin";
import { ServicesAdmin } from "@/components/admin/services-admin";
import { AdminTestimonials } from "@/components/admin/admin-testimonials";
import { AdminChat } from "@/components/admin/admin-chat";
import { AdminContacts } from "@/components/admin/admin-contacts";
import { AdminOrders } from "@/components/admin/admin-orders";
import { AdminUsers } from "@/components/admin/admin-users";
import { AdminSettings } from "@/components/admin/admin-settings";
import { PaymentMethodsAdmin } from "@/components/admin/payment-methods-admin";
import { Button } from "@/components/ui/button";
import { RemixIcon } from "@/components/ui/remixicon";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import "@/styles/admin-theme.css";

type AdminSection = "dashboard" | "projects" | "services" | "testimonials" | "chat" | "contacts" | "orders" | "users" | "payment-methods" | "settings";

export default function AdminPage() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<AdminSection>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderContent = () => {
    switch (activeSection) {
      case "projects":
        return <ProjectsAdmin />;
      case "services":
        return <ServicesAdmin />;
      case "testimonials":
        return <AdminTestimonials />;
      case "chat":
        return <AdminChat />;
      case "contacts":
        return <AdminContacts />;
      case "orders":
        return <AdminOrders />;
      case "users":
        return <AdminUsers />;
      case "payment-methods":
        return <PaymentMethodsAdmin />;
      case "settings":
        return <AdminSettings />;
      default:
        return <AdminDashboard />;
    }
  };

  if (!user) {
    return (
      <div className="admin-theme admin-container flex items-center justify-center h-screen">
        <div className="admin-card p-8 text-center max-w-md">
          <h1 className="admin-header text-2xl mb-4">Acesso Restrito</h1>
          <p className="admin-subheader mb-6">Você não tem permissão para acessar esta página.</p>
          <Link href="/">
            <Button className="admin-btn-primary">Voltar ao Início</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-theme admin-container min-h-screen flex">
      {/* Mobile sidebar toggle */}
      <Button
        variant="outline"
        size="icon"
        className="admin-btn-secondary fixed top-4 left-4 md:hidden z-50 border-[#E5E5E5] hover:bg-[#F8F9FA]"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <RemixIcon name={sidebarOpen ? "ri-menu-fold-line" : "ri-menu-unfold-line"} />
      </Button>

      {/* Sidebar */}
      <div className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-200 ease-in-out fixed md:relative z-40 h-full`}>
        <AdminSidebar 
          activeSection={activeSection} 
          setActiveSection={setActiveSection} 
          closeSidebar={() => setSidebarOpen(false)}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 p-4 md:p-8 overflow-auto bg-[#FFFFFF]">
        {renderContent()}
      </div>
    </div>
  );
}

function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    projects: 0,
    services: 0,
    testimonials: 0,
    users: 0,
    chatMessages: 0,
    contacts: 0
  });
  
  // Buscar os dados do dashboard
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // Projetos
        const projectsRes = await fetch('/api/projects');
        const projects = await projectsRes.json();
        
        // Serviços
        const servicesRes = await fetch('/api/services');
        const services = await servicesRes.json();
        
        // Depoimentos
        const testimonialsRes = await fetch('/api/testimonials');
        const testimonials = await testimonialsRes.json();
        
        // Contatos
        const contactsRes = await fetch('/api/contacts');
        const contacts = await contactsRes.json();
        
        // Usuários (apenas admin)
        const usersRes = await fetch('/api/users');
        const users = usersRes.ok ? await usersRes.json() : [];
        
        // Mensagens
        const messagesRes = await fetch('/api/messages');
        const messages = messagesRes.ok ? await messagesRes.json() : [];
        
        setStats({
          projects: projects.length || 0,
          services: services.length || 0,
          testimonials: testimonials.length || 0,
          users: users.length || 0,
          chatMessages: messages.length || 0,
          contacts: contacts.length || 0
        });
      } catch (error) {
        console.error("Erro ao buscar estatísticas:", error);
      }
    };
    
    fetchCounts();
  }, []);

  return (
    <div>
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Painel Administrativo</h1>
          <p className="text-gray-600">Bem-vindo, {user?.name}!</p>
        </div>
        <div>
          <Link href="/">
            <Button variant="outline" className="flex items-center gap-2">
              <RemixIcon name="ri-home-line" /> Voltar ao Site
            </Button>
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Projetos</h3>
            <div className="p-2 bg-blue-100 text-primary rounded-full">
              <RemixIcon name="ri-folder-line text-xl" />
            </div>
          </div>
          <p className="text-3xl font-bold mt-2">{stats.projects}</p>
          <p className="text-gray-500 text-sm mt-1">Total de projetos cadastrados</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Serviços</h3>
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-full">
              <RemixIcon name="ri-service-line text-xl" />
            </div>
          </div>
          <p className="text-3xl font-bold mt-2">{stats.services}</p>
          <p className="text-gray-500 text-sm mt-1">Total de serviços oferecidos</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Depoimentos</h3>
            <div className="p-2 bg-yellow-100 text-yellow-600 rounded-full">
              <RemixIcon name="ri-chat-quote-line text-xl" />
            </div>
          </div>
          <p className="text-3xl font-bold mt-2">{stats.testimonials}</p>
          <p className="text-gray-500 text-sm mt-1">Total de depoimentos</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Usuários</h3>
            <div className="p-2 bg-green-100 text-green-600 rounded-full">
              <RemixIcon name="ri-user-line text-xl" />
            </div>
          </div>
          <p className="text-3xl font-bold mt-2">{stats.users}</p>
          <p className="text-gray-500 text-sm mt-1">Total de usuários cadastrados</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Mensagens</h3>
            <div className="p-2 bg-purple-100 text-purple-600 rounded-full">
              <RemixIcon name="ri-message-3-line text-xl" />
            </div>
          </div>
          <p className="text-3xl font-bold mt-2">{stats.chatMessages}</p>
          <p className="text-gray-500 text-sm mt-1">Total de mensagens no chat</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Contatos</h3>
            <div className="p-2 bg-teal-100 text-teal-600 rounded-full">
              <RemixIcon name="ri-mail-open-line text-xl" />
            </div>
          </div>
          <p className="text-3xl font-bold mt-2">{stats.contacts}</p>
          <p className="text-gray-500 text-sm mt-1">Mensagens de contato recebidas</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="font-semibold text-lg mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button onClick={() => window.location.href="/admin?section=projects"} className="flex items-center justify-center gap-2 h-auto py-4">
            <RemixIcon name="ri-add-line" /> Novo Projeto
          </Button>
          <Button onClick={() => window.location.href="/admin?section=services"} className="flex items-center justify-center gap-2 h-auto py-4">
            <RemixIcon name="ri-add-line" /> Novo Serviço
          </Button>
          <Button onClick={() => window.location.href="/admin?section=testimonials"} className="flex items-center justify-center gap-2 h-auto py-4">
            <RemixIcon name="ri-add-line" /> Novo Depoimento
          </Button>
          <Button onClick={() => window.location.href="/admin?section=chat"} className="flex items-center justify-center gap-2 h-auto py-4">
            <RemixIcon name="ri-chat-check-line" /> Atender Chat
          </Button>
          <Button onClick={() => window.location.href="/admin?section=contacts"} className="flex items-center justify-center gap-2 h-auto py-4">
            <RemixIcon name="ri-mail-open-line" /> Ver Mensagens de Contato
          </Button>
        </div>
      </div>
    </div>
  );
}
