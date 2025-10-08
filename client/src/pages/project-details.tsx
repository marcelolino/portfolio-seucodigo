import { useQuery } from '@tanstack/react-query';
import { useRoute } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { Link } from 'wouter';
import { Project } from '@shared/schema';
import { AddToCartButton } from '@/components/cart/add-to-cart-button';

export default function ProjectDetails() {
  const [, params] = useRoute('/project/:id');
  const projectId = params?.id;

  const { data: project, isLoading, isError } = useQuery<Project>({
    queryKey: ['/api/projects', projectId],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${projectId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch project');
      }
      return response.json();
    },
    enabled: !!projectId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-20">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
            <div className="h-96 bg-gray-300 rounded mb-8"></div>
            <div className="h-40 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-4">
            {isError ? 'Erro ao carregar projeto' : 'Projeto não encontrado'}
          </h1>
          <p className="text-gray-600 mb-6">
            {isError ? 'Ocorreu um erro ao buscar as informações do projeto.' : 'O projeto solicitado não existe.'}
          </p>
          <Link href="/">
            <Button data-testid="button-back-home">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const price = parseFloat(String(project.price)) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-20">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link href="/">
          <Button variant="ghost" className="mb-8" data-testid="button-back">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <Card className="overflow-hidden">
              <img
                src={project.previewImage1 || ''}
                alt={project.title}
                className="w-full h-96 object-cover"
                data-testid={`img-main-${project.id}`}
              />
            </Card>

            {/* Additional Images Grid */}
            {(project.previewImage2 || project.previewImage3 || project.previewImage4) && (
              <div className="grid grid-cols-3 gap-4">
                {project.previewImage2 && (
                  <Card className="overflow-hidden">
                    <img
                      src={project.previewImage2}
                      alt={`${project.title} - Preview 2`}
                      className="w-full h-32 object-cover"
                      data-testid={`img-preview-2-${project.id}`}
                    />
                  </Card>
                )}
                {project.previewImage3 && (
                  <Card className="overflow-hidden">
                    <img
                      src={project.previewImage3}
                      alt={`${project.title} - Preview 3`}
                      className="w-full h-32 object-cover"
                      data-testid={`img-preview-3-${project.id}`}
                    />
                  </Card>
                )}
                {project.previewImage4 && (
                  <Card className="overflow-hidden">
                    <img
                      src={project.previewImage4}
                      alt={`${project.title} - Preview 4`}
                      className="w-full h-32 object-cover"
                      data-testid={`img-preview-4-${project.id}`}
                    />
                  </Card>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2" data-testid={`text-title-${project.id}`}>
                {project.title}
              </h1>
              <p className="text-gray-600" data-testid={`text-category-${project.id}`}>
                {project.category}
              </p>
            </div>

            {/* Technologies */}
            {project.technologies && project.technologies.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Tecnologias</h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <Badge key={index} variant="outline" data-testid={`badge-tech-${index}`}>
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Descrição</h3>
              <p className="text-gray-700 leading-relaxed" data-testid={`text-description-${project.id}`}>
                {project.description}
              </p>
            </div>

            {/* Price */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Preço</p>
                    <p className="text-3xl font-bold text-blue-600" data-testid={`text-price-${project.id}`}>
                      R$ {price.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </p>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <AddToCartButton
                  item={project}
                  type="project"
                  className="w-full"
                  size="lg"
                  data-testid={`button-add-cart-${project.id}`}
                />
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">O que está incluído</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">Código fonte completo</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">Documentação técnica</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">Atualizações futuras incluídas</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">Suporte técnico</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">Qualidade garantida</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
