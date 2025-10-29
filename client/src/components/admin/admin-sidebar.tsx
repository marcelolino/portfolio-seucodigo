import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { RemixIcon } from "@/components/ui/remixicon";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";

type AdminSection = "dashboard" | "projects" | "services" | "testimonials" | "chat" | "contacts" | "orders" | "users" | "payment-methods" | "settings";

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
    <div className="admin-sidebar bg-[#FFFFFF] text-[#1A1A1A] h-screen w-64 flex flex-col border-r border-[#E5E5E5]">
      <div className="p-6 border-b border-[#E5E5E5]">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-[#00A8E8] text-xl font-bold">SeuCodigo</span>
        </Link>
      </div>

      <div className="flex items-center gap-3 p-4 border-b border-[#E5E5E5]">
        <Avatar className="h-10 w-10">
          <AvatarImage src={`https://ui-avatars.com/api/?name=${user?.name}&background=00A8E8&color=fff`} />
          <AvatarFallback className="bg-[#00A8E8] text-white">{user?.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium text-[#1A1A1A]">{user?.name}</p>
          <p className="text-xs text-[#4D4D4D]">Administrador</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-auto">
        <Button
          variant="ghost"
          className={`admin-sidebar-item w-full justify-start ${
            activeSection === "dashboard" 
              ? "admin-sidebar-item active bg-[#00A8E8] text-white" 
              : "text-[#4D4D4D] hover:bg-[#F8F9FA] hover:text-[#1A1A1A]"
          }`}
          onClick={() => handleSectionChange("dashboard")}
        >
          <RemixIcon name="ri-dashboard-line mr-2" /> Dashboard
        </Button>
        <Button
          variant="ghost"
          className={`admin-sidebar-item w-full justify-start ${
            activeSection === "projects" 
              ? "admin-sidebar-item active bg-[#00A8E8] text-white" 
              : "text-[#4D4D4D] hover:bg-[#F8F9FA] hover:text-[#1A1A1A]"
          }`}
          onClick={() => handleSectionChange("projects")}
        >
          <RemixIcon name="ri-folder-line mr-2" /> Projetos
        </Button>
        <Button
          variant="ghost"
          className={`admin-sidebar-item w-full justify-start ${
            activeSection === "services" 
              ? "admin-sidebar-item active bg-[#00A8E8] text-white" 
              : "text-[#4D4D4D] hover:bg-[#F8F9FA] hover:text-[#1A1A1A]"
          }`}
          onClick={() => handleSectionChange("services")}
        >
          <RemixIcon name="ri-service-line mr-2" /> Serviços
        </Button>
        <Button
          variant="ghost"
          className={`admin-sidebar-item w-full justify-start ${
            activeSection === "testimonials" 
              ? "admin-sidebar-item active bg-[#00A8E8] text-white" 
              : "text-[#4D4D4D] hover:bg-[#F8F9FA] hover:text-[#1A1A1A]"
          }`}
          onClick={() => handleSectionChange("testimonials")}
        >
          <RemixIcon name="ri-chat-quote-line mr-2" /> Depoimentos
        </Button>
        <Button
          variant="ghost"
          className={`admin-sidebar-item w-full justify-start ${
            activeSection === "chat" 
              ? "admin-sidebar-item active bg-[#00A8E8] text-white" 
              : "text-[#4D4D4D] hover:bg-[#F8F9FA] hover:text-[#1A1A1A]"
          }`}
          onClick={() => handleSectionChange("chat")}
        >
          <RemixIcon name="ri-message-3-line mr-2" /> Chat
        </Button>
        <Button
          variant="ghost"
          className={`admin-sidebar-item w-full justify-start ${
            activeSection === "contacts" 
              ? "admin-sidebar-item active bg-[#00A8E8] text-white" 
              : "text-[#4D4D4D] hover:bg-[#F8F9FA] hover:text-[#1A1A1A]"
          }`}
          onClick={() => handleSectionChange("contacts")}
        >
          <RemixIcon name="ri-mail-open-line mr-2" /> Caixa de Entrada
        </Button>
        <Button
          variant="ghost"
          className={`admin-sidebar-item w-full justify-start ${
            activeSection === "orders" 
              ? "admin-sidebar-item active bg-[#00A8E8] text-white" 
              : "text-[#4D4D4D] hover:bg-[#F8F9FA] hover:text-[#1A1A1A]"
          }`}
          onClick={() => handleSectionChange("orders")}
        >
          <RemixIcon name="ri-shopping-cart-line mr-2" /> Pedidos
        </Button>
        <Button
          variant="ghost"
          className={`admin-sidebar-item w-full justify-start ${
            activeSection === "users" 
              ? "admin-sidebar-item active bg-[#00A8E8] text-white" 
              : "text-[#4D4D4D] hover:bg-[#F8F9FA] hover:text-[#1A1A1A]"
          }`}
          onClick={() => handleSectionChange("users")}
        >
          <RemixIcon name="ri-user-line mr-2" /> Usuários
        </Button>
        <Button
          variant="ghost"
          className={`admin-sidebar-item w-full justify-start ${
            activeSection === "payment-methods" 
              ? "admin-sidebar-item active bg-[#00A8E8] text-white" 
              : "text-[#4D4D4D] hover:bg-[#F8F9FA] hover:text-[#1A1A1A]"
          }`}
          onClick={() => handleSectionChange("payment-methods")}
        >
          <RemixIcon name="ri-bank-card-line mr-2" /> Métodos de Pagamento
        </Button>
        <Button
          variant="ghost"
          className={`admin-sidebar-item w-full justify-start ${
            activeSection === "settings" 
              ? "admin-sidebar-item active bg-[#00A8E8] text-white" 
              : "text-[#4D4D4D] hover:bg-[#F8F9FA] hover:text-[#1A1A1A]"
          }`}
          onClick={() => handleSectionChange("settings")}
        >
          <RemixIcon name="ri-settings-3-line mr-2" /> Configurações
        </Button>
      </nav>

      <div className="p-4 border-t border-[#E5E5E5]">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-[#4D4D4D] hover:bg-[#F8F9FA] hover:text-[#1A1A1A]"
          onClick={() => logoutMutation.mutate()}
        >
          <RemixIcon name="ri-logout-box-line mr-2" /> Sair
        </Button>
      </div>
    </div>
  );
}
