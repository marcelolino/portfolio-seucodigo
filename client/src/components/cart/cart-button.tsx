import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useLocation } from 'wouter';

export function CartButton() {
  const { getItemCount } = useCart();
  const [, navigate] = useLocation();
  const itemCount = getItemCount();

  return (
    <Button
      variant="outline"
      size="icon"
      className="relative"
      onClick={() => navigate('/checkout')}
    >
      <ShoppingCart className="h-4 w-4" />
      {itemCount > 0 && (
        <Badge 
          variant="destructive" 
          className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
        >
          {itemCount}
        </Badge>
      )}
    </Button>
  );
}