import { RemixIcon } from "@/components/ui/remixicon";

export function Footer() {
  return (
    <footer className="bg-dark text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">SeuCodigo</h3>
            <p className="text-gray-300 mb-4">Soluções em desenvolvimento web e mobile para elevar seu negócio ao próximo nível.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <RemixIcon name="ri-github-fill text-xl" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <RemixIcon name="ri-linkedin-box-fill text-xl" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <RemixIcon name="ri-twitter-fill text-xl" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <RemixIcon name="ri-instagram-fill text-xl" />
              </a>
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
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Desenvolvimento Mobile</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">UI/UX Design</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Consultoria</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Hospedagem</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4">Contato</h4>
            <ul className="space-y-2">
              <li className="flex items-center">
                <RemixIcon name="ri-map-pin-line mr-2" />
                <span className="text-gray-300">São Paulo, SP - Brasil</span>
              </li>
              <li className="flex items-center">
                <RemixIcon name="ri-mail-line mr-2" />
                <span className="text-gray-300">contato@seucodigo.com</span>
              </li>
              <li className="flex items-center">
                <RemixIcon name="ri-phone-line mr-2" />
                <span className="text-gray-300">(11) 9999-8888</span>
              </li>
              <li className="flex items-center">
                <RemixIcon name="ri-time-line mr-2" />
                <span className="text-gray-300">Seg - Sex: 9h às 18h</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} SeuCodigo. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
