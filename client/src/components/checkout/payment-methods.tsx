import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RemixIcon } from "@/components/ui/remixicon";

interface PaymentMethodsProps {
  onMethodSelect: (method: "stripe" | "mercadopago") => void;
  onProceedToPayment: () => void;
  selectedMethod: string;
  amount: number;
}

export function PaymentMethods({ onMethodSelect, onProceedToPayment, selectedMethod, amount }: PaymentMethodsProps) {
  const handleMethodChange = (value: string) => {
    onMethodSelect(value as "stripe" | "mercadopago");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RemixIcon name="ri-bank-card-line" />
          Método de Pagamento
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup value={selectedMethod} onValueChange={handleMethodChange}>
          {/* Stripe */}
          <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-secondary/10 transition-colors">
            <RadioGroupItem value="stripe" id="stripe" />
            <Label htmlFor="stripe" className="flex-1 cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-8 bg-[#635BFF] rounded flex items-center justify-center">
                    <span className="text-white font-bold text-xs">stripe</span>
                  </div>
                  <div>
                    <p className="font-medium">Stripe</p>
                    <p className="text-sm text-muted-foreground">
                      Cartão de crédito, débito e PIX
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Badge variant="secondary" className="text-xs">Visa</Badge>
                  <Badge variant="secondary" className="text-xs">Master</Badge>
                  <Badge variant="secondary" className="text-xs">PIX</Badge>
                </div>
              </div>
            </Label>
          </div>

          {/* Mercado Pago */}
          <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-secondary/10 transition-colors">
            <RadioGroupItem value="mercadopago" id="mercadopago" />
            <Label htmlFor="mercadopago" className="flex-1 cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-8 bg-[#009EE3] rounded flex items-center justify-center">
                    <span className="text-white font-bold text-xs">MP</span>
                  </div>
                  <div>
                    <p className="font-medium">Mercado Pago</p>
                    <p className="text-sm text-muted-foreground">
                      Cartões, PIX, boleto e saldo MP
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Badge variant="secondary" className="text-xs">PIX</Badge>
                  <Badge variant="secondary" className="text-xs">Boleto</Badge>
                  <Badge variant="secondary" className="text-xs">Cartão</Badge>
                </div>
              </div>
            </Label>
          </div>
        </RadioGroup>

        {selectedMethod && (
          <div className="space-y-4">
            <div className="p-4 bg-secondary/5 rounded-lg border border-dashed">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Total a pagar:</span>
                <span className="font-bold text-lg">
                  R$ {amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <RemixIcon name="ri-shield-check-line" className="text-green-600" />
                Pagamento 100% seguro e protegido
              </div>
            </div>

            <Button 
              onClick={onProceedToPayment}
              className="w-full"
              size="lg"
            >
              <RemixIcon name="ri-secure-payment-line" className="mr-2" />
              Prosseguir para o Pagamento
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}