import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RemixIcon } from "@/components/ui/remixicon";
import { AuthModals } from "@/components/auth/auth-modals";
import { useAuth } from "@/hooks/use-auth";
import { ChatWidget } from "@/components/chat/chat-widget";

export function Header() {
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showChatWidget, setShowChatWidget] = useState(false);
  const [showUserChat, setShowUserChat] = useState(false);

  useEffect(() => {
    // Close mobile menu when location changes
    setMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-primary text-2xl font-bold">SeuCodigo</span>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6">
              <a href="#inicio" className="font-medium hover:text-primary transition-colors">Início</a>
              <a href="#servicos" className="font-medium hover:text-primary transition-colors">Serviços</a>
              <a href="#projetos" className="font-medium hover:text-primary transition-colors">Projetos</a>
              <a href="#depoimentos" className="font-medium hover:text-primary transition-colors">Depoimentos</a>
              <a href="#contato" className="font-medium hover:text-primary transition-colors">Contato</a>
            </nav>
            
            {/* User Actions */}
            <div className="flex items-center gap-3">
              {!user ? (
                <>
                  <Button
                    variant="default"
                    className="hidden md:inline-block"
                    onClick={() => setShowLoginModal(true)}
                  >
                    Entrar
                  </Button>
                  <Button
                    variant="outline"
                    className="hidden md:inline-block border-primary text-primary hover:bg-primary hover:text-white"
                    onClick={() => setShowRegisterModal(true)}
                  >
                    Cadastrar
                  </Button>
                </>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <div className="flex items-center gap-2 cursor-pointer">
                    <Avatar>
                      <AvatarImage src={`https://ui-avatars.com/api/?name=${user.name}&background=2563eb&color=fff`} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{user.name}</span>
                  </div>
                  
                  {/* Chat Button */}
                  <Button
                    variant="ghost"
                    className="text-primary hover:text-accent transition-colors p-2 relative"
                    onClick={() => setShowUserChat(!showUserChat)}
                  >
                    <RemixIcon name="ri-message-3-line text-xl" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></span>
                  </Button>
                  
                  {/* Admin Panel Button (visible only for admins) */}
                  {user.role === "admin" && (
                    <Button 
                      variant="outline"
                      className="ml-2"
                      onClick={() => window.location.href = "/admin"}
                    >
                      Admin
                    </Button>
                  )}
                  
                  {/* Logout Button */}
                  <Button 
                    variant="ghost"
                    className="text-gray-500"
                    onClick={handleLogout}
                  >
                    <RemixIcon name="ri-logout-box-line" />
                  </Button>
                </div>
              )}
              
              {/* Mobile menu button */}
              <button 
                className="md:hidden text-gray-700 focus:outline-none"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <RemixIcon name="ri-menu-line text-2xl" />
              </button>
            </div>
          </div>
          
          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-white absolute left-0 right-0 shadow-md p-4">
              <nav className="flex flex-col space-y-4">
                <a href="#inicio" className="font-medium hover:text-primary transition-colors">Início</a>
                <a href="#servicos" className="font-medium hover:text-primary transition-colors">Serviços</a>
                <a href="#projetos" className="font-medium hover:text-primary transition-colors">Projetos</a>
                <a href="#depoimentos" className="font-medium hover:text-primary transition-colors">Depoimentos</a>
                <a href="#contato" className="font-medium hover:text-primary transition-colors">Contato</a>
                
                {!user ? (
                  <div className="pt-2 flex flex-col space-y-2">
                    <Button
                      variant="default"
                      className="w-full"
                      onClick={() => {
                        setShowLoginModal(true);
                        setMobileMenuOpen(false);
                      }}
                    >
                      Entrar
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-primary text-primary hover:bg-primary hover:text-white"
                      onClick={() => {
                        setShowRegisterModal(true);
                        setMobileMenuOpen(false);
                      }}
                    >
                      Cadastrar
                    </Button>
                  </div>
                ) : (
                  <div className="pt-2 flex flex-col space-y-2">
                    <div className="flex items-center gap-2 py-2">
                      <Avatar>
                        <AvatarImage src={`https://ui-avatars.com/api/?name=${user.name}&background=2563eb&color=fff`} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.name}</span>
                    </div>
                    
                    <Button
                      variant="default"
                      className="w-full"
                      onClick={() => {
                        setShowUserChat(true);
                        setMobileMenuOpen(false);
                      }}
                    >
                      <RemixIcon name="ri-message-3-line mr-2" />
                      Chat
                    </Button>
                    
                    {user.role === "admin" && (
                      <Button 
                        variant="outline"
                        className="w-full"
                        onClick={() => window.location.href = "/admin"}
                      >
                        Admin
                      </Button>
                    )}
                    
                    <Button
                      variant="ghost"
                      className="w-full"
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                    >
                      <RemixIcon name="ri-logout-box-line mr-2" />
                      Sair
                    </Button>
                  </div>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>
      
      {/* Auth Modals */}
      <AuthModals 
        showLoginModal={showLoginModal}
        showRegisterModal={showRegisterModal}
        onCloseLoginModal={() => setShowLoginModal(false)}
        onCloseRegisterModal={() => setShowRegisterModal(false)}
        onShowLoginModal={() => {
          setShowRegisterModal(false);
          setShowLoginModal(true);
        }}
        onShowRegisterModal={() => {
          setShowLoginModal(false);
          setShowRegisterModal(true);
        }}
      />
      
      {/* Chat Widget */}
      {user && showUserChat && (
        <ChatWidget 
          user={user}
          onClose={() => setShowUserChat(false)}
        />
      )}
      
      {/* WhatsApp Button */}
      <a 
        href="https://wa.me/5511999988888" 
        className="fixed bottom-5 left-5 z-40 bg-green-500 hover:bg-green-600 text-white rounded-full p-3 shadow-lg transition-colors"
        target="_blank"
        rel="noopener noreferrer"
      >
        <RemixIcon name="ri-whatsapp-line text-2xl" />
      </a>
    </>
  );
}
