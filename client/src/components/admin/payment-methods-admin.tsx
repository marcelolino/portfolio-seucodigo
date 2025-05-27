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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Métodos de Pagamento</h2>
          <p className="text-muted-foreground">
            Configure os métodos de pagamento disponíveis na sua plataforma
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stripe Configuration */}
        {stripeMethod && (
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-8 bg-[#635BFF] rounded flex items-center justify-center">
                    <span className="text-white font-bold text-xs">stripe</span>
                  </div>
                  <div>
                    <CardTitle className="text-lg">Stripe</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Processamento global de pagamentos
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={stripeMethod.enabled ? "default" : "secondary"}>
                    {stripeMethod.enabled ? "Ativo" : "Inativo"}
                  </Badge>
                  <Switch
                    checked={stripeMethod.enabled}
                    onCheckedChange={(checked) => 
                      handleUpdatePaymentMethod(stripeMethod, "enabled", checked)
                    }
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="stripe-currency">Moeda</Label>
                <Select
                  value={stripeMethod.currency || "BRL"}
                  onValueChange={(value) => 
                    handleUpdatePaymentMethod(stripeMethod, "currency", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BRL">Real Brasileiro (BRL)</SelectItem>
                    <SelectItem value="USD">Dólar Americano (USD)</SelectItem>
                    <SelectItem value="EUR">Euro (EUR)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stripe-public-key">Chave Pública</Label>
                <div className="relative">
                  <Input
                    id="stripe-public-key"
                    type={showSecrets["stripe-public"] ? "text" : "password"}
                    value={stripeMethod.publicKey || ""}
                    onChange={(e) => 
                      handleUpdatePaymentMethod(stripeMethod, "publicKey", e.target.value)
                    }
                    placeholder="pk_test_..."
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => toggleSecret("stripe-public")}
                  >
                    {showSecrets["stripe-public"] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stripe-secret-key">Chave Secreta</Label>
                <div className="relative">
                  <Input
                    id="stripe-secret-key"
                    type={showSecrets["stripe-secret"] ? "text" : "password"}
                    value={stripeMethod.secretKey || ""}
                    onChange={(e) => 
                      handleUpdatePaymentMethod(stripeMethod, "secretKey", e.target.value)
                    }
                    placeholder="sk_test_..."
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => toggleSecret("stripe-secret")}
                  >
                    {showSecrets["stripe-secret"] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stripe-webhook-secret">Webhook Secret</Label>
                <div className="relative">
                  <Input
                    id="stripe-webhook-secret"
                    type={showSecrets["stripe-webhook"] ? "text" : "password"}
                    value={stripeMethod.webhookSecret || ""}
                    onChange={(e) => 
                      handleUpdatePaymentMethod(stripeMethod, "webhookSecret", e.target.value)
                    }
                    placeholder="whsec_..."
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => toggleSecret("stripe-webhook")}
                  >
                    {showSecrets["stripe-webhook"] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-blue-800 dark:text-blue-200">
                  <Globe className="h-4 w-4" />
                  <span>Aceita cartões internacionais e PIX</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Mercado Pago Configuration */}
        {mercadoPagoMethod && (
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-8 bg-[#009EE3] rounded flex items-center justify-center">
                    <span className="text-white font-bold text-xs">MP</span>
                  </div>
                  <div>
                    <CardTitle className="text-lg">Mercado Pago</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Pagamentos para América Latina
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={mercadoPagoMethod.enabled ? "default" : "secondary"}>
                    {mercadoPagoMethod.enabled ? "Ativo" : "Inativo"}
                  </Badge>
                  <Switch
                    checked={mercadoPagoMethod.enabled}
                    onCheckedChange={(checked) => 
                      handleUpdatePaymentMethod(mercadoPagoMethod, "enabled", checked)
                    }
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mp-currency">Moeda</Label>
                <Select
                  value={mercadoPagoMethod.currency || "BRL"}
                  onValueChange={(value) => 
                    handleUpdatePaymentMethod(mercadoPagoMethod, "currency", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BRL">Real Brasileiro (BRL)</SelectItem>
                    <SelectItem value="ARS">Peso Argentino (ARS)</SelectItem>
                    <SelectItem value="MXN">Peso Mexicano (MXN)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mp-public-key">Chave Pública</Label>
                <div className="relative">
                  <Input
                    id="mp-public-key"
                    type={showSecrets["mp-public"] ? "text" : "password"}
                    value={mercadoPagoMethod.publicKey || ""}
                    onChange={(e) => 
                      handleUpdatePaymentMethod(mercadoPagoMethod, "publicKey", e.target.value)
                    }
                    placeholder="APP_USR_..."
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => toggleSecret("mp-public")}
                  >
                    {showSecrets["mp-public"] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mp-secret-key">Access Token</Label>
                <div className="relative">
                  <Input
                    id="mp-secret-key"
                    type={showSecrets["mp-secret"] ? "text" : "password"}
                    value={mercadoPagoMethod.secretKey || ""}
                    onChange={(e) => 
                      handleUpdatePaymentMethod(mercadoPagoMethod, "secretKey", e.target.value)
                    }
                    placeholder="APP_USR_..."
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => toggleSecret("mp-secret")}
                  >
                    {showSecrets["mp-secret"] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mp-webhook-secret">Webhook Secret</Label>
                <div className="relative">
                  <Input
                    id="mp-webhook-secret"
                    type={showSecrets["mp-webhook"] ? "text" : "password"}
                    value={mercadoPagoMethod.webhookSecret || ""}
                    onChange={(e) => 
                      handleUpdatePaymentMethod(mercadoPagoMethod, "webhookSecret", e.target.value)
                    }
                    placeholder="webhook_secret_..."
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => toggleSecret("mp-webhook")}
                  >
                    {showSecrets["mp-webhook"] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-green-800 dark:text-green-200">
                  <DollarSign className="h-4 w-4" />
                  <span>PIX, boleto, cartões e saldo MP</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Como obter as chaves de API
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Stripe</h4>
              <ol className="text-sm text-muted-foreground space-y-1">
                <li>1. Acesse o dashboard do Stripe</li>
                <li>2. Vá em "Developers" → "API Keys"</li>
                <li>3. Copie a chave pública e secreta</li>
                <li>4. Configure webhooks em "Webhooks"</li>
              </ol>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Mercado Pago</h4>
              <ol className="text-sm text-muted-foreground space-y-1">
                <li>1. Acesse suas credenciais MP</li>
                <li>2. Copie o Public Key e Access Token</li>
                <li>3. Configure as notificações IPN</li>
                <li>4. Teste em modo sandbox primeiro</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}