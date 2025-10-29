import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";
import { useLocation } from "wouter";

export function CartIcon() {
  const { getTotalItems } = useCart();
  const [, navigate] = useLocation();
  const itemCount = getTotalItems();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => navigate("/checkout")}
      className="relative"
    >
      <ShoppingCart className="w-4 h-4" />
      {itemCount > 0 && (
        <Badge 
          variant="destructive" 
          className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs"
        >
          {itemCount}
        </Badge>
      )}
    </Button>
  );
}