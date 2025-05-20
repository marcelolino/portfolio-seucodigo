import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Service, InsertService, insertServiceSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { RemixIcon } from "@/components/ui/remixicon";
import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function AdminServices() {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentService, setCurrentService] = useState<Service | null>(null);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  
  const [formData, setFormData] = useState<InsertService>({
    title: "",
    description: "",
    icon: "",
    price: ""
  });

  const { data: services, isLoading } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  const addServiceMutation = useMutation({
    mutationFn: async (data: InsertService) => {
      const res = await apiRequest("POST", "/api/services", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      toast({
        title: "Serviço adicionado com sucesso",
        description: "O serviço foi adicionado à lista.",
      });
      setIsAddDialogOpen(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao adicionar serviço",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const editServiceMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertService> }) => {
      const res = await apiRequest("PUT", `/api/services/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      toast({
        title: "Serviço atualizado com sucesso",
        description: "As alterações foram salvas.",
      });
      setIsEditDialogOpen(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao atualizar serviço",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteServiceMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/services/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      toast({
        title: "Serviço excluído com sucesso",
        description: "O serviço foi removido da lista.",
      });
      setIsDeleteDialogOpen(false);
      setCurrentService(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao excluir serviço",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      icon: value
    }));
    
    // Clear error for icon field
    if (formErrors.icon) {
      setFormErrors(prev => ({
        ...prev,
        icon: ""
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      icon: ""
    });
    setFormErrors({});
  };

  const openAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (service: Service) => {
    setCurrentService(service);
    setFormData({
      title: service.title,
      description: service.description,
      icon: service.icon
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (service: Service) => {
    setCurrentService(service);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmit = (isEdit: boolean = false) => {
    try {
      insertServiceSchema.parse(formData);
      
      if (isEdit && currentService) {
        editServiceMutation.mutate({
          id: currentService.id,
          data: formData
        });
      } else {
        addServiceMutation.mutate(formData);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: { [key: string]: string } = {};
        error.errors.forEach(err => {
          if (err.path) {
            errors[err.path[0]] = err.message;
          }
        });
        setFormErrors(errors);
      }
    }
  };

  const handleDeleteConfirm = () => {
    if (currentService) {
      deleteServiceMutation.mutate(currentService.id);
    }
  };

  // Available Remix icons for services
  const iconOptions = [
    { value: "ri-code-s-slash-line", label: "Código" },
    { value: "ri-smartphone-line", label: "Smartphone" },
    { value: "ri-database-2-line", label: "Banco de Dados" },
    { value: "ri-palette-line", label: "Design" },
    { value: "ri-globe-line", label: "Web" },
    { value: "ri-app-store-line", label: "App" },
    { value: "ri-server-line", label: "Servidor" },
    { value: "ri-cloud-line", label: "Cloud" },
    { value: "ri-rocket-line", label: "Lançamento" },
    { value: "ri-shield-check-line", label: "Segurança" }
  ];

  return (
    <div>
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Gerenciar Serviços</h1>
          <p className="text-gray-600">Adicione, edite ou remova serviços oferecidos.</p>
        </div>
        <Button onClick={openAddDialog} className="flex items-center gap-2">
          <RemixIcon name="ri-add-line" /> Novo Serviço
        </Button>
      </header>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : services && services.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card key={service.id}>
              <CardHeader>
                <div className="text-primary text-4xl mb-4">
                  <RemixIcon name={service.icon} />
                </div>
                <CardTitle>{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{service.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => openEditDialog(service)}
                >
                  <RemixIcon name="ri-edit-line mr-1" /> Editar
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                  onClick={() => openDeleteDialog(service)}
                >
                  <RemixIcon name="ri-delete-bin-line mr-1" /> Excluir
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <RemixIcon name="ri-service-line text-4xl text-gray-400 mb-2" />
          <h3 className="text-lg font-medium text-gray-600">Nenhum serviço cadastrado</h3>
          <p className="text-gray-500 mb-4">Adicione serviços para exibir na página.</p>
          <Button onClick={openAddDialog}>Adicionar Serviço</Button>
        </div>
      )}

      {/* Add Service Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Serviço</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={formErrors.title ? "border-red-500" : ""}
              />
              {formErrors.title && (
                <p className="text-red-500 text-sm">{formErrors.title}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className={formErrors.description ? "border-red-500" : ""}
              />
              {formErrors.description && (
                <p className="text-red-500 text-sm">{formErrors.description}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="icon">Ícone</Label>
              <Select value={formData.icon} onValueChange={handleSelectChange}>
                <SelectTrigger className={formErrors.icon ? "border-red-500" : ""}>
                  <SelectValue placeholder="Selecionar ícone" />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((icon) => (
                    <SelectItem key={icon.value} value={icon.value} className="flex items-center">
                      <div className="flex items-center gap-2">
                        <RemixIcon name={icon.value} /> {icon.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.icon && (
                <p className="text-red-500 text-sm">{formErrors.icon}</p>
              )}
              {formData.icon && (
                <div className="mt-2 flex items-center gap-2">
                  <span>Preview:</span>
                  <div className="text-primary text-2xl">
                    <RemixIcon name={formData.icon} />
                  </div>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={() => handleSubmit()}
              disabled={addServiceMutation.isPending}
            >
              {addServiceMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : "Salvar Serviço"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Service Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Serviço</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Título</Label>
              <Input
                id="edit-title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={formErrors.title ? "border-red-500" : ""}
              />
              {formErrors.title && (
                <p className="text-red-500 text-sm">{formErrors.title}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Descrição</Label>
              <Textarea
                id="edit-description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className={formErrors.description ? "border-red-500" : ""}
              />
              {formErrors.description && (
                <p className="text-red-500 text-sm">{formErrors.description}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-icon">Ícone</Label>
              <Select value={formData.icon} onValueChange={handleSelectChange}>
                <SelectTrigger className={formErrors.icon ? "border-red-500" : ""}>
                  <SelectValue placeholder="Selecionar ícone" />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((icon) => (
                    <SelectItem key={icon.value} value={icon.value} className="flex items-center">
                      <div className="flex items-center gap-2">
                        <RemixIcon name={icon.value} /> {icon.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.icon && (
                <p className="text-red-500 text-sm">{formErrors.icon}</p>
              )}
              {formData.icon && (
                <div className="mt-2 flex items-center gap-2">
                  <span>Preview:</span>
                  <div className="text-primary text-2xl">
                    <RemixIcon name={formData.icon} />
                  </div>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={() => handleSubmit(true)}
              disabled={editServiceMutation.isPending}
            >
              {editServiceMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Atualizando...
                </>
              ) : "Atualizar Serviço"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Serviço</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o serviço "{currentService?.title}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {deleteServiceMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Excluindo...
                </>
              ) : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
