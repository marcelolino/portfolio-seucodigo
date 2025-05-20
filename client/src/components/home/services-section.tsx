import { RemixIcon } from "@/components/ui/remixicon";
import { useQuery } from "@tanstack/react-query";
import { Service } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export function ServicesSection() {
  const { data: services, isLoading } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  return (
    <section id="servicos" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-dark mb-4">Serviços</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Oferecemos soluções completas para suas necessidades digitais, desde design até implementação e manutenção.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {isLoading ? (
            Array(4).fill(0).map((_, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 shadow-sm">
                <Skeleton className="h-12 w-12 mb-4 rounded-full" />
                <Skeleton className="h-6 w-3/4 mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            ))
          ) : (
            services?.map((service) => (
              <div key={service.id} className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-primary text-4xl mb-4">
                  <RemixIcon name={service.icon} />
                </div>
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <a href="#" className="text-primary hover:text-accent font-medium flex items-center gap-1">
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
