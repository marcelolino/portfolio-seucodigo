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
      apiRequest("PUT", `/api/payment-methods/${data.id}`, data.updates),
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
      apiRequest("POST", "/api/payment-methods", data),
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
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Métodos de Pagamento</h1>
        <p className="text-gray-600">Configure os métodos de pagamento para sua plataforma</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Stripe Card */}
        {stripeMethod && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800">STRIPE</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{stripeMethod.enabled ? "ON" : "OFF"}</span>
                <Switch
                  checked={stripeMethod.enabled || false}
                  onCheckedChange={(checked) => 
                    handleUpdatePaymentMethod(stripeMethod, "enabled", checked)
                  }
                />
              </div>
            </div>

            <div className="flex justify-center mb-6">
              <div className="w-32 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-2xl">stripe</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Select
                  value={stripeMethod.config ? JSON.parse(stripeMethod.config).mode || "test" : "test"}
                  onValueChange={(value) => {
                    const config = stripeMethod.config ? JSON.parse(stripeMethod.config) : {};
                    config.mode = value;
                    handleUpdatePaymentMethod(stripeMethod, "config", JSON.stringify(config));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o modo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="test">Test</SelectItem>
                    <SelectItem value="live">Live</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="stripe-published-key" className="text-sm font-medium text-gray-700">
                  Published Key *
                </Label>
                <Input
                  id="stripe-published-key"
                  value={stripeMethod.publicKey || ""}
                  onChange={(e) => 
                    handleUpdatePaymentMethod(stripeMethod, "publicKey", e.target.value)
                  }
                  placeholder="pk_test_TYooMQauvdEDq54NiTphI7jx"
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 bg-yellow-100 px-2 py-1 rounded">
                  Payment Gateway Title
                </Label>
                <Input
                  value="Stripe"
                  readOnly
                  className="mt-1 bg-gray-50"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Logo
                </Label>
                <div className="flex items-center gap-2 mt-1">
                  <Button variant="outline" size="sm">
                    Escolher Arquivo
                  </Button>
                  <span className="text-sm text-gray-500">Nenhum arquivo escolhido</span>
                </div>
              </div>

              <Button 
                className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                onClick={() => {
                  toast({
                    title: "Sucesso",
                    description: "Configurações do Stripe salvas!",
                  });
                }}
              >
                Save
              </Button>
            </div>
          </Card>
        )}

        {/* Mercado Pago Card */}
        {mercadoPagoMethod && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800">MERCADOPAGO</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{mercadoPagoMethod.enabled ? "ON" : "OFF"}</span>
                <Switch
                  checked={mercadoPagoMethod.enabled || false}
                  onCheckedChange={(checked) => 
                    handleUpdatePaymentMethod(mercadoPagoMethod, "enabled", checked)
                  }
                />
              </div>
            </div>

            <div className="flex justify-center mb-6">
              <div className="w-32 h-20 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">mercado pago</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Select
                  value={mercadoPagoMethod.config ? JSON.parse(mercadoPagoMethod.config).mode || "test" : "test"}
                  onValueChange={(value) => {
                    const config = mercadoPagoMethod.config ? JSON.parse(mercadoPagoMethod.config) : {};
                    config.mode = value;
                    handleUpdatePaymentMethod(mercadoPagoMethod, "config", JSON.stringify(config));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o modo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="test">Test</SelectItem>
                    <SelectItem value="live">Live</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="mp-access-token" className="text-sm font-medium text-gray-700">
                  Access Token *
                </Label>
                <Input
                  id="mp-access-token"
                  value={mercadoPagoMethod.secretKey || ""}
                  onChange={(e) => 
                    handleUpdatePaymentMethod(mercadoPagoMethod, "secretKey", e.target.value)
                  }
                  placeholder="Access Token *"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="mp-public-key" className="text-sm font-medium text-gray-700">
                  Public Key *
                </Label>
                <Input
                  id="mp-public-key"
                  value={mercadoPagoMethod.publicKey || ""}
                  onChange={(e) => 
                    handleUpdatePaymentMethod(mercadoPagoMethod, "publicKey", e.target.value)
                  }
                  placeholder="Public Key *"
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 bg-yellow-100 px-2 py-1 rounded">
                  Payment Gateway Title
                </Label>
                <Input
                  value="Mercadopago"
                  readOnly
                  className="mt-1 bg-gray-50"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Logo
                </Label>
                <div className="flex items-center gap-2 mt-1">
                  <Button variant="outline" size="sm">
                    Escolher Arquivo
                  </Button>
                  <span className="text-sm text-gray-500">Nenhum arquivo escolhido</span>
                </div>
              </div>

              <Button 
                className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                onClick={() => {
                  toast({
                    title: "Sucesso", 
                    description: "Configurações do Mercado Pago salvas!",
                  });
                }}
              >
                Save
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}