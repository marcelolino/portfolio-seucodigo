import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Circle, Edit, Plus, Minus, CreditCard, Smartphone } from "lucide-react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface CheckoutFormData {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  description: string;
  deadline: string;
  notes: string;
  paymentMethod: string;
  acceptTerms: boolean;
}

export function CheckoutPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCart();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(items.length > 0 ? 1 : 0);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [discount, setDiscount] = useState(50.00); // Desconto fixo como na imagem

  const [formData, setFormData] = useState<CheckoutFormData>({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    description: "",
    deadline: "",
    notes: "",
    paymentMethod: "",
    acceptTerms: false
  });

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });
      if (!response.ok) {
        throw new Error("Failed to create order");
      }
      return response.json();
    },
    onSuccess: () => {
      clearCart();
      setCurrentStep(2);
      toast({
        title: "Pedido realizado com sucesso!",
        description: "Entraremos em contato em breve para confirmar os detalhes.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao realizar pedido",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async () => {
    if (!formData.acceptTerms) {
      toast({
        title: "Aceite os termos",
        description: "Você deve aceitar os termos e condições para continuar.",
        variant: "destructive",
      });
      return;
    }

    if (!paymentMethod) {
      toast({
        title: "Selecione um método de pagamento",
        description: "Você deve selecionar um método de pagamento para continuar.",
        variant: "destructive",
      });
      return;
    }

    // Se PIX foi selecionado, redireciona para a tela de pagamento PIX
    if (paymentMethod === 'pix') {
      navigate('/pix-payment');
      return;
    }

    const orderData = {
      clientName: formData.clientName,
      clientEmail: formData.clientEmail,
      clientPhone: formData.clientPhone,
      description: `Pedido de ${items.length} item(s): ${items.map(item => item.item.title).join(", ")}. ${formData.description}`,
      totalValue: (getTotalPrice() - discount).toFixed(2),
      paymentMethod: paymentMethod,
      notes: formData.notes,
      deadline: formData.deadline ? new Date(formData.deadline) : undefined,
    };

    createOrderMutation.mutate(orderData);
  };

  const steps = [
    { id: 0, title: "Adicionar ao carrinho", completed: items.length > 0 },
    { id: 1, title: "Preencha os detalhes", completed: currentStep > 1 },
    { id: 2, title: "Confirmação", completed: currentStep >= 2 }
  ];

  if (items.length === 0 && currentStep === 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Carrinho vazio</h1>
          <p className="text-gray-400 mb-6">Adicione alguns itens ao seu carrinho para continuar</p>
          <Button onClick={() => navigate("/")} className="bg-green-600 hover:bg-green-700">
            Voltar à página inicial
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 p-4">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <h1 className="text-xl font-bold">Checkout</h1>
          <Button 
            onClick={() => navigate("/")}
            className="bg-green-600 hover:bg-green-700"
            size="sm"
          >
            Entrar
          </Button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Checkout Steps */}
        <div className="lg:col-span-2 space-y-8">
          {/* Progress Steps */}
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step.completed ? 'bg-green-600' : currentStep === step.id ? 'bg-green-600' : 'bg-gray-600'
                  }`}>
                    {step.completed ? <CheckCircle className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                  </div>
                  <span className="ml-2 text-sm">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-24 h-0.5 mx-4 ${
                    step.completed ? 'bg-green-600' : 'bg-gray-600'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Payment Method Section */}
          {currentStep >= 1 && (
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Método de pagamento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Label className="text-white">Selecione o método de pagamento</Label>
                  
                  {/* PIX Option */}
                  <div 
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      paymentMethod === 'pix' 
                        ? 'border-green-600 bg-green-600/10' 
                        : 'border-gray-600 bg-gray-700 hover:border-green-600'
                    }`}
                    onClick={() => setPaymentMethod('pix')}
                  >
                    <div className="flex items-center space-x-3">
                      <Smartphone className="w-6 h-6 text-green-400" />
                      <div>
                        <h3 className="text-white font-medium">PIX</h3>
                        <p className="text-gray-400 text-sm">Pagamento instantâneo via PIX</p>
                      </div>
                      {paymentMethod === 'pix' && (
                        <CheckCircle className="w-5 h-5 text-green-400 ml-auto" />
                      )}
                    </div>
                  </div>

                  {/* Credit Card Option */}
                  <div 
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      paymentMethod === 'credit' 
                        ? 'border-green-600 bg-green-600/10' 
                        : 'border-gray-600 bg-gray-700 hover:border-green-600'
                    }`}
                    onClick={() => setPaymentMethod('credit')}
                  >
                    <div className="flex items-center space-x-3">
                      <CreditCard className="w-6 h-6 text-blue-400" />
                      <div>
                        <h3 className="text-white font-medium">Cartão de Crédito</h3>
                        <p className="text-gray-400 text-sm">Pagamento com cartão de crédito</p>
                      </div>
                      {paymentMethod === 'credit' && (
                        <CheckCircle className="w-5 h-5 text-green-400 ml-auto" />
                      )}
                    </div>
                  </div>

                  {/* Debit Card Option */}
                  <div 
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      paymentMethod === 'debit' 
                        ? 'border-green-600 bg-green-600/10' 
                        : 'border-gray-600 bg-gray-700 hover:border-green-600'
                    }`}
                    onClick={() => setPaymentMethod('debit')}
                  >
                    <div className="flex items-center space-x-3">
                      <CreditCard className="w-6 h-6 text-purple-400" />
                      <div>
                        <h3 className="text-white font-medium">Cartão de Débito</h3>
                        <p className="text-gray-400 text-sm">Pagamento com cartão de débito</p>
                      </div>
                      {paymentMethod === 'debit' && (
                        <CheckCircle className="w-5 h-5 text-green-400 ml-auto" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Client Details Form */}
                <div className="mt-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="clientName">Nome completo</Label>
                      <Input
                        id="clientName"
                        value={formData.clientName}
                        onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="clientEmail">Email</Label>
                      <Input
                        id="clientEmail"
                        type="email"
                        value={formData.clientEmail}
                        onChange={(e) => setFormData({...formData, clientEmail: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="clientPhone">Telefone</Label>
                    <Input
                      id="clientPhone"
                      value={formData.clientPhone}
                      onChange={(e) => setFormData({...formData, clientPhone: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Descrição do projeto</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white"
                      rows={4}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="deadline">Prazo desejado</Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes">Observações adicionais</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white"
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Order Summary */}
        <div className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Resumo do pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Cart Items */}
              {items.map((cartItem) => (
                <div key={cartItem.id} className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-700 rounded flex items-center justify-center text-white font-bold">
                    {cartItem.quantity}x
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{cartItem.item.title}</p>
                    <p className="text-gray-400 text-sm">
                      {cartItem.type === 'project' ? 'Projeto' : 'Serviço'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-bold">
                      R$ {parseFloat(cartItem.item.price || "0").toFixed(2)}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(cartItem.id, cartItem.quantity - 1)}
                        className="w-6 h-6 p-0"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(cartItem.id, cartItem.quantity + 1)}
                        className="w-6 h-6 p-0"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              <Separator className="bg-gray-600" />

              {/* Pricing Summary */}
              <div className="space-y-2">
                <div className="flex justify-between text-white">
                  <span>Preço do item</span>
                  <span>R$ {getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-green-400">
                  <span>Desconto</span>
                  <span>(-) R$ {discount.toFixed(2)}</span>
                </div>
              </div>

              <Separator className="bg-gray-600" />

              <div className="flex justify-between text-xl font-bold text-white">
                <span>Total</span>
                <span className="text-green-400">R$ {(getTotalPrice() - discount).toFixed(2)}</span>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-2 pt-4">
                <Checkbox
                  id="acceptTerms"
                  checked={formData.acceptTerms}
                  onCheckedChange={(checked) => 
                    setFormData({...formData, acceptTerms: !!checked})
                  }
                  className="border-gray-600"
                />
                <label htmlFor="acceptTerms" className="text-sm text-gray-300 leading-tight">
                  Eu concordo que fazer o pedido me coloca sob{" "}
                  <a href="#" className="text-green-400 underline">os Termos e Condições</a> e{" "}
                  <a href="#" className="text-green-400 underline">Política de Privacidade</a>
                </label>
              </div>

              {/* Action Button */}
              <Button
                onClick={handleSubmit}
                disabled={!formData.acceptTerms || createOrderMutation.isPending}
                className="w-full bg-gray-600 hover:bg-gray-500 text-white mt-6"
              >
                {createOrderMutation.isPending ? "Processando..." : "Realizar pedido"}
              </Button>
            </CardContent>
          </Card>

          {/* Additional Options */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-green-400 cursor-pointer">
              <span>Se Algum Produto Não Estiver Disponível</span>
              <span>›</span>
            </div>
            <div className="flex items-center justify-between text-green-400 cursor-pointer">
              <span>Adicionar Mais Instruções De Entrega</span>
              <span>›</span>
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {currentStep === 2 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Card className="bg-gray-800 border-gray-700 max-w-md mx-4">
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Pedido Confirmado!</h2>
              <p className="text-gray-400 mb-6">
                Seu pedido foi recebido com sucesso. Entraremos em contato em breve para confirmar os detalhes.
              </p>
              <Button onClick={() => navigate("/")} className="bg-green-600 hover:bg-green-700">
                Voltar à página inicial
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}