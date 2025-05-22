import { RemixIcon } from "@/components/ui/remixicon";
import { useQuery } from "@tanstack/react-query";
import { Service } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export function ServicesSection() {
  const { data: services, isLoading } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  return (
    <section id="servicos" className="py-16 bg-primary/30 relative overflow-hidden">
      {/* Efeito de linhas diagonais neon */}
      <div className="absolute inset-0 opacity-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div 
            key={i} 
            className="absolute h-[1px] w-full bg-secondary"
            style={{ 
              transform: `rotate(${i * 9}deg)`, 
              top: `${i * 10}%`,
              left: 0
            }}
          ></div>
        ))}
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4 relative inline-block">
            Serviços
            <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-accent"></span>
          </h2>
          <p className="text-foreground/80 max-w-2xl mx-auto">
            Oferecemos soluções completas para suas necessidades digitais, desde design até implementação e manutenção.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {isLoading ? (
            Array(4).fill(0).map((_, index) => (
              <div key={index} className="bg-background/80 border border-secondary/30 rounded-lg p-6">
                <Skeleton className="h-12 w-12 mb-4 rounded-full bg-secondary/20" />
                <Skeleton className="h-6 w-3/4 mb-3 bg-secondary/20" />
                <Skeleton className="h-4 w-full mb-2 bg-secondary/20" />
                <Skeleton className="h-4 w-full mb-2 bg-secondary/20" />
                <Skeleton className="h-4 w-2/3 mb-4 bg-secondary/20" />
                <Skeleton className="h-4 w-1/3 bg-secondary/20" />
              </div>
            ))
          ) : (
            services?.map((service) => (
              <div 
                key={service.id} 
                className="bg-background/60 backdrop-blur-sm border border-secondary/30 rounded-lg p-6 hover:border-accent/50 transition-all duration-300 group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-accent/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
                <div className="text-secondary text-4xl mb-4 group-hover:text-accent transition-colors relative z-10 neon-glow">
                  <RemixIcon name={service.icon} />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground relative z-10">{service.title}</h3>
                <p className="text-foreground/70 mb-4 relative z-10">{service.description}</p>
                <a href="#" className="text-secondary hover:text-accent font-medium flex items-center gap-1 relative z-10 group-hover:neon-text">
                  Saiba mais <RemixIcon name="ri-arrow-right-line" />
                </a>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
