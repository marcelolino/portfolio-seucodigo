import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RemixIcon } from "@/components/ui/remixicon";
import { useQuery } from "@tanstack/react-query";
import { Project } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export function ProjectsSection() {
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  return (
    <section id="projetos" className="py-16 bg-background relative overflow-hidden">
      {/* Efeito de partículas neon */}
      <div className="absolute inset-0 z-0">
        {Array.from({ length: 30 }).map((_, i) => (
          <div 
            key={i} 
            className="absolute w-1 h-1 rounded-full bg-secondary opacity-70"
            style={{ 
              top: `${Math.random() * 100}%`, 
              left: `${Math.random() * 100}%`,
              animation: `neon-pulse ${2 + Math.random() * 3}s infinite ${Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4 relative inline-block">
            Projetos Recentes
            <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-accent"></span>
          </h2>
          <p className="text-foreground/80 max-w-2xl mx-auto">
            Conheça alguns dos trabalhos que desenvolvi para clientes em diferentes setores.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            Array(6).fill(0).map((_, index) => (
              <div key={index} className="bg-primary/20 border border-secondary/20 rounded-lg overflow-hidden">
                <Skeleton className="w-full h-56 bg-secondary/10" />
                <div className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2 bg-secondary/20" />
                  <Skeleton className="h-4 w-full mb-2 bg-secondary/20" />
                  <Skeleton className="h-4 w-full mb-4 bg-secondary/20" />
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Skeleton className="h-6 w-16 rounded bg-secondary/20" />
                    <Skeleton className="h-6 w-16 rounded bg-secondary/20" />
                    <Skeleton className="h-6 w-16 rounded bg-secondary/20" />
                  </div>
                  <Skeleton className="h-4 w-1/3 bg-secondary/20" />
                </div>
              </div>
            ))
          ) : (
            projects?.map((project) => (
              <div 
                key={project.id} 
                className="bg-primary/20 border border-secondary/30 rounded-lg overflow-hidden group hover:border-accent transition-all duration-300"
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80"></div>
                </div>
                <div className="p-6 relative">
                  <h3 className="text-xl font-semibold mb-2 text-foreground group-hover:text-secondary transition-colors">{project.title}</h3>
                  <p className="text-foreground/70 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies && project.technologies.map((tech, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="bg-secondary/10 text-secondary border border-secondary/20 hover:bg-secondary/20"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <a href="#" className="text-secondary hover:text-accent font-medium flex items-center gap-1 group-hover:neon-text">
                    Ver detalhes <RemixIcon name="ri-arrow-right-line" className="transition-transform group-hover:translate-x-1"/>
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="text-center mt-12">
          <Button 
            variant="outline"
            className="font-medium text-secondary hover:text-accent border border-secondary hover:border-accent neon-button"
          >
            Ver todos os projetos
          </Button>
        </div>
      </div>
    </section>
  );
}
