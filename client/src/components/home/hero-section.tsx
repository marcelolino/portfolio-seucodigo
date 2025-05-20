import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section id="inicio" className="pt-20 pb-16 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-dark mb-6">
              Transforme suas ideias em <span className="text-primary">código</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Desenvolvimento web personalizado e soluções digitais para potencializar seu negócio ou projeto pessoal.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="font-medium text-white px-6 py-6 h-auto"
                onClick={() => {
                  const projectsSection = document.getElementById("projetos");
                  if (projectsSection) {
                    projectsSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                Ver Projetos
              </Button>
              <Button 
                variant="outline"
                className="font-medium border border-primary text-primary hover:bg-primary hover:text-white px-6 py-6 h-auto"
                onClick={() => {
                  const contactSection = document.getElementById("contato");
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                Fale Comigo
              </Button>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex justify-center">
            <img 
              src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=450" 
              alt="Desenvolvimento de código web" 
              className="rounded-lg shadow-xl object-cover max-w-full h-auto" 
            />
          </div>
        </div>
      </div>
    </section>
  );
}
