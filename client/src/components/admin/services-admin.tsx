import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Service, InsertService } from "@shared/schema";
import { 
  Loader2, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  Settings, 
  DollarSign, 
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  XCircle,
  Image,
  Upload
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function ServicesAdmin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { data: services = [], isLoading } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  const createServiceMutation = useMutation({
    mutationFn: async (serviceData: InsertService) => {
      const response = await fetch("/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(serviceData),
      });
      if (!response.ok) {
        throw new Error("Failed to create service");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      setIsCreateDialogOpen(false);
      resetForm();
      toast({
        title: "✅ Sucesso",
        description: "Serviço criado com sucesso!",
      });
    },
    onError: () => {
      toast({
        title: "❌ Erro",
        description: "Erro ao criar serviço.",
        variant: "destructive",
      });
    },
  });

  const updateServiceMutation = useMutation({
    mutationFn: async ({ id, ...serviceData }: Partial<Service> & { id: number }) => {
      const response = await fetch(`/api/services/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(serviceData),
      });
      if (!response.ok) {
        throw new Error("Failed to update service");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      setEditingService(null);
      resetForm();
      toast({
        title: "✅ Sucesso",
        description: "Serviço atualizado com sucesso!",
      });
    },
  });

  const deleteServiceMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/services/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete service");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      toast({
        title: "✅ Sucesso",
        description: "Serviço excluído com sucesso!",
      });
    },
  });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    technologies: "",
    status: "active",
    image: "",
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      price: "",
      technologies: "",
      status: "active",
      image: "",
    });
    setImagePreview(null);
    setUploadedImage(null);
  };

  // Handle image file upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Criar preview da imagem
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        // Armazenar a imagem como base64
        setFormData(prev => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
      setUploadedImage(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const serviceData: InsertService = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      price: formData.price ? formData.price : undefined,
      technologies: formData.technologies.split(",").map(t => t.trim()),
      status: formData.status,
      image: formData.image || "",
    };

    if (editingService) {
      updateServiceMutation.mutate({ ...serviceData, id: editingService.id });
    } else {
      createServiceMutation.mutate(serviceData);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description || "",
      category: service.category || "",
      price: service.price?.toString() || "",
      technologies: service.technologies?.join(", ") || "",
      status: service.status as "active",
      image: service.image || "",
    });
    // Carregar preview da imagem se existir
    if (service.image) {
      setImagePreview(service.image);
    } else {
      setImagePreview(null);
    }
    setUploadedImage(null);
    setIsCreateDialogOpen(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case "completed":
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case "in_progress":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "inactive":
        return <XCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: "Ativo", className: "bg-emerald-100 text-emerald-800 border-emerald-200" },
      completed: { label: "Concluído", className: "bg-blue-100 text-blue-800 border-blue-200" },
      in_progress: { label: "Em Andamento", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
      inactive: { label: "Inativo", className: "bg-gray-100 text-gray-800 border-gray-200" },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    
    return (
      <Badge variant="outline" className={config.className}>
        {getStatusIcon(status)}
        <span className="ml-1">{config.label}</span>
      </Badge>
    );
  };

  const filteredServices = services.filter(service =>
    service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Settings className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              ⚙️ Gerenciar Serviços
            </h1>
            <p className="text-slate-600 text-lg">Gerencie seus serviços oferecidos</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm">Total de Serviços</p>
                  <p className="text-2xl font-bold">{services.length}</p>
                </div>
                <Settings className="w-8 h-8 text-emerald-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Serviços Ativos</p>
                  <p className="text-2xl font-bold">
                    {services.filter(s => s.status === "active").length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm">Em Andamento</p>
                  <p className="text-2xl font-bold">
                    {services.filter(s => s.status === "in_progress").length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-yellow-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Concluídos</p>
                  <p className="text-2xl font-bold">
                    {services.filter(s => s.status === "completed").length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Input
              placeholder="Buscar serviços..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-4 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={() => {
                  setEditingService(null);
                  resetForm();
                }}
              >
                <Plus className="w-5 h-5 mr-2" />
                Novo Serviço
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-gray-900">
                  {editingService ? "Editar Serviço" : "Criar Novo Serviço"}
                </DialogTitle>
                <DialogDescription>
                  {editingService ? "Atualize as informações do serviço" : "Adicione um novo serviço ao seu catálogo"}
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="title" className="text-sm font-semibold text-gray-700 mb-2 block">
                      Nome do Serviço *
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Digite o nome do serviço"
                      required
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="category" className="text-sm font-semibold text-gray-700 mb-2 block">
                      Categoria *
                    </Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="Ex: Desenvolvimento Web, Consultoria"
                      required
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="price" className="text-sm font-semibold text-gray-700 mb-2 block">
                      <DollarSign className="w-4 h-4 inline mr-1" />
                      Preço (R$)
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="0.00"
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="status" className="text-sm font-semibold text-gray-700 mb-2 block">
                      Status *
                    </Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Ativo</SelectItem>
                        <SelectItem value="in_progress">Em Andamento</SelectItem>
                        <SelectItem value="completed">Concluído</SelectItem>
                        <SelectItem value="inactive">Inativo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description" className="text-sm font-semibold text-gray-700 mb-2 block">
                    Descrição *
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descreva detalhadamente o serviço oferecido..."
                    required
                    rows={4}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <Label htmlFor="technologies" className="text-sm font-semibold text-gray-700 mb-2 block">
                    Tecnologias *
                  </Label>
                  <Input
                    id="technologies"
                    value={formData.technologies}
                    onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                    placeholder="Ex: React, Node.js, TypeScript (separado por vírgulas)"
                    required
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Separe as tecnologias por vírgulas
                  </p>
                </div>

                <div>
                  <Label htmlFor="image" className="text-sm font-semibold text-gray-700 mb-2 block">
                    <Image className="w-4 h-4 inline mr-1" />
                    Imagem do Serviço
                  </Label>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                      <Button type="button" variant="outline" size="sm">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload
                      </Button>
                    </div>
                    
                    {imagePreview && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-600 mb-2">Preview da imagem:</p>
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={createServiceMutation.isPending || updateServiceMutation.isPending}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
                  >
                    {(createServiceMutation.isPending || updateServiceMutation.isPending) ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {editingService ? "Atualizando..." : "Criando..."}
                      </>
                    ) : (
                      editingService ? "Atualizar Serviço" : "Criar Serviço"
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Services Table */}
      <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
        <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-cyan-50">
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-600" />
            Lista de Serviços ({filteredServices.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50">
                  <TableHead className="font-semibold text-gray-700">Imagem</TableHead>
                  <TableHead className="font-semibold text-gray-700">Serviço</TableHead>
                  <TableHead className="font-semibold text-gray-700">Categoria</TableHead>
                  <TableHead className="font-semibold text-gray-700">Preço</TableHead>
                  <TableHead className="font-semibold text-gray-700">Status</TableHead>
                  <TableHead className="font-semibold text-gray-700">Tecnologias</TableHead>
                  <TableHead className="font-semibold text-gray-700">Data</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServices.map((service) => (
                  <TableRow key={service.id} className="hover:bg-blue-50/30 transition-colors">
                    <TableCell>
                      {service.image ? (
                        <img 
                          src={service.image} 
                          alt={service.title}
                          className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center">
                          <Settings className="w-6 h-6 text-blue-500" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-semibold text-gray-900">{service.title}</p>
                        <p className="text-sm text-gray-500 line-clamp-2">{service.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {service.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {service.price ? (
                        <span className="font-semibold text-green-600">
                          R$ {parseFloat(service.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(service.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {service.technologies?.slice(0, 2).map((tech, index) => (
                          <Badge 
                            key={index} 
                            variant="secondary" 
                            className="text-xs bg-gray-100 text-gray-700"
                          >
                            {tech}
                          </Badge>
                        ))}
                        {service.technologies && service.technologies.length > 2 && (
                          <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                            +{service.technologies.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-500">
                        {new Date(service.createdAt).toLocaleDateString('pt-BR')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(service)}
                          className="border-gray-300 hover:border-blue-500 hover:text-blue-600"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteServiceMutation.mutate(service.id)}
                          disabled={deleteServiceMutation.isPending}
                          className="border-gray-300 hover:border-red-500 hover:text-red-600"
                        >
                          {deleteServiceMutation.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredServices.length === 0 && (
            <div className="text-center py-12">
              <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhum serviço encontrado
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm ? "Tente ajustar sua busca" : "Comece criando seu primeiro serviço"}
              </p>
              <Button 
                onClick={() => {
                  setEditingService(null);
                  resetForm();
                  setIsCreateDialogOpen(true);
                }}
                className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Serviço
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}