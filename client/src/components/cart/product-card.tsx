import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Star } from 'lucide-react';
import { Project, Service } from '@shared/schema';
import { AddToCartButton } from './add-to-cart-button';
import { Link } from 'wouter';

interface ProductCardProps {
  item: Project | Service;
  type: 'project' | 'service';
}

export function ProductCard({ item, type }: ProductCardProps) {
  const price = parseFloat(String(item.price)) || 0;
  const isProject = type === 'project';

  const mainImage = isProject && 'previewImage1' in item ? item.previewImage1 : null;
  const detailsUrl = isProject ? `/project/${item.id}` : `/service/${item.id}`;

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden" data-testid={`card-${type}-${item.id}`}>
      {/* Product Image/Header */}
      <Link href={detailsUrl} className="block" data-testid={`link-${type}-details-${item.id}`}>
        <div className="relative cursor-pointer">
          {mainImage ? (
            <img 
              src={mainImage} 
              alt={item.title}
              className="w-full h-48 object-cover"
            />
          ) : (
            <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              {isProject ? (
                <div className="text-center text-white">
                  <div className="text-3xl font-bold mb-2">PROJETO</div>
                  <div className="text-sm opacity-80">
                    {'category' in item ? item.category : 'Desenvolvimento'}
                  </div>
                </div>
              ) : (
                <div className="text-center text-white">
                  <div className="text-3xl font-bold mb-2">SERVIÇO</div>
                  <div className="text-sm opacity-80">Profissional</div>
                </div>
              )}
            </div>
          )}
        
        {/* Featured Badge */}
        {'featured' in item && item.featured && (
          <Badge className="absolute top-3 left-3 bg-yellow-500 hover:bg-yellow-600">
            <Star className="w-3 h-3 mr-1" />
            Destaque
          </Badge>
        )}
        
        {/* Preview Button */}
        <Button
          variant="secondary"
          size="sm"
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Eye className="w-4 h-4 mr-1" />
          Preview
        </Button>
        </div>
      </Link>

      <CardHeader className="pb-2">
        <CardTitle className="text-lg leading-tight">{item.title}</CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {item.description}
        </p>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Technologies/Features for projects */}
        {isProject && 'technologies' in item && item.technologies && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {item.technologies.slice(0, 3).map((tech, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tech}
                </Badge>
              ))}
              {item.technologies.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{item.technologies.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Price Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">Preço Regular</div>
              <div className="text-2xl font-bold text-blue-600">
                R$ {price.toLocaleString('pt-BR', { 
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2 
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mb-4 space-y-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-1 h-1 bg-green-500 rounded-full"></div>
            <span>Atualizações futuras incluídas</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-1 h-1 bg-green-500 rounded-full"></div>
            <span>Qualidade garantida</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-1 h-1 bg-green-500 rounded-full"></div>
            <span>Suporte técnico</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <AddToCartButton 
            item={item} 
            type={type} 
            className="w-full"
            size="lg"
          />
          <Button variant="outline" size="sm" className="w-full">
            Preview ao Vivo
          </Button>
        </div>

        {/* Author Info */}
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">SC</span>
            </div>
            <div>
              <div className="text-sm font-medium">SeuCodigo</div>
              <div className="text-xs text-muted-foreground">Desenvolvedor</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}