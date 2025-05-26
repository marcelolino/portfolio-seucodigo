import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { UserProfileDropdown } from "./user-profile-dropdown";
import { CartButton } from "@/components/cart/cart-button";
import { RemixIcon } from "@/components/ui/remixicon";
import { useQuery } from "@tanstack/react-query";
import { SiteSettings } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export function Header() {
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { data: settings } = useQuery<SiteSettings>({
    queryKey: ["/api/settings"],
  });

  // Monitorar scroll para adicionar fundo ao cabeçalho
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-dark/90 backdrop-blur-md py-3 shadow-lg" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="text-white flex items-center gap-2">
            {settings?.logo ? (
              <img src={settings.logo} alt={settings?.siteName || "SeuCodigo"} className="h-10" />
            ) : (
              <span className="text-xl font-bold text-primary">{settings?.siteName || "SeuCodigo"}</span>
            )}
          </Link>

          {/* Menu Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#inicio" className="text-white hover:text-primary transition-colors">Início</a>
            <a href="#servicos" className="text-white hover:text-primary transition-colors">Serviços</a>
            <a href="#projetos" className="text-white hover:text-primary transition-colors">Projetos</a>
            <a href="#depoimentos" className="text-white hover:text-primary transition-colors">Depoimentos</a>
            <a href="#contato" className="text-white hover:text-primary transition-colors">Contato</a>
            
            <CartButton />
            
            {user ? (
              <UserProfileDropdown />
            ) : (
              <Link href="/auth">
                <Button variant="outline" className="border-[#00A8E8] text-[#00A8E8] hover:bg-[#00A8E8] hover:text-white">
                  Login
                </Button>
              </Link>
            )}
          </nav>

          {/* Menu Mobile Toggle */}
          <button 
            className="md:hidden text-white text-2xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <RemixIcon name={menuOpen ? "ri-close-line" : "ri-menu-line"} />
          </button>
        </div>

        {/* Menu Mobile */}
        <nav className={`md:hidden ${menuOpen ? "block" : "hidden"} py-4 transition-all duration-300`}>
          <div className="flex flex-col space-y-4">
            <a 
              href="#inicio" 
              className="text-white hover:text-primary transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Início
            </a>
            <a 
              href="#servicos" 
              className="text-white hover:text-primary transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Serviços
            </a>
            <a 
              href="#projetos" 
              className="text-white hover:text-primary transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Projetos
            </a>
            <a 
              href="#depoimentos" 
              className="text-white hover:text-primary transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Depoimentos
            </a>
            <a 
              href="#contato" 
              className="text-white hover:text-primary transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Contato
            </a>
            
            <div onClick={() => setMenuOpen(false)}>
              <CartButton />
            </div>
            
            {user ? (
              <div onClick={() => setMenuOpen(false)}>
                <UserProfileDropdown />
              </div>
            ) : (
              <Link href="/auth">
                <Button 
                  variant="outline" 
                  className="border-[#00A8E8] text-[#00A8E8] hover:bg-[#00A8E8] hover:text-white"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Button>
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}