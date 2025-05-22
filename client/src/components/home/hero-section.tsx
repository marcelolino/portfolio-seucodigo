import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section id="inicio" className="pt-20 pb-16 bg-background relative overflow-hidden">
      {/* Efeito de linhas de grade neon */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="h-full w-full grid grid-cols-12 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="border-r border-secondary h-full"></div>
          ))}
        </div>
        <div className="h-full w-full grid grid-rows-12 gap-4 absolute top-0 left-0">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="border-b border-secondary w-full"></div>
          ))}
        </div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Transforme suas ideias em <span className="text-accent neon-text">código</span>
            </h1>
            <p className="text-lg text-foreground/80 mb-8">
              Desenvolvimento web personalizado e soluções digitais para potencializar seu negócio ou projeto pessoal.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="font-medium bg-secondary hover:bg-secondary/80 text-foreground px-6 py-6 h-auto neon-button"
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
                className="font-medium border border-accent text-accent hover:bg-accent/20 hover:text-foreground px-6 py-6 h-auto neon-button"
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
            <div className="relative p-1 rounded-lg neon-border">
              <img 
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=450" 
                alt="Desenvolvimento de código web" 
                className="rounded-lg object-cover max-w-full h-auto relative z-10" 
              />
              <div className="absolute inset-0 bg-secondary/30 rounded-lg blur-xl -z-10"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
