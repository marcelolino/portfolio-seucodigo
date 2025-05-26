import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RemixIcon } from "@/components/ui/remixicon";
import { useQuery } from "@tanstack/react-query";
import { Project } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/cart/product-card";

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
            Array(3).fill(0).map((_, index) => (
              <div key={index} className="bg-primary/20 border border-secondary/20 rounded-lg overflow-hidden">
                <Skeleton className="w-full h-48 bg-secondary/10" />
                <div className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2 bg-secondary/20" />
                  <Skeleton className="h-4 w-full mb-2 bg-secondary/20" />
                  <Skeleton className="h-4 w-full mb-4 bg-secondary/20" />
                  <Skeleton className="h-10 w-full bg-secondary/20" />
                </div>
              </div>
            ))
          ) : (
            projects?.map((project) => (
              <ProductCard 
                key={project.id}
                item={project}
                type="project"
              />
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
