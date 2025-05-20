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
    <section id="depoimentos" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-dark mb-4">Depoimentos</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            O que meus clientes dizem sobre os serviços e projetos entregues.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {isLoading ? (
            Array(4).fill(0).map((_, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 shadow-sm">
                <div className="flex items-start mb-4">
                  <Skeleton className="h-6 w-28" />
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-4/5 mb-6" />
                <div className="flex items-center">
                  <Skeleton className="h-12 w-12 rounded-full mr-4" />
                  <div>
                    <Skeleton className="h-5 w-32 mb-1" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            testimonials?.map((testimonial) => (
              <div key={testimonial.id} className="bg-gray-50 rounded-lg p-6 shadow-sm">
                <div className="flex items-start mb-4">
                  <div className="text-yellow-400 text-xl flex">
                    {renderStars(testimonial.rating)}
                  </div>
                </div>
                <p className="text-gray-600 mb-6">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full object-cover mr-4" 
                  />
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.company}</p>
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
