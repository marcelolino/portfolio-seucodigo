import { useQuery } from "@tanstack/react-query";
import { RemixIcon } from "@/components/ui/remixicon";
import { SiteSettings } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export function Footer() {
  const { data: settings, isLoading } = useQuery<SiteSettings>({
    queryKey: ["/api/settings"],
  });

  return (
    <footer className="bg-primary/50 text-foreground py-12 relative overflow-hidden">
      {/* Efeito de grid digital neon */}
      <div className="absolute inset-0 z-0">
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-secondary opacity-30"></div>
        <div className="absolute top-0 left-0 w-full h-[1px] bg-secondary opacity-30"></div>
        
        {/* Linhas verticais */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={i}
            className="absolute top-0 bottom-0 w-[1px] bg-secondary opacity-10"
            style={{ left: `${(i + 1) * 5}%` }}
          ></div>
        ))}
        
        {/* Pontos de destaque */}
        {Array.from({ length: 15 }).map((_, i) => (
          <div 
            key={i}
            className="absolute w-1 h-1 rounded-full bg-accent animate-pulse"
            style={{ 
              top: `${Math.random() * 100}%`, 
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-foreground neon-text">
              {isLoading ? <Skeleton className="h-8 w-32 bg-secondary/20" /> : settings?.siteName || "SeuCodigo"}
            </h3>
            <p className="text-foreground/80 mb-4">
              {isLoading ? <Skeleton className="h-16 w-full bg-secondary/20" /> : settings?.siteTitle || "Soluções em desenvolvimento web e mobile para elevar seu negócio ao próximo nível."}
            </p>
            <div className="flex space-x-4">
              {settings?.github && (
                <a href={settings.github} target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-accent transition-colors text-xl neon-glow">
                  <RemixIcon name="ri-github-fill" />
                </a>
              )}
              {settings?.linkedin && (
                <a href={settings.linkedin} target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-accent transition-colors text-xl neon-glow">
                  <RemixIcon name="ri-linkedin-box-fill" />
                </a>
              )}
              {settings?.twitter && (
                <a href={settings.twitter} target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-accent transition-colors text-xl neon-glow">
                  <RemixIcon name="ri-twitter-fill" />
                </a>
              )}
              {settings?.instagram && (
                <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-accent transition-colors text-xl neon-glow">
                  <RemixIcon name="ri-instagram-fill" />
                </a>
              )}
              {settings?.whatsapp && (
                <a href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-accent transition-colors text-xl neon-glow">
                  <RemixIcon name="ri-whatsapp-fill" />
                </a>
              )}
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4 text-foreground relative inline-block">
              Navegação
              <span className="absolute -bottom-1 left-0 w-1/2 h-[1px] bg-accent"></span>
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#inicio" className="text-foreground/70 hover:text-secondary transition-colors group flex items-center">
                  <span className="w-0 group-hover:w-2 overflow-hidden transition-all duration-300 mr-0 group-hover:mr-1">
                    <RemixIcon name="ri-arrow-right-s-line" />
                  </span>
                  Início
                </a>
              </li>
              <li>
                <a href="#servicos" className="text-foreground/70 hover:text-secondary transition-colors group flex items-center">
                  <span className="w-0 group-hover:w-2 overflow-hidden transition-all duration-300 mr-0 group-hover:mr-1">
                    <RemixIcon name="ri-arrow-right-s-line" />
                  </span>
                  Serviços
                </a>
              </li>
              <li>
                <a href="#projetos" className="text-foreground/70 hover:text-secondary transition-colors group flex items-center">
                  <span className="w-0 group-hover:w-2 overflow-hidden transition-all duration-300 mr-0 group-hover:mr-1">
                    <RemixIcon name="ri-arrow-right-s-line" />
                  </span>
                  Projetos
                </a>
              </li>
              <li>
                <a href="#depoimentos" className="text-foreground/70 hover:text-secondary transition-colors group flex items-center">
                  <span className="w-0 group-hover:w-2 overflow-hidden transition-all duration-300 mr-0 group-hover:mr-1">
                    <RemixIcon name="ri-arrow-right-s-line" />
                  </span>
                  Depoimentos
                </a>
              </li>
              <li>
                <a href="#contato" className="text-foreground/70 hover:text-secondary transition-colors group flex items-center">
                  <span className="w-0 group-hover:w-2 overflow-hidden transition-all duration-300 mr-0 group-hover:mr-1">
                    <RemixIcon name="ri-arrow-right-s-line" />
                  </span>
                  Contato
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4 text-foreground relative inline-block">
              Serviços
              <span className="absolute -bottom-1 left-0 w-1/2 h-[1px] bg-accent"></span>
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-foreground/70 hover:text-secondary transition-colors group flex items-center">
                  <span className="w-0 group-hover:w-2 overflow-hidden transition-all duration-300 mr-0 group-hover:mr-1">
                    <RemixIcon name="ri-arrow-right-s-line" />
                  </span>
                  Desenvolvimento Web
                </a>
              </li>
              <li>
                <a href="#" className="text-foreground/70 hover:text-secondary transition-colors group flex items-center">
                  <span className="w-0 group-hover:w-2 overflow-hidden transition-all duration-300 mr-0 group-hover:mr-1">
                    <RemixIcon name="ri-arrow-right-s-line" />
                  </span>
                  Aplicativos Mobile
                </a>
              </li>
              <li>
                <a href="#" className="text-foreground/70 hover:text-secondary transition-colors group flex items-center">
                  <span className="w-0 group-hover:w-2 overflow-hidden transition-all duration-300 mr-0 group-hover:mr-1">
                    <RemixIcon name="ri-arrow-right-s-line" />
                  </span>
                  UI/UX Design
                </a>
              </li>
              <li>
                <a href="#" className="text-foreground/70 hover:text-secondary transition-colors group flex items-center">
                  <span className="w-0 group-hover:w-2 overflow-hidden transition-all duration-300 mr-0 group-hover:mr-1">
                    <RemixIcon name="ri-arrow-right-s-line" />
                  </span>
                  Consultoria
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4 text-foreground relative inline-block">
              Contato
              <span className="absolute -bottom-1 left-0 w-1/2 h-[1px] bg-accent"></span>
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center">
                <div className="text-secondary mr-2 neon-glow">
                  <RemixIcon name="ri-mail-line" />
                </div>
                <span className="text-foreground/70">
                  {isLoading ? <Skeleton className="h-4 w-32 bg-secondary/20" /> : settings?.contactEmail || "contato@seucodigo.com"}
                </span>
              </li>
              <li className="flex items-center">
                <div className="text-secondary mr-2 neon-glow">
                  <RemixIcon name="ri-phone-line" />
                </div>
                <span className="text-foreground/70">
                  {isLoading ? <Skeleton className="h-4 w-32 bg-secondary/20" /> : settings?.contactPhone || "(11) 9999-8888"}
                </span>
              </li>
              <li className="flex items-start">
                <div className="text-secondary mr-2 mt-1 neon-glow">
                  <RemixIcon name="ri-map-pin-line" />
                </div>
                <span className="text-foreground/70">
                  {isLoading ? <Skeleton className="h-12 w-full bg-secondary/20" /> : settings?.address || "Av. Paulista, 1000, São Paulo - SP"}
                </span>
              </li>
              <li className="flex items-center">
                <div className="text-secondary mr-2 neon-glow">
                  <RemixIcon name="ri-time-line" />
                </div>
                <span className="text-foreground/70">Seg - Sex: 9h às 18h</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-secondary/20 mt-8 pt-6 text-center text-foreground/50">
          <p>&copy; {new Date().getFullYear()} {settings?.siteName || "SeuCodigo"}. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}