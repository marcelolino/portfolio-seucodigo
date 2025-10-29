import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Order, InsertOrder, Project, Service } from "@shared/schema";
import { RemixIcon } from "@/components/ui/remixicon";
import { apiRequest } from "@/lib/queryClient";

export function AdminOrders() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  const [formData, setFormData] = useState<InsertOrder>({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    projectId: null,
    serviceId: null,
    projectTitle: "",
    description: "",
    budget: null,
    deadline: null,
    status: "pending",
    priority: "medium",
    notes: "",
    totalValue: null
  });

  // Buscar pedidos
  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
  });

  // Buscar projetos para o formulário
  const { data: projects } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  // Buscar serviços para o formulário
  const { data: services } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  // Mutation para criar pedido
  const createMutation = useMutation({
    mutationFn: async (data: InsertOrder) => {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Erro ao criar pedido");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      setIsAddDialogOpen(false);
      resetForm();
      toast({
        title: "Sucesso",
        description: "Pedido criado com sucesso!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar pedido",
        variant: "destructive",
      });
    },
  });

  // Mutation para atualizar pedido
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: InsertOrder }) => {
      const response = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Erro ao atualizar pedido");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      setIsEditDialogOpen(false);
      setCurrentOrder(null);
      resetForm();
      toast({
        title: "Sucesso",
        description: "Pedido atualizado com sucesso!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar pedido",
        variant: "destructive",
      });
    },
  });

  // Mutation para deletar pedido
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/orders/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Erro ao deletar pedido");
      return response.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      setIsDeleteDialogOpen(false);
      setCurrentOrder(null);
      toast({
        title: "Sucesso",
        description: "Pedido deletado com sucesso!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao deletar pedido",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      projectId: null,
      serviceId: null,
      projectTitle: "",
      description: "",
      budget: null,
      deadline: null,
      status: "pending",
      priority: "medium",
      notes: "",
      totalValue: null
    });
  };

  const openEditDialog = (order: Order) => {
    setCurrentOrder(order);
    setFormData({
      clientName: order.clientName,
      clientEmail: order.clientEmail,
      clientPhone: order.clientPhone || "",
      projectId: order.projectId,
      serviceId: order.serviceId,
      projectTitle: order.projectTitle || "",
      description: order.description,
      budget: order.budget,
      deadline: order.deadline,
      status: order.status,
      priority: order.priority,
      notes: order.notes || "",
      totalValue: order.totalValue
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (order: Order) => {
    setCurrentOrder(order);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentOrder) {
      updateMutation.mutate({ id: currentOrder.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Pendente", variant: "secondary" as const },
      approved: { label: "Aprovado", variant: "default" as const },
      in_progress: { label: "Em Progresso", variant: "default" as const },
      completed: { label: "Concluído", variant: "default" as const },
      cancelled: { label: "Cancelado", variant: "destructive" as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      low: { label: "Baixa", variant: "secondary" as const },
      medium: { label: "Média", variant: "default" as const },
      high: { label: "Alta", variant: "default" as const },
      urgent: { label: "Urgente", variant: "destructive" as const }
    };
    
    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.medium;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatCurrency = (value: string | null) => {
    if (!value) return "Não informado";
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(parseFloat(value));
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return "Não informado";
    return new Date(date).toLocaleDateString('pt-BR');
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Carregando pedidos...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gerenciar Pedidos</h2>
          <p className="text-gray-600">Administre os pedidos dos clientes</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <RemixIcon name="ri-add-line mr-2" />
          Novo Pedido
        </Button>
      </div>

      <div className="grid gap-4">
        {orders?.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Pedido #{order.id} - {order.clientName}
                    {getStatusBadge(order.status)}
                    {getPriorityBadge(order.priority)}
                  </CardTitle>
                  <CardDescription>
                    {order.clientEmail} | {order.clientPhone || "Telefone não informado"}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(order)}>
                    <RemixIcon name="ri-edit-line mr-1" />
                    Editar
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => openDeleteDialog(order)}>
                    <RemixIcon name="ri-delete-bin-line mr-1" />
                    Deletar
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <strong>Projeto/Serviço:</strong>
                  <p className="text-sm text-gray-600">
                    {order.projectTitle || 
                     projects?.find(p => p.id === order.projectId)?.title ||
                     services?.find(s => s.id === order.serviceId)?.title ||
                     "Não especificado"}
                  </p>
                </div>
                <div>
                  <strong>Orçamento:</strong>
                  <p className="text-sm text-gray-600">{formatCurrency(order.budget)}</p>
                </div>
                <div>
                  <strong>Valor Total:</strong>
                  <p className="text-sm text-gray-600">{formatCurrency(order.totalValue)}</p>
                </div>
                <div>
                  <strong>Prazo:</strong>
                  <p className="text-sm text-gray-600">{formatDate(order.deadline)}</p>
                </div>
              </div>
              <div className="mt-4">
                <strong>Descrição:</strong>
                <p className="text-sm text-gray-600 mt-1">{order.description}</p>
              </div>
              {order.notes && (
                <div className="mt-4">
                  <strong>Observações:</strong>
                  <p className="text-sm text-gray-600 mt-1">{order.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog para adicionar/editar pedido */}
      <Dialog open={isAddDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setIsAddDialogOpen(false);
          setIsEditDialogOpen(false);
          setCurrentOrder(null);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {currentOrder ? "Editar Pedido" : "Novo Pedido"}
            </DialogTitle>
            <DialogDescription>
              {currentOrder ? "Edite as informações do pedido" : "Adicione um novo pedido ao sistema"}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="clientName">Nome do Cliente *</Label>
                <Input
                  id="clientName"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="clientEmail">Email do Cliente *</Label>
                <Input
                  id="clientEmail"
                  type="email"
                  value={formData.clientEmail}
                  onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="clientPhone">Telefone do Cliente</Label>
                <Input
                  id="clientPhone"
                  value={formData.clientPhone || ""}
                  onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="projectTitle">Título do Projeto Personalizado</Label>
                <Input
                  id="projectTitle"
                  value={formData.projectTitle || ""}
                  onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="projectId">Projeto Existente</Label>
                <Select
                  value={formData.projectId?.toString() || ""}
                  onValueChange={(value) => setFormData({ 
                    ...formData, 
                    projectId: value ? parseInt(value) : null,
                    serviceId: null // Limpa o serviço se um projeto for selecionado
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um projeto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Nenhum projeto</SelectItem>
                    {projects?.map((project) => (
                      <SelectItem key={project.id} value={project.id.toString()}>
                        {project.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="serviceId">Serviço Existente</Label>
                <Select
                  value={formData.serviceId?.toString() || ""}
                  onValueChange={(value) => setFormData({ 
                    ...formData, 
                    serviceId: value ? parseInt(value) : null,
                    projectId: null // Limpa o projeto se um serviço for selecionado
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um serviço" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Nenhum serviço</SelectItem>
                    {services?.map((service) => (
                      <SelectItem key={service.id} value={service.id.toString()}>
                        {service.title} - {formatCurrency(service.price)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Descrição *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="budget">Orçamento (R$)</Label>
                <Input
                  id="budget"
                  type="number"
                  step="0.01"
                  value={formData.budget || ""}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value || null })}
                />
              </div>
              <div>
                <Label htmlFor="totalValue">Valor Total (R$)</Label>
                <Input
                  id="totalValue"
                  type="number"
                  step="0.01"
                  value={formData.totalValue || ""}
                  onChange={(e) => setFormData({ ...formData, totalValue: e.target.value || null })}
                />
              </div>
              <div>
                <Label htmlFor="deadline">Prazo</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline ? new Date(formData.deadline).toISOString().split('T')[0] : ""}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value ? new Date(e.target.value) : null })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="approved">Aprovado</SelectItem>
                    <SelectItem value="in_progress">Em Progresso</SelectItem>
                    <SelectItem value="completed">Concluído</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="priority">Prioridade</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData({ ...formData, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baixa</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={formData.notes || ""}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            </div>
          </form>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsAddDialogOpen(false);
              setIsEditDialogOpen(false);
              setCurrentOrder(null);
              resetForm();
            }}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmação para deletar */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar o pedido de "{currentOrder?.clientName}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => currentOrder && deleteMutation.mutate(currentOrder.id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deletando..." : "Deletar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}