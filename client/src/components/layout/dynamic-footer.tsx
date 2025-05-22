import { useQuery } from "@tanstack/react-query";
import { RemixIcon } from "@/components/ui/remixicon";
import { SiteSettings } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export function Footer() {
  const { data: settings, isLoading } = useQuery<SiteSettings>({
    queryKey: ["/api/settings"],
  });

  return (
    <footer className="bg-dark text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">{isLoading ? <Skeleton className="h-8 w-32" /> : settings?.siteName || "SeuCodigo"}</h3>
            <p className="text-gray-300 mb-4">{isLoading ? <Skeleton className="h-16 w-full" /> : settings?.siteTitle || "Soluções em desenvolvimento web e mobile para elevar seu negócio ao próximo nível."}</p>
            <div className="flex space-x-4">
              {settings?.github && (
                <a href={settings.github} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                  <RemixIcon name="ri-github-fill text-xl" />
                </a>
              )}
              {settings?.linkedin && (
                <a href={settings.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                  <RemixIcon name="ri-linkedin-box-fill text-xl" />
                </a>
              )}
              {settings?.twitter && (
                <a href={settings.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                  <RemixIcon name="ri-twitter-fill text-xl" />
                </a>
              )}
              {settings?.instagram && (
                <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                  <RemixIcon name="ri-instagram-fill text-xl" />
                </a>
              )}
              {settings?.whatsapp && (
                <a href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                  <RemixIcon name="ri-whatsapp-fill text-xl" />
                </a>
              )}
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4">Navegação</h4>
            <ul className="space-y-2">
              <li><a href="#inicio" className="text-gray-300 hover:text-white transition-colors">Início</a></li>
              <li><a href="#servicos" className="text-gray-300 hover:text-white transition-colors">Serviços</a></li>
              <li><a href="#projetos" className="text-gray-300 hover:text-white transition-colors">Projetos</a></li>
              <li><a href="#depoimentos" className="text-gray-300 hover:text-white transition-colors">Depoimentos</a></li>
              <li><a href="#contato" className="text-gray-300 hover:text-white transition-colors">Contato</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4">Serviços</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Desenvolvimento Web</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Aplicativos Mobile</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">UI/UX Design</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Consultoria</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4">Contato</h4>
            <ul className="space-y-3">
              <li className="flex items-center">
                <RemixIcon name="ri-mail-line mr-2" />
                <span className="text-gray-300">{isLoading ? <Skeleton className="h-4 w-32" /> : settings?.contactEmail || "contato@seucodigo.com"}</span>
              </li>
              <li className="flex items-center">
                <RemixIcon name="ri-phone-line mr-2" />
                <span className="text-gray-300">{isLoading ? <Skeleton className="h-4 w-32" /> : settings?.contactPhone || "(11) 9999-8888"}</span>
              </li>
              <li className="flex items-start">
                <RemixIcon name="ri-map-pin-line mr-2 mt-1" />
                <span className="text-gray-300">{isLoading ? <Skeleton className="h-12 w-full" /> : settings?.address || "Av. Paulista, 1000, São Paulo - SP"}</span>
              </li>
              <li className="flex items-center">
                <RemixIcon name="ri-time-line mr-2" />
                <span className="text-gray-300">Seg - Sex: 9h às 18h</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} {settings?.siteName || "SeuCodigo"}. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}