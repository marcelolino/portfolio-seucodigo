import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RemixIcon } from "@/components/ui/remixicon";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Project, Service, insertOrderSchema } from "@shared/schema";
import { PaymentMethods } from "@/components/checkout/payment-methods";
import StripeCheckout from "@/components/checkout/stripe-checkout";
import MercadoPagoCheckout from "@/components/checkout/mercadopago-checkout";

// Schema para validação do formulário de checkout
const checkoutSchema = z.object({
  customerName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  customerEmail: z.string().email("Email inválido"),
  customerPhone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  customerCompany: z.string().optional(),
  projectDescription: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  budget: z.string().min(1, "Orçamento é obrigatório"),
  deadline: z.string().min(1, "Prazo é obrigatório"),
  priority: z.enum(["Baixa", "Média", "Alta", "Urgente"]),
  observations: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [step, setStep] = useState<"form" | "payment" | "processing">("form");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"stripe" | "mercadopago" | "">("");
  const [createdOrderId, setCreatedOrderId] = useState<number | null>(null);
  const [orderAmount, setOrderAmount] = useState<number>(0);

  // Obter parâmetros da URL
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('project');
  const serviceId = urlParams.get('service');

  // Buscar projetos e serviços
  const { data: projects } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const { data: services } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  // Configurar o formulário
  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      customerCompany: "",
      projectDescription: "",
      budget: "",
      deadline: "",
      priority: "Média",
      observations: "",
    }
  });

  // Mutation para criar pedido
  const createOrderMutation = useMutation({
    mutationFn: async (data: CheckoutFormData) => {
      // Calcular valor total
      let totalValue = 0;
      if (selectedProject?.price) {
        totalValue = parseFloat(selectedProject.price);
      } else if (selectedService?.price) {
        totalValue = parseFloat(selectedService.price.toString());
      } else if (data.budget) {
        totalValue = parseFloat(data.budget);
      }

      const orderData = {
        clientName: data.customerName,
        clientEmail: data.customerEmail,
        clientPhone: data.customerPhone,
        projectId: selectedProject?.id || null,
        serviceId: selectedService?.id || null,
        projectTitle: selectedProject?.title || (data.projectDescription || "Projeto Personalizado"),
        description: data.projectDescription,
        budget: data.budget,
        totalValue: totalValue.toString(),
        deadline: data.deadline,
        priority: data.priority.toLowerCase(),
        notes: data.observations || null,
      };

      const response = await apiRequest("POST", "/api/orders", orderData);
      return response.json();
    },
    onSuccess: (order) => {
      setCreatedOrderId(order.id);
      setOrderAmount(parseFloat(order.totalValue));
      setStep("payment");
      toast({
        title: "Pedido criado com sucesso!",
        description: "Agora escolha o método de pagamento para finalizar.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao criar pedido",
        description: "Tente novamente ou entre em contato conosco.",
        variant: "destructive",
      });
    },
  });

  // Efeito para carregar projeto/serviço selecionado
  useEffect(() => {
    if (projectId && projects) {
      const project = projects.find(p => p.id === parseInt(projectId));
      if (project) {
        setSelectedProject(project);
        form.setValue("projectDescription", project.description);
      }
    }
    if (serviceId && services) {
      const service = services.find(s => s.id === parseInt(serviceId));
      if (service) {
        setSelectedService(service);
        form.setValue("budget", service.price);
      }
    }
  }, [projectId, serviceId, projects, services, form]);

  const handleSubmit = (data: CheckoutFormData) => {
    createOrderMutation.mutate(data);
  };

  const handlePaymentMethodSelect = (method: "stripe" | "mercadopago") => {
    setSelectedPaymentMethod(method);
  };

  const handleProceedToPayment = () => {
    if (!selectedPaymentMethod) return;
    setStep("processing");
  };

  const handlePaymentSuccess = () => {
    toast({
      title: "Pagamento realizado com sucesso!",
      description: "Obrigado pela confiança. Entraremos em contato em breve.",
    });
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            {step === "form" ? "Finalizar Pedido" : step === "payment" ? "Escolha o Método de Pagamento" : "Processando Pagamento"}
          </h1>
          <p className="text-foreground/70">
            {step === "form" ? "Preencha os dados abaixo para solicitar seu orçamento personalizado" : 
             step === "payment" ? "Selecione como deseja pagar seu pedido" : 
             "Finalize seu pagamento com segurança"}
          </p>
        </div>

        {step === "form" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Resumo do Pedido */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <RemixIcon name="ri-shopping-bag-line" />
                    Resumo do Pedido
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedProject && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Projeto Selecionado</h4>
                      <div className="p-3 bg-secondary/10 rounded-lg">
                        <h5 className="font-medium">{selectedProject.title}</h5>
                        <p className="text-sm text-foreground/70 mt-1">{selectedProject.category}</p>
                        {selectedProject.price && (
                          <p className="text-sm font-medium text-green-600 mt-1">
                            R$ {parseFloat(selectedProject.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {selectedProject.technologies.slice(0, 3).map((tech, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedService && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Serviço Selecionado</h4>
                      <div className="p-3 bg-secondary/10 rounded-lg">
                        <h5 className="font-medium">{selectedService.title}</h5>
                        <p className="text-sm text-foreground/70 mt-1">
                          R$ {parseFloat(selectedService.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                  )}

                  <Separator />
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Tipo:</span>
                      <span>{selectedProject ? 'Projeto' : selectedService ? 'Serviço' : 'Personalizado'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Status:</span>
                      <Badge variant="outline">Orçamento</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

          {/* Formulário */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Dados para Orçamento</CardTitle>
                <CardDescription>
                  Preencha suas informações para recebermos um orçamento personalizado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                    {/* Dados do Cliente */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Dados de Contato</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="customerName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome Completo *</FormLabel>
                              <FormControl>
                                <Input placeholder="Seu nome completo" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="customerEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email *</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="seu@email.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="customerPhone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Telefone *</FormLabel>
                              <FormControl>
                                <Input placeholder="(11) 99999-9999" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="customerCompany"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Empresa (opcional)</FormLabel>
                              <FormControl>
                                <Input placeholder="Nome da empresa" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <Separator />

                    {/* Detalhes do Projeto */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Detalhes do Projeto</h3>
                      
                      <FormField
                        control={form.control}
                        name="projectDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Descrição do Projeto *</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Descreva detalhadamente o que você precisa..."
                                className="min-h-[120px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="budget"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Orçamento Estimado *</FormLabel>
                              <FormControl>
                                <Input placeholder="R$ 5.000,00" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="deadline"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Prazo Desejado *</FormLabel>
                              <FormControl>
                                <Input placeholder="30 dias" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="priority"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Prioridade</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione a prioridade" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Baixa">Baixa</SelectItem>
                                  <SelectItem value="Média">Média</SelectItem>
                                  <SelectItem value="Alta">Alta</SelectItem>
                                  <SelectItem value="Urgente">Urgente</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="observations"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Observações Adicionais</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Informações extras, referências, requisitos específicos..."
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Separator />

                    {/* Botões de Ação */}
                    <div className="flex gap-4 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => setLocation("/")}
                      >
                        <RemixIcon name="ri-arrow-left-line" className="w-4 h-4 mr-2" />
                        Voltar
                      </Button>
                      
                      <Button
                        type="submit"
                        className="flex-1 bg-accent hover:bg-accent/80"
                        disabled={createOrderMutation.isPending}
                      >
                        {createOrderMutation.isPending ? (
                          <>
                            <RemixIcon name="ri-loader-4-line" className="w-4 h-4 mr-2 animate-spin" />
                            Enviando...
                          </>
                        ) : (
                          <>
                            <RemixIcon name="ri-send-plane-line" className="w-4 h-4 mr-2" />
                            Solicitar Orçamento
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        )}

        {step === "payment" && createdOrderId && (
          <div className="max-w-2xl mx-auto">
            <PaymentMethods
              onMethodSelect={handlePaymentMethodSelect}
              onProceedToPayment={handleProceedToPayment}
              selectedMethod={selectedPaymentMethod}
              amount={orderAmount}
            />
          </div>
        )}

        {step === "processing" && createdOrderId && selectedPaymentMethod && (
          <div className="max-w-2xl mx-auto">
            {selectedPaymentMethod === "stripe" && (
              <StripeCheckout
                orderId={createdOrderId}
                amount={orderAmount}
                onSuccess={handlePaymentSuccess}
              />
            )}
            {selectedPaymentMethod === "mercadopago" && (
              <MercadoPagoCheckout
                orderId={createdOrderId}
                amount={orderAmount}
                onSuccess={handlePaymentSuccess}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}