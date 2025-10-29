import { X, Plus, Minus, ShoppingBag, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/use-cart';
import { Link } from 'wouter';

export function ShoppingCart() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, getTotalPrice, clearCart } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50" 
        onClick={() => setIsOpen(false)}
      />
      
      {/* Cart Panel */}
      <div className="ml-auto w-full max-w-md bg-white dark:bg-gray-900 shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Seu Carrinho</h2>
              {items.length > 0 && (
                <Badge variant="secondary">{items.length}</Badge>
              )}
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <div className="w-32 h-32 mb-6 opacity-20">
                  <svg viewBox="0 0 400 300" className="w-full h-full">
                    {/* Empty cart illustration */}
                    <rect x="50" y="50" width="300" height="200" rx="10" fill="currentColor" opacity="0.1"/>
                    <circle cx="120" cy="270" r="15" fill="currentColor" opacity="0.3"/>
                    <circle cx="280" cy="270" r="15" fill="currentColor" opacity="0.3"/>
                    <path d="M80 80 L320 80 L300 220 L100 220 Z" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
                    <line x1="150" y1="130" x2="250" y2="130" stroke="currentColor" strokeWidth="2" opacity="0.2"/>
                    <line x1="150" y1="160" x2="220" y2="160" stroke="currentColor" strokeWidth="2" opacity="0.2"/>
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">Seu carrinho está vazio</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Adicione alguns projetos ou serviços para começar
                </p>
                <Button onClick={() => setIsOpen(false)} className="bg-blue-600 hover:bg-blue-700">
                  Continuar Navegando
                </Button>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {items.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        {/* Item Image/Icon */}
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          {item.type === 'project' ? (
                            <span className="text-white font-bold text-xs">PROJ</span>
                          ) : (
                            <span className="text-white font-bold text-xs">SERV</span>
                          )}
                        </div>
                        
                        {/* Item Details */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{item.item.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            {item.type === 'project' ? 'Projeto' : 'Serviço'}
                          </p>
                          
                          {/* Price and Quantity */}
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="text-sm font-medium w-8 text-center">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-bold text-blue-600">
                                R$ {(item.price * item.quantity).toLocaleString('pt-BR', { 
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2 
                                })}
                              </div>
                              {item.quantity > 1 && (
                                <div className="text-xs text-muted-foreground">
                                  R$ {item.price.toLocaleString('pt-BR', { 
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2 
                                  })} cada
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Remove Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => removeItem(item.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t bg-gray-50 dark:bg-gray-800 p-4 space-y-4">
              {/* Total */}
              <div className="flex items-center justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-blue-600">
                  R$ {getTotalPrice().toLocaleString('pt-BR', { 
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2 
                  })}
                </span>
              </div>
              
              {/* Action Buttons */}
              <div className="space-y-2">
                <Link href="/checkout" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Finalizar Compra
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={clearCart}
                >
                  Limpar Carrinho
                </Button>
              </div>
              
              {/* Features */}
              <div className="text-xs text-muted-foreground space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                  <span>Suporte completo incluído</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                  <span>Atualizações futuras gratuitas</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                  <span>Qualidade garantida</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}