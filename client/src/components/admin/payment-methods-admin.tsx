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
        {/* Stripe Card - Tema Azul */}
        {stripeMethod && (
          <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-blue-900">💙 Stripe</h2>
                    <p className="text-blue-600 text-sm">Gateway internacional</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge 
                    variant={stripeMethod.enabled ? "default" : "secondary"}
                    className={`px-3 py-1 font-semibold ${
                      stripeMethod.enabled 
                        ? "bg-emerald-500 text-white shadow-lg" 
                        : "bg-slate-300 text-slate-600"
                    }`}
                  >
                    {stripeMethod.enabled ? "🟢 ATIVO" : "🔴 INATIVO"}
                  </Badge>
                  <Switch
                    checked={stripeMethod.enabled || false}
                    onCheckedChange={(checked) => 
                      handleUpdatePaymentMethod(stripeMethod, "enabled", checked)
                    }
                    className="data-[state=checked]:bg-blue-500"
                  />
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex justify-center mb-6">
                <div className="w-40 h-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl transform rotate-1 hover:rotate-0 transition-transform duration-300">
                  <span className="text-white font-bold text-2xl tracking-wider">stripe</span>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                  <Label className="text-blue-800 font-semibold flex items-center gap-2 mb-2">
                    <Settings className="w-4 h-4" />
                    Modo de Operação
                  </Label>
                  <Select
                    value={stripeMethod.config ? JSON.parse(stripeMethod.config).mode || "test" : "test"}
                    onValueChange={(value) => {
                      const config = stripeMethod.config ? JSON.parse(stripeMethod.config) : {};
                      config.mode = value;
                      handleUpdatePaymentMethod(stripeMethod, "config", JSON.stringify(config));
                    }}
                  >
                    <SelectTrigger className="border-blue-300 focus:border-blue-500 bg-white">
                      <SelectValue placeholder="Selecione o modo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="test">🧪 Test (Desenvolvimento)</SelectItem>
                      <SelectItem value="live">🚀 Live (Produção)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                  <Label className="text-blue-800 font-semibold flex items-center gap-2 mb-2">
                    <Key className="w-4 h-4" />
                    Chave Pública *
                  </Label>
                  <Input
                    value={stripeMethod.publicKey || ""}
                    onChange={(e) => 
                      handleUpdatePaymentMethod(stripeMethod, "publicKey", e.target.value)
                    }
                    placeholder="pk_test_TYooMQauvdEDq54NiTphI7jx"
                    className="border-blue-300 focus:border-blue-500 bg-white"
                  />
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 shadow-lg transform hover:scale-105 transition-all duration-200"
                  onClick={() => {
                    toast({
                      title: "✅ Configurações Salvas!",
                      description: "Stripe configurado com sucesso!",
                    });
                  }}
                >
                  💾 Salvar Configurações
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Mercado Pago Card - Tema Verde */}
        {mercadoPagoMethod && (
          <Card className="border-0 shadow-xl bg-gradient-to-br from-emerald-50 to-green-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-emerald-900">💚 Mercado Pago</h2>
                    <p className="text-emerald-600 text-sm">Gateway brasileiro</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge 
                    variant={mercadoPagoMethod.enabled ? "default" : "secondary"}
                    className={`px-3 py-1 font-semibold ${
                      mercadoPagoMethod.enabled 
                        ? "bg-emerald-500 text-white shadow-lg" 
                        : "bg-slate-300 text-slate-600"
                    }`}
                  >
                    {mercadoPagoMethod.enabled ? "🟢 ATIVO" : "🔴 INATIVO"}
                  </Badge>
                  <Switch
                    checked={mercadoPagoMethod.enabled || false}
                    onCheckedChange={(checked) => 
                      handleUpdatePaymentMethod(mercadoPagoMethod, "enabled", checked)
                    }
                    className="data-[state=checked]:bg-emerald-500"
                  />
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex justify-center mb-6">
                <div className="w-40 h-24 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-xl transform -rotate-1 hover:rotate-0 transition-transform duration-300">
                  <span className="text-white font-bold text-lg tracking-wide">mercado pago</span>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                  <Label className="text-emerald-800 font-semibold flex items-center gap-2 mb-2">
                    <Settings className="w-4 h-4" />
                    Modo de Operação
                  </Label>
                  <Select
                    value={mercadoPagoMethod.config ? JSON.parse(mercadoPagoMethod.config).mode || "test" : "test"}
                    onValueChange={(value) => {
                      const config = mercadoPagoMethod.config ? JSON.parse(mercadoPagoMethod.config) : {};
                      config.mode = value;
                      handleUpdatePaymentMethod(mercadoPagoMethod, "config", JSON.stringify(config));
                    }}
                  >
                    <SelectTrigger className="border-emerald-300 focus:border-emerald-500 bg-white">
                      <SelectValue placeholder="Selecione o modo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="test">🧪 Test (Desenvolvimento)</SelectItem>
                      <SelectItem value="live">🚀 Live (Produção)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                  <Label className="text-emerald-800 font-semibold flex items-center gap-2 mb-2">
                    <Key className="w-4 h-4" />
                    Access Token *
                  </Label>
                  <Input
                    value={mercadoPagoMethod.secretKey || ""}
                    onChange={(e) => 
                      handleUpdatePaymentMethod(mercadoPagoMethod, "secretKey", e.target.value)
                    }
                    placeholder="APP_USR-xxxxxxxxxx-xxxxxx-xxxxxxxxxx"
                    className="border-emerald-300 focus:border-emerald-500 bg-white"
                  />
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold py-3 shadow-lg transform hover:scale-105 transition-all duration-200"
                  onClick={() => {
                    toast({
                      title: "✅ Configurações Salvas!",
                      description: "Mercado Pago configurado com sucesso!",
                    });
                  }}
                >
                  💾 Salvar Configurações
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}