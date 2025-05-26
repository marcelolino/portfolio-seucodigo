import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { RemixIcon } from "@/components/ui/remixicon";

// Verificar se a chave existe antes de usar
const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : null;

interface StripeCheckoutFormProps {
  orderId: number;
  amount: number;
  onSuccess: () => void;
}

const StripeCheckoutForm = ({ orderId, amount, onSuccess }: StripeCheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success?orderId=${orderId}`,
        },
      });

      if (error) {
        toast({
          title: "Erro no Pagamento",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Pagamento Processado",
          description: "Seu pagamento está sendo processado!",
        });
        onSuccess();
      }
    } catch (error) {
      toast({
        title: "Erro no Pagamento",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RemixIcon name="ri-bank-card-line" />
          Pagamento Stripe
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-4 bg-secondary/5 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total:</span>
              <span className="font-bold text-lg">
                R$ {amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
          
          <PaymentElement />
          
          <Button 
            type="submit" 
            disabled={!stripe || isProcessing}
            className="w-full"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <RemixIcon name="ri-secure-payment-line" className="mr-2" />
                Finalizar Pagamento
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

interface StripeCheckoutProps {
  orderId: number;
  amount: number;
  onSuccess: () => void;
}

export default function StripeCheckout({ orderId, amount, onSuccess }: StripeCheckoutProps) {
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Criar PaymentIntent
    const createPaymentIntent = async () => {
      try {
        const response = await apiRequest("POST", "/api/create-payment-intent", { 
          amount: amount,
          orderId: orderId 
        });
        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        toast({
          title: "Erro de Configuração",
          description: "Não foi possível inicializar o pagamento. Verifique as configurações do Stripe.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    createPaymentIntent();
  }, [amount, orderId, toast]);

  if (!stripePromise) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <RemixIcon name="ri-error-warning-line" className="mx-auto text-4xl text-yellow-500 mb-4" />
          <h3 className="text-lg font-medium mb-2">Stripe não configurado</h3>
          <p className="text-muted-foreground">
            As chaves do Stripe não estão configuradas. Entre em contato com o administrador.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Preparando pagamento...</p>
        </CardContent>
      </Card>
    );
  }

  if (!clientSecret) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <RemixIcon name="ri-error-warning-line" className="mx-auto text-4xl text-red-500 mb-4" />
          <h3 className="text-lg font-medium mb-2">Erro no Pagamento</h3>
          <p className="text-muted-foreground">
            Não foi possível inicializar o pagamento. Tente novamente.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <StripeCheckoutForm orderId={orderId} amount={amount} onSuccess={onSuccess} />
    </Elements>
  );
}