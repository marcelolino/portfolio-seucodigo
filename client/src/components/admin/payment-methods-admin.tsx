import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { PaymentMethod, InsertPaymentMethod } from "@shared/schema";
import { Loader2, CreditCard, DollarSign, Globe, Key, Eye, EyeOff } from "lucide-react";

export function PaymentMethodsAdmin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedProvider, setSelectedProvider] = useState<string>("stripe");
  const [showSecrets, setShowSecrets] = useState<{ [key: string]: boolean }>({});

  const { data: paymentMethods = [], isLoading } = useQuery<PaymentMethod[]>({
    queryKey: ["/api/payment-methods"],
  });

  const updatePaymentMethodMutation = useMutation({
    mutationFn: (data: { id: number; updates: Partial<InsertPaymentMethod> }) =>
      apiRequest(`/api/payment-methods/${data.id}`, "PUT", data.updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payment-methods"] });
      toast({
        title: "Sucesso",
        description: "Método de pagamento atualizado com sucesso!",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao atualizar método de pagamento",
        variant: "destructive",
      });
    },
  });

  const createPaymentMethodMutation = useMutation({
    mutationFn: (data: InsertPaymentMethod) =>
      apiRequest("/api/payment-methods", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payment-methods"] });
      toast({
        title: "Sucesso",
        description: "Método de pagamento criado com sucesso!",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao criar método de pagamento",
        variant: "destructive",
      });
    },
  });

  // Initialize payment methods if they don't exist
  useEffect(() => {
    const initializePaymentMethods = async () => {
      if (paymentMethods.length === 0 && !isLoading) {
        // Create default Stripe configuration
        const stripeData: InsertPaymentMethod = {
          provider: "stripe",
          name: "Stripe",
          enabled: false,
          currency: "BRL",
          publicKey: "",
          secretKey: "",
          webhookSecret: "",
          logo: "https://stripe.com/img/v3/home/social.png",
          config: JSON.stringify({
            supportedPaymentMethods: ["card", "pix"]
          })
        };

        // Create default Mercado Pago configuration
        const mercadoPagoData: InsertPaymentMethod = {
          provider: "mercadopago",
          name: "Mercado Pago",
          enabled: false,
          currency: "BRL",
          publicKey: "",
          secretKey: "",
          webhookSecret: "",
          logo: "https://http2.mlstatic.com/frontend-assets/ui-navigation/5.18.9/mercadopago/logo__large_plus.png",
          config: JSON.stringify({
            supportedPaymentMethods: ["pix", "credit_card", "boleto"]
          })
        };

        try {
          await createPaymentMethodMutation.mutateAsync(stripeData);
          await createPaymentMethodMutation.mutateAsync(mercadoPagoData);
        } catch (error) {
          console.error("Error initializing payment methods:", error);
        }
      }
    };

    initializePaymentMethods();
  }, [paymentMethods, isLoading]);

  const stripeMethod = paymentMethods.find(pm => pm.provider === "stripe");
  const mercadoPagoMethod = paymentMethods.find(pm => pm.provider === "mercadopago");

  const toggleSecret = (field: string) => {
    setShowSecrets(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleUpdatePaymentMethod = (paymentMethod: PaymentMethod, field: string, value: any) => {
    updatePaymentMethodMutation.mutate({
      id: paymentMethod.id,
      updates: { [field]: value }
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const currentMethod = selectedProvider === "stripe" ? stripeMethod : mercadoPagoMethod;

  return (
    <div className="h-full flex bg-gray-50">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-white border-b px-6 py-4 z-10">
        <h1 className="text-xl font-semibold text-gray-900">Métodos de Pagamento</h1>
      </div>

      {/* Sidebar */}
      <div className="w-80 bg-white border-r pt-20">
        <div className="p-4">
          <div className="space-y-2">
            <Button
              variant={selectedProvider === "paypal" ? "default" : "ghost"}
              className="w-full justify-start text-left h-auto py-3 px-4"
              onClick={() => setSelectedProvider("paypal")}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">P</span>
                </div>
                <span>Paypal</span>
              </div>
            </Button>
            
            <Button
              variant={selectedProvider === "stripe" ? "default" : "ghost"}
              className="w-full justify-start text-left h-auto py-3 px-4"
              onClick={() => setSelectedProvider("stripe")}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">S</span>
                </div>
                <span>Stripe</span>
              </div>
            </Button>
            
            <Button
              variant={selectedProvider === "razorpay" ? "default" : "ghost"}
              className="w-full justify-start text-left h-auto py-3 px-4"
              onClick={() => setSelectedProvider("razorpay")}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">R</span>
                </div>
                <span>Razorpay</span>
              </div>
            </Button>
            
            <Button
              variant={selectedProvider === "flutterwave" ? "default" : "ghost"}
              className="w-full justify-start text-left h-auto py-3 px-4"
              onClick={() => setSelectedProvider("flutterwave")}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">F</span>
                </div>
                <span>Flutterwave</span>
              </div>
            </Button>
            
            <Button
              variant={selectedProvider === "mollie" ? "default" : "ghost"}
              className="w-full justify-start text-left h-auto py-3 px-4"
              onClick={() => setSelectedProvider("mollie")}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">M</span>
                </div>
                <span>Mollie</span>
              </div>
            </Button>
            
            <Button
              variant={selectedProvider === "mercadopago" ? "default" : "ghost"}
              className="w-full justify-start text-left h-auto py-3 px-4"
              onClick={() => setSelectedProvider("mercadopago")}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-400 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">MP</span>
                </div>
                <span>PayStack</span>
              </div>
            </Button>
            
            <Button
              variant={selectedProvider === "instamojo" ? "default" : "ghost"}
              className="w-full justify-start text-left h-auto py-3 px-4"
              onClick={() => setSelectedProvider("instamojo")}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-pink-500 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">I</span>
                </div>
                <span>Instamojo</span>
              </div>
            </Button>
            
            <Button
              variant={selectedProvider === "banktransfer" ? "default" : "ghost"}
              className="w-full justify-start text-left h-auto py-3 px-4"
              onClick={() => setSelectedProvider("banktransfer")}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">B</span>
                </div>
                <span>Bank Account</span>
              </div>
            </Button>
            
            <Button
              variant={selectedProvider === "sslcommerz" ? "default" : "ghost"}
              className="w-full justify-start text-left h-auto py-3 px-4"
              onClick={() => setSelectedProvider("sslcommerz")}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">S</span>
                </div>
                <span>Sslcommerz</span>
              </div>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 pt-20">
        {selectedProvider === "stripe" && stripeMethod && (
          <div className="p-6">
            <div className="max-w-2xl">
              {/* Status Toggle */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold">Status do Stripe</h2>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant={stripeMethod.enabled ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleUpdatePaymentMethod(stripeMethod, "enabled", true)}
                  >
                    Ativar
                  </Button>
                  <Button
                    variant={!stripeMethod.enabled ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleUpdatePaymentMethod(stripeMethod, "enabled", false)}
                  >
                    Desativar
                  </Button>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="stripe-key" className="text-sm font-medium text-gray-700">
                    Chave do Stripe
                  </Label>
                  <Input
                    id="stripe-key"
                    value={stripeMethod.publicKey || ""}
                    onChange={(e) => 
                      handleUpdatePaymentMethod(stripeMethod, "publicKey", e.target.value)
                    }
                    placeholder="pk_test_TJBgDbPwm72JBTwJwxA2fRMwjJJqkwgbqOubibtRMmrnK1YBEBSKtjaiMc6GQnOpqGUBnP2gFgFB2DNt2qKcPlsqb300qQgN0QS3"
                    className="font-mono text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stripe-secret" className="text-sm font-medium text-gray-700">
                    Chave Secreta do Stripe
                  </Label>
                  <Input
                    id="stripe-secret"
                    value={stripeMethod.secretKey || ""}
                    onChange={(e) => 
                      handleUpdatePaymentMethod(stripeMethod, "secretKey", e.target.value)
                    }
                    placeholder="sk_test_51L8gJoSRrnr72JBTwJwJJzqkwgbqOubibtRMmrnK1YBEBSKtjaiMc6GQnOpqGUBnP2gFgFB2DNt2qKcPlsqb300qQgNkm"
                    className="font-mono text-sm"
                  />
                </div>

                <div className="space-y-4">
                  <Label className="text-sm font-medium text-gray-700">
                    Imagem Existente
                  </Label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-12 bg-blue-600 rounded flex items-center justify-center">
                      <span className="text-white font-bold text-lg">stripe</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Imagem Existente
                  </Label>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      Escolher Arquivo
                    </Button>
                    <span className="text-sm text-gray-500">Nenhum arquivo escolhido</span>
                  </div>
                </div>

                <div className="pt-4">
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                    onClick={() => {
                      toast({
                        title: "Sucesso",
                        description: "Configurações do Stripe atualizadas!",
                      });
                    }}
                  >
                    Atualizar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedProvider === "mercadopago" && mercadoPagoMethod && (
          <div className="p-6">
            <div className="max-w-2xl">
              {/* Status Toggle */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold">Status do Mercado Pago</h2>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant={mercadoPagoMethod.enabled ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleUpdatePaymentMethod(mercadoPagoMethod, "enabled", true)}
                  >
                    Ativar
                  </Button>
                  <Button
                    variant={!mercadoPagoMethod.enabled ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleUpdatePaymentMethod(mercadoPagoMethod, "enabled", false)}
                  >
                    Desativar
                  </Button>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="mp-public-key" className="text-sm font-medium text-gray-700">
                    Chave Pública
                  </Label>
                  <Input
                    id="mp-public-key"
                    value={mercadoPagoMethod.publicKey || ""}
                    onChange={(e) => 
                      handleUpdatePaymentMethod(mercadoPagoMethod, "publicKey", e.target.value)
                    }
                    placeholder="APP_USR_..."
                    className="font-mono text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mp-access-token" className="text-sm font-medium text-gray-700">
                    Access Token
                  </Label>
                  <Input
                    id="mp-access-token"
                    value={mercadoPagoMethod.secretKey || ""}
                    onChange={(e) => 
                      handleUpdatePaymentMethod(mercadoPagoMethod, "secretKey", e.target.value)
                    }
                    placeholder="APP_USR_..."
                    className="font-mono text-sm"
                  />
                </div>

                <div className="pt-4">
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                    onClick={() => {
                      toast({
                        title: "Sucesso",
                        description: "Configurações do Mercado Pago atualizadas!",
                      });
                    }}
                  >
                    Atualizar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Default view for other providers */}
        {!["stripe", "mercadopago"].includes(selectedProvider) && (
          <div className="p-6">
            <div className="max-w-2xl">
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-500 mb-2">
                  {selectedProvider.charAt(0).toUpperCase() + selectedProvider.slice(1)}
                </h3>
                <p className="text-gray-400">
                  Configuração em desenvolvimento
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}