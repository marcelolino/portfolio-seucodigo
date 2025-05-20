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
    <section id="projetos" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-dark mb-4">Projetos Recentes</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Conheça alguns dos trabalhos que desenvolvi para clientes em diferentes setores.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            Array(6).fill(0).map((_, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md">
                <Skeleton className="w-full h-56" />
                <div className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Skeleton className="h-6 w-16 rounded" />
                    <Skeleton className="h-6 w-16 rounded" />
                    <Skeleton className="h-6 w-16 rounded" />
                  </div>
                  <Skeleton className="h-4 w-1/3" />
                </div>
              </div>
            ))
          ) : (
            projects?.map((project) => (
              <div key={project.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-56 object-cover" 
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <a href="#" className="text-primary hover:text-accent font-medium flex items-center gap-1">
                    Ver detalhes <RemixIcon name="ri-arrow-right-line" />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="text-center mt-12">
          <Button 
            variant="outline"
            className="font-medium text-primary hover:text-accent border border-primary hover:border-accent"
          >
            Ver todos os projetos
          </Button>
        </div>
      </div>
    </section>
  );
}
