import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { RemixIcon } from "@/components/ui/remixicon";

interface MercadoPagoCheckoutProps {
  orderId: number;
  amount: number;
  onSuccess: () => void;
}

export default function MercadoPagoCheckout({ orderId, amount, onSuccess }: MercadoPagoCheckoutProps) {
  const [preferenceId, setPreferenceId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Criar preferência de pagamento do Mercado Pago
    const createPreference = async () => {
      try {
        const response = await apiRequest("POST", "/api/create-mercadopago-preference", { 
          amount: amount,
          orderId: orderId 
        });
        const data = await response.json();
        setPreferenceId(data.preferenceId);
      } catch (error) {
        toast({
          title: "Erro de Configuração",
          description: "Não foi possível inicializar o pagamento com Mercado Pago. Verifique as configurações.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    createPreference();
  }, [amount, orderId, toast]);

  const handlePayment = async () => {
    if (!preferenceId) return;

    setIsProcessing(true);

    try {
      // Redirecionar para o checkout do Mercado Pago
      const checkoutUrl = `https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=${preferenceId}`;
      window.location.href = checkoutUrl;
    } catch (error) {
      toast({
        title: "Erro no Pagamento",
        description: "Ocorreu um erro ao processar o pagamento. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Preparando pagamento com Mercado Pago...</p>
        </CardContent>
      </Card>
    );
  }

  if (!preferenceId) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <RemixIcon name="ri-error-warning-line" className="mx-auto text-4xl text-red-500 mb-4" />
          <h3 className="text-lg font-medium mb-2">Erro no Pagamento</h3>
          <p className="text-muted-foreground">
            Não foi possível inicializar o pagamento com Mercado Pago. Tente novamente.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-6 h-6 bg-[#009EE3] rounded flex items-center justify-center">
            <span className="text-white font-bold text-xs">MP</span>
          </div>
          Pagamento Mercado Pago
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 bg-secondary/5 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-muted-foreground">Total:</span>
            <span className="font-bold text-lg">
              R$ {amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <RemixIcon name="ri-qr-code-line" className="text-blue-600" />
              PIX - Aprovação instantânea
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <RemixIcon name="ri-bank-card-line" className="text-green-600" />
              Cartão de crédito e débito
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <RemixIcon name="ri-file-text-line" className="text-orange-600" />
              Boleto bancário
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <RemixIcon name="ri-wallet-line" className="text-purple-600" />
              Saldo em conta Mercado Pago
            </div>
          </div>
        </div>

        <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 text-sm text-blue-800 dark:text-blue-200">
            <RemixIcon name="ri-information-line" />
            Você será redirecionado para o ambiente seguro do Mercado Pago
          </div>
        </div>
        
        <Button 
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full bg-[#009EE3] hover:bg-[#0088CC]"
          size="lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Redirecionando...
            </>
          ) : (
            <>
              <RemixIcon name="ri-external-link-line" className="mr-2" />
              Pagar com Mercado Pago
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}