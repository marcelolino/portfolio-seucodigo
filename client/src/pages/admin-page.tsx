import { useState } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminProjects } from "@/components/admin/admin-projects-new";
import { AdminServices } from "@/components/admin/admin-services";
import { AdminTestimonials } from "@/components/admin/admin-testimonials";
import { AdminChat } from "@/components/admin/admin-chat";
import { AdminUsers } from "@/components/admin/admin-users";
import { Button } from "@/components/ui/button";
import { RemixIcon } from "@/components/ui/remixicon";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";

type AdminSection = "dashboard" | "projects" | "services" | "testimonials" | "chat" | "users";

export default function AdminPage() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<AdminSection>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderContent = () => {
    switch (activeSection) {
      case "projects":
        return <AdminProjects />;
      case "services":
        return <AdminServices />;
      case "testimonials":
        return <AdminTestimonials />;
      case "chat":
        return <AdminChat />;
      case "users":
        return <AdminUsers />;
      default:
        return <AdminDashboard />;
    }
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Acesso Restrito</h1>
          <p className="mb-6">Você não tem permissão para acessar esta página.</p>
          <Link href="/">
            <Button>Voltar ao Início</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar toggle */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 md:hidden z-50"
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
      <div className="flex-1 p-4 md:p-8 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
}

function AdminDashboard() {
  const { user } = useAuth();
  const [stats] = useState({
    projects: 6,
    services: 4,
    testimonials: 4,
    users: 1,
    chatMessages: 0
  });

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
        </div>
      </div>
    </div>
  );
}
