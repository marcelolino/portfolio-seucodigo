import { RemixIcon } from "@/components/ui/remixicon";
import { useQuery } from "@tanstack/react-query";
import { Testimonial } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export function TestimonialsSection() {
  const { data: testimonials, isLoading } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
  });

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<RemixIcon key={i} name="ri-star-fill" />);
      } else if (i - 0.5 === rating) {
        stars.push(<RemixIcon key={i} name="ri-star-half-fill" />);
      } else {
        stars.push(<RemixIcon key={i} name="ri-star-line" />);
      }
    }
    return stars;
  };

  return (
    <section id="depoimentos" className="py-16 bg-primary/40 relative overflow-hidden">
      {/* Efeito de hexágonos futuristas em segundo plano */}
      <div className="absolute inset-0 z-0 opacity-10">
        {Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={i} 
            className="absolute border border-accent"
            style={{ 
              width: `${50 + Math.random() * 100}px`,
              height: `${50 + Math.random() * 100}px`,
              top: `${Math.random() * 100}%`, 
              left: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg)`,
              opacity: Math.random() * 0.5 + 0.1
            }}
          ></div>
        ))}
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4 relative inline-block">
            Depoimentos
            <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-accent"></span>
          </h2>
          <p className="text-foreground/80 max-w-2xl mx-auto">
            O que meus clientes dizem sobre os serviços e projetos entregues.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {isLoading ? (
            Array(4).fill(0).map((_, index) => (
              <div key={index} className="bg-background/60 backdrop-blur-sm border border-secondary/30 rounded-lg p-6">
                <div className="flex items-start mb-4">
                  <Skeleton className="h-6 w-28 bg-secondary/20" />
                </div>
                <Skeleton className="h-4 w-full mb-2 bg-secondary/20" />
                <Skeleton className="h-4 w-full mb-2 bg-secondary/20" />
                <Skeleton className="h-4 w-4/5 mb-6 bg-secondary/20" />
                <div className="flex items-center">
                  <Skeleton className="h-12 w-12 rounded-full mr-4 bg-secondary/20" />
                  <div>
                    <Skeleton className="h-5 w-32 mb-1 bg-secondary/20" />
                    <Skeleton className="h-4 w-40 bg-secondary/20" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            testimonials?.map((testimonial) => (
              <div 
                key={testimonial.id} 
                className="bg-background/60 backdrop-blur-sm border border-secondary/30 rounded-lg p-6 hover:border-accent/50 transition-all duration-300 group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
                
                <div className="flex items-start mb-4 relative z-10">
                  <div className="text-secondary text-xl flex group-hover:text-accent transition-colors">
                    {renderStars(testimonial.rating)}
                  </div>
                </div>
                <p className="text-foreground/80 mb-6 relative z-10 group-hover:text-foreground transition-colors">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center relative z-10">
                  <div className="relative w-12 h-12 mr-4 rounded-full overflow-hidden neon-border">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name} 
                      className="w-12 h-12 rounded-full object-cover" 
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                    <p className="text-sm text-foreground/60">{testimonial.company}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
