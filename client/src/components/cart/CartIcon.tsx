import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useLocation } from "wouter";

export function CartIcon() {
  const { getItemCount } = useCart();
  const [, navigate] = useLocation();
  const itemCount = getItemCount();

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