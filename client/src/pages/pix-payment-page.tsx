import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, Check, ArrowLeft, Smartphone, CheckCircle } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/use-cart";

export function PixPaymentPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { getTotalPrice } = useCart();
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutos em segundos

  // Código PIX simulado (em uma implementação real, isso viria do backend)
  const pixCode = "00020101021226760014br.gov.bcb.pix2554pix.juno.com.br/qr/v2/cobV/9df6df47-edc7-446e-8b4c-34b8e8d8b8f7520400005303986540516.885802BR5920SeuCodigo LTDA6009SAO PAULO61080540900062070503***6304A9B2";
  
  const totalAmount = getTotalPrice();

  // Timer para expiração do PIX
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleCopyPixCode = async () => {
    try {
      await navigator.clipboard.writeText(pixCode);
      setCopied(true);
      toast({
        title: "Código copiado!",
        description: "O código PIX foi copiado para a área de transferência.",
      });
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o código PIX.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/checkout")}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <span className="text-sm text-gray-600">payment.seucodigo.com</span>
          <div className="w-8" /> {/* Spacer */}
        </div>
      </header>

      <div className="max-w-md mx-auto p-6 space-y-6">
        {/* Payment Info */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-gray-600 text-sm">Valor:</p>
              <p className="text-2xl font-bold text-gray-900">R$ {totalAmount.toFixed(2)}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-600 text-sm">Pague até:</p>
              <p className="text-lg font-medium text-gray-900">{formatTime(timeLeft)}</p>
            </div>
          </div>

          {/* PIX Logo */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">PIX</span>
              </div>
              <span className="text-gray-600 text-sm">powered by Banco Central</span>
            </div>
          </div>

          <div className="text-center mb-6">
            <p className="text-gray-700 text-sm leading-relaxed">
              Copie o código Pix abaixo e cole em seu app de
              <br />
              pagamento para finalizar a compra.
            </p>
          </div>

          {/* PIX Code */}
          <div className="bg-gray-100 rounded-lg p-4 mb-4">
            <p className="text-xs text-gray-600 font-mono break-all leading-relaxed">
              {pixCode}
            </p>
          </div>

          {/* Copy Button */}
          <Button
            onClick={handleCopyPixCode}
            className="w-full bg-black hover:bg-gray-800 text-white font-medium py-3 rounded-lg"
            disabled={copied}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                CÓDIGO COPIADO
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                COPIAR CÓDIGO PIX
              </>
            )}
          </Button>
        </div>

        {/* Instructions */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 text-center">
              Como pagar?
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mt-1">
                  <Smartphone className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Cole o código Pix em seu app bancário ou
                    carteira digital de preferência e confirme o
                    pagamento.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mt-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Seu pagamento será aprovado em alguns
                    instantes.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Info */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Pagamento seguro via{" "}
            <span className="font-medium text-blue-600">EBANX</span>
          </p>
        </div>
      </div>
    </div>
  );
}