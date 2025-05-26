import { RemixIcon } from "@/components/ui/remixicon";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Service } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/cart/product-card";

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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            Array(3).fill(0).map((_, index) => (
              <div key={index} className="bg-background/80 border border-secondary/30 rounded-lg p-6">
                <Skeleton className="h-48 w-full mb-4 rounded-lg bg-secondary/20" />
                <Skeleton className="h-6 w-3/4 mb-3 bg-secondary/20" />
                <Skeleton className="h-4 w-full mb-2 bg-secondary/20" />
                <Skeleton className="h-4 w-full mb-2 bg-secondary/20" />
                <Skeleton className="h-10 w-full bg-secondary/20" />
              </div>
            ))
          ) : (
            services?.map((service) => (
              <ProductCard 
                key={service.id}
                item={service}
                type="service"
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
