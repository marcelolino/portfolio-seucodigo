import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/use-cart';

export function CartButton() {
  const { getTotalItems, setIsOpen } = useCart();
  const totalItems = getTotalItems();

  return (
    <Button
      variant="outline"
      size="icon"
      className="relative"
      onClick={() => setIsOpen(true)}
    >
      <ShoppingCart className="h-4 w-4" />
      {totalItems > 0 && (
        <Badge 
          variant="destructive" 
          className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
        >
          {totalItems}
        </Badge>
      )}
    </Button>
  );
}