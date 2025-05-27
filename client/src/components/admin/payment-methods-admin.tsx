import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { PaymentMethod, InsertPaymentMethod } from "@shared/schema";
import { Loader2, CreditCard, DollarSign, Globe, Key, Settings, CheckCircle, AlertCircle } from "lucide-react";

export function PaymentMethodsAdmin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: paymentMethods = [], isLoading } = useQuery<PaymentMethod[]>({
    queryKey: ["/api/payment-methods"],
  });

  const updatePaymentMethodMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<InsertPaymentMethod> }) => {
      const res = await apiRequest("PATCH", `/api/payment-methods/${id}`, updates);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payment-methods"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    },
  });

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

  const stripeMethod = paymentMethods.find(pm => pm.provider === "stripe");
  const mercadoPagoMethod = paymentMethods.find(pm => pm.provider === "mercadopago");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
      {/* Header redesenhado */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              💳 Métodos de Pagamento
            </h1>
            <p className="text-slate-600 text-lg">Configure os gateways de pagamento da sua plataforma</p>
          </div>
        </div>
        
        {/* Status cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm">Métodos Ativos</p>
                  <p className="text-2xl font-bold">
                    {[stripeMethod, mercadoPagoMethod].filter(m => m?.enabled).length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-emerald-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-sm">Total Configurados</p>
                  <p className="text-2xl font-bold">{paymentMethods.length}</p>
                </div>
                <Settings className="w-8 h-8 text-amber-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Status Geral</p>
                  <p className="text-lg font-semibold">
                    {paymentMethods.some(m => m.enabled) ? "✅ Operacional" : "⚠️ Inativo"}
                  </p>
                </div>
                <AlertCircle className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Stripe Card */}
        {stripeMethod && (
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">STRIPE</h2>
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
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex justify-center mb-6">
                <div className="w-40 h-20 bg-gradient-to-r from-blue-400 to-purple-600 rounded-lg flex items-center justify-center">
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
            </CardContent>
          </Card>
        )}

        {/* Mercado Pago Card */}
        {mercadoPagoMethod && (
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">MERCADOPAGO</h2>
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
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex justify-center mb-6">
                <div className="w-40 h-20 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">mercado pago</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Select
                    value={mercadoPagoMethod.config ? JSON.parse(mercadoPagoMethod.config).mode || "live" : "live"}
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
                      <SelectItem value="live">Live</SelectItem>
                      <SelectItem value="test">Test</SelectItem>
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
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}