import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { RemixIcon } from "@/components/ui/remixicon";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";

type AdminSection = "dashboard" | "projects" | "services" | "testimonials" | "chat" | "users" | "settings";

interface AdminSidebarProps {
  activeSection: AdminSection;
  setActiveSection: (section: AdminSection) => void;
  closeSidebar: () => void;
}

export function AdminSidebar({ activeSection, setActiveSection, closeSidebar }: AdminSidebarProps) {
  const { user, logoutMutation } = useAuth();

  const handleSectionChange = (section: AdminSection) => {
    setActiveSection(section);
    closeSidebar();
  };

  return (
    <div className="bg-dark text-white h-screen w-64 flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-primary text-xl font-bold">SeuCodigo</span>
        </Link>
      </div>

      <div className="flex items-center gap-3 p-4 border-b border-gray-700">
        <Avatar className="h-10 w-10">
          <AvatarImage src={`https://ui-avatars.com/api/?name=${user?.name}&background=2563eb&color=fff`} />
          <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">{user?.name}</p>
          <p className="text-xs text-gray-400">Administrador</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-auto">
        <Button
          variant={activeSection === "dashboard" ? "secondary" : "ghost"}
          className={`w-full justify-start ${activeSection === "dashboard" ? "" : "text-gray-300 hover:text-white"}`}
          onClick={() => handleSectionChange("dashboard")}
        >
          <RemixIcon name="ri-dashboard-line mr-2" /> Dashboard
        </Button>
        <Button
          variant={activeSection === "projects" ? "secondary" : "ghost"}
          className={`w-full justify-start ${activeSection === "projects" ? "" : "text-gray-300 hover:text-white"}`}
          onClick={() => handleSectionChange("projects")}
        >
          <RemixIcon name="ri-folder-line mr-2" /> Projetos
        </Button>
        <Button
          variant={activeSection === "services" ? "secondary" : "ghost"}
          className={`w-full justify-start ${activeSection === "services" ? "" : "text-gray-300 hover:text-white"}`}
          onClick={() => handleSectionChange("services")}
        >
          <RemixIcon name="ri-service-line mr-2" /> Serviços
        </Button>
        <Button
          variant={activeSection === "testimonials" ? "secondary" : "ghost"}
          className={`w-full justify-start ${activeSection === "testimonials" ? "" : "text-gray-300 hover:text-white"}`}
          onClick={() => handleSectionChange("testimonials")}
        >
          <RemixIcon name="ri-chat-quote-line mr-2" /> Depoimentos
        </Button>
        <Button
          variant={activeSection === "chat" ? "secondary" : "ghost"}
          className={`w-full justify-start ${activeSection === "chat" ? "" : "text-gray-300 hover:text-white"}`}
          onClick={() => handleSectionChange("chat")}
        >
          <RemixIcon name="ri-message-3-line mr-2" /> Chat
        </Button>
        <Button
          variant={activeSection === "users" ? "secondary" : "ghost"}
          className={`w-full justify-start ${activeSection === "users" ? "" : "text-gray-300 hover:text-white"}`}
          onClick={() => handleSectionChange("users")}
        >
          <RemixIcon name="ri-user-line mr-2" /> Usuários
        </Button>
        <Button
          variant={activeSection === "settings" ? "secondary" : "ghost"}
          className={`w-full justify-start ${activeSection === "settings" ? "" : "text-gray-300 hover:text-white"}`}
          onClick={() => handleSectionChange("settings")}
        >
          <RemixIcon name="ri-settings-3-line mr-2" /> Configurações
        </Button>
      </nav>

      <div className="p-4 border-t border-gray-700">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-gray-300 hover:text-white"
          onClick={() => logoutMutation.mutate()}
        >
          <RemixIcon name="ri-logout-box-line mr-2" /> Sair
        </Button>
      </div>
    </div>
  );
}
