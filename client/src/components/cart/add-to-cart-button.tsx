import { ShoppingCart, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { Project, Service } from '@shared/schema';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface AddToCartButtonProps {
  item: Project | Service;
  type: 'project' | 'service';
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export function AddToCartButton({ item, type, variant = 'default', size = 'default', className }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const { toast } = useToast();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    addItem(item, type);
    setIsAdded(true);
    
    toast({
      title: "Item adicionado!",
      description: `${item.title} foi adicionado ao seu carrinho.`,
    });

    // Reset the button state after 2 seconds
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  if (isAdded) {
    return (
      <Button
        variant="outline"
        size={size}
        className={`bg-green-50 border-green-200 text-green-700 hover:bg-green-50 ${className}`}
        disabled
      >
        <Check className="mr-2 h-4 w-4" />
        Adicionado
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={`bg-blue-600 hover:bg-blue-700 text-white ${className}`}
      onClick={handleAddToCart}
    >
      <ShoppingCart className="mr-2 h-4 w-4" />
      Adicionar ao Carrinho
    </Button>
  );
}