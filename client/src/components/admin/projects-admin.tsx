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
import type { Project, InsertProject } from "@shared/schema";
import { 
  Loader2, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  FolderOpen, 
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

export function ProjectsAdmin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imagePreviews, setImagePreviews] = useState<{
    main: string | null;
    preview1: string | null;
    preview2: string | null;
    preview3: string | null;
    preview4: string | null;
  }>({
    main: null,
    preview1: null,
    preview2: null,
    preview3: null,
    preview4: null,
  });

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const createProjectMutation = useMutation({
    mutationFn: async (projectData: InsertProject) => {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      });
      if (!response.ok) {
        throw new Error("Failed to create project");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      setIsCreateDialogOpen(false);
      resetForm();
      toast({
        title: "✅ Sucesso",
        description: "Projeto criado com sucesso!",
      });
    },
    onError: () => {
      toast({
        title: "❌ Erro",
        description: "Erro ao criar projeto.",
        variant: "destructive",
      });
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: async ({ id, ...projectData }: Partial<Project> & { id: number }) => {
      const response = await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      });
      if (!response.ok) {
        throw new Error("Failed to update project");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      setEditingProject(null);
      resetForm();
      toast({
        title: "✅ Sucesso",
        description: "Projeto atualizado com sucesso!",
      });
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete project");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "✅ Sucesso",
        description: "Projeto excluído com sucesso!",
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
    setImagePreviews({
      main: null,
      preview1: null,
      preview2: null,
      preview3: null,
      preview4: null,
    });
  };

  // Handle image file upload
  const handleImageUpload = (imageType: 'main' | 'preview1' | 'preview2' | 'preview3' | 'preview4') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreviews(prev => ({ ...prev, [imageType]: result }));
        
        if (imageType === 'main') {
          setFormData(prev => ({ ...prev, image: result }));
        } else if (imageType === 'preview1') {
          setFormData(prev => ({ ...prev, previewImage1: result }));
        } else if (imageType === 'preview2') {
          setFormData(prev => ({ ...prev, previewImage2: result }));
        } else if (imageType === 'preview3') {
          setFormData(prev => ({ ...prev, previewImage3: result }));
        } else if (imageType === 'preview4') {
          setFormData(prev => ({ ...prev, previewImage4: result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (imageType: 'main' | 'preview1' | 'preview2' | 'preview3' | 'preview4') => () => {
    setImagePreviews(prev => ({ ...prev, [imageType]: null }));
    
    if (imageType === 'main') {
      setFormData(prev => ({ ...prev, image: "" }));
    } else if (imageType === 'preview1') {
      setFormData(prev => ({ ...prev, previewImage1: "" }));
    } else if (imageType === 'preview2') {
      setFormData(prev => ({ ...prev, previewImage2: "" }));
    } else if (imageType === 'preview3') {
      setFormData(prev => ({ ...prev, previewImage3: "" }));
    } else if (imageType === 'preview4') {
      setFormData(prev => ({ ...prev, previewImage4: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const projectData: InsertProject = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      price: formData.price ? formData.price : undefined,
      technologies: formData.technologies.split(",").map(t => t.trim()),
      status: formData.status,
      image: formData.image || "",
      previewImage1: imagePreviews.preview1 || undefined,
      previewImage2: imagePreviews.preview2 || undefined,
      previewImage3: imagePreviews.preview3 || undefined,
      previewImage4: imagePreviews.preview4 || undefined,
    };

    if (editingProject) {
      updateProjectMutation.mutate({ ...projectData, id: editingProject.id });
    } else {
      createProjectMutation.mutate(projectData);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description || "",
      category: project.category || "",
      price: project.price?.toString() || "",
      technologies: project.technologies?.join(", ") || "",
      status: project.status as "active",
      image: project.image || "",
    });
    // Carregar preview da imagem se existir
    if (project.image) {
      setImagePreview(project.image);
    } else {
      setImagePreview(null);
    }
    setImagePreviews({
      main: project.image || null,
      preview1: project.previewImage1 || null,
      preview2: project.previewImage2 || null,
      preview3: project.previewImage3 || null,
      preview4: project.previewImage4 || null,
    });
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

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.category?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
            <FolderOpen className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              📁 Gerenciar Projetos
            </h1>
            <p className="text-slate-600 text-lg">Gerencie seu portfólio de projetos</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm">Total de Projetos</p>
                  <p className="text-2xl font-bold">{projects.length}</p>
                </div>
                <FolderOpen className="w-8 h-8 text-emerald-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Projetos Ativos</p>
                  <p className="text-2xl font-bold">
                    {projects.filter(p => p.status === "active").length}
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
                    {projects.filter(p => p.status === "in_progress").length}
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
                    {projects.filter(p => p.status === "completed").length}
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
              placeholder="Buscar projetos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-4 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={() => {
                  setEditingProject(null);
                  resetForm();
                }}
              >
                <Plus className="w-5 h-5 mr-2" />
                Novo Projeto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-gray-900">
                  {editingProject ? "Editar Projeto" : "Criar Novo Projeto"}
                </DialogTitle>
                <DialogDescription>
                  {editingProject ? "Atualize as informações do projeto" : "Adicione um novo projeto ao seu portfólio"}
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="title" className="text-sm font-semibold text-gray-700 mb-2 block">
                      Nome do Projeto *
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Digite o nome do projeto"
                      required
                      className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
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
                      placeholder="Ex: Web Development, Mobile App"
                      required
                      className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
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
                      className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
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
                      <SelectTrigger className="border-gray-300 focus:border-purple-500 focus:ring-purple-500">
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
                    Descrição
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descreva o projeto..."
                    rows={3}
                    className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <Label htmlFor="technologies" className="text-sm font-semibold text-gray-700 mb-2 block">
                    Tecnologias
                  </Label>
                  <Input
                    id="technologies"
                    value={formData.technologies}
                    onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                    placeholder="React, Node.js, PostgreSQL (separadas por vírgula)"
                    className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                    <Image className="w-4 h-4 inline mr-1" />
                    Imagem Principal do Projeto
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-purple-400 transition-colors">
                    {imagePreviews.main ? (
                      <div className="space-y-3">
                        <div className="relative">
                          <img 
                            src={imagePreviews.main} 
                            alt="Preview" 
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={removeImage('main')}
                          >
                            Remover Imagem
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-col items-center justify-center py-4">
                          <div className="text-4xl text-gray-400 mb-2">
                            <Image className="w-8 h-8" />
                          </div>
                          <p className="text-gray-500 mb-2">Clique para fazer upload da imagem</p>
                          <p className="text-xs text-gray-400">PNG, JPG ou GIF (máximo 5MB)</p>
                        </div>
                        <input
                          type="file"
                          id="projectImage"
                          name="projectImage"
                          onChange={handleImageUpload('main')}
                          accept="image/png, image/jpeg, image/gif"
                          className="hidden"
                        />
                        <Button
                          variant="outline"
                          onClick={() => document.getElementById("projectImage")?.click()}
                          type="button"
                          className="w-full"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Escolher Arquivo
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Imagens de Preview (4 imagens para exibir na home)
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 hover:border-purple-400 transition-colors">
                      {imagePreviews.preview1 ? (
                        <div className="space-y-2">
                          <img 
                            src={imagePreviews.preview1} 
                            alt="Preview 1" 
                            className="w-full h-24 object-cover rounded"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={removeImage('preview1')}
                            className="w-full text-xs"
                          >
                            Remover
                          </Button>
                        </div>
                      ) : (
                        <>
                          <input
                            type="file"
                            id="previewImage1"
                            onChange={handleImageUpload('preview1')}
                            accept="image/*"
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById('previewImage1')?.click()}
                            className="w-full text-xs"
                          >
                            <Upload className="w-3 h-3 mr-1" />
                            Preview 1
                          </Button>
                        </>
                      )}
                    </div>

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 hover:border-purple-400 transition-colors">
                      {imagePreviews.preview2 ? (
                        <div className="space-y-2">
                          <img 
                            src={imagePreviews.preview2} 
                            alt="Preview 2" 
                            className="w-full h-24 object-cover rounded"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={removeImage('preview2')}
                            className="w-full text-xs"
                          >
                            Remover
                          </Button>
                        </div>
                      ) : (
                        <>
                          <input
                            type="file"
                            id="previewImage2"
                            onChange={handleImageUpload('preview2')}
                            accept="image/*"
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById('previewImage2')?.click()}
                            className="w-full text-xs"
                          >
                            <Upload className="w-3 h-3 mr-1" />
                            Preview 2
                          </Button>
                        </>
                      )}
                    </div>

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 hover:border-purple-400 transition-colors">
                      {imagePreviews.preview3 ? (
                        <div className="space-y-2">
                          <img 
                            src={imagePreviews.preview3} 
                            alt="Preview 3" 
                            className="w-full h-24 object-cover rounded"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={removeImage('preview3')}
                            className="w-full text-xs"
                          >
                            Remover
                          </Button>
                        </div>
                      ) : (
                        <>
                          <input
                            type="file"
                            id="previewImage3"
                            onChange={handleImageUpload('preview3')}
                            accept="image/*"
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById('previewImage3')?.click()}
                            className="w-full text-xs"
                          >
                            <Upload className="w-3 h-3 mr-1" />
                            Preview 3
                          </Button>
                        </>
                      )}
                    </div>

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 hover:border-purple-400 transition-colors">
                      {imagePreviews.preview4 ? (
                        <div className="space-y-2">
                          <img 
                            src={imagePreviews.preview4} 
                            alt="Preview 4" 
                            className="w-full h-24 object-cover rounded"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={removeImage('preview4')}
                            className="w-full text-xs"
                          >
                            Remover
                          </Button>
                        </div>
                      ) : (
                        <>
                          <input
                            type="file"
                            id="previewImage4"
                            onChange={handleImageUpload('preview4')}
                            accept="image/*"
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById('previewImage4')?.click()}
                            className="w-full text-xs"
                          >
                            <Upload className="w-3 h-3 mr-1" />
                            Preview 4
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                    className="px-6"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit"
                    disabled={createProjectMutation.isPending || updateProjectMutation.isPending}
                    className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold px-6 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {createProjectMutation.isPending || updateProjectMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    {editingProject ? "Atualizar" : "Criar"} Projeto
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Projects Table */}
      <Card className="border-0 shadow-xl bg-white rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-100">
          <CardTitle className="text-xl font-bold text-gray-900">
            Lista de Projetos ({filteredProjects.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50">
                  <TableHead className="font-semibold text-gray-700">Nome</TableHead>
                  <TableHead className="font-semibold text-gray-700">Categoria</TableHead>
                  <TableHead className="font-semibold text-gray-700">Preço</TableHead>
                  <TableHead className="font-semibold text-gray-700">Status</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.map((project) => (
                  <TableRow key={project.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {project.image ? (
                          <img 
                            src={project.image} 
                            alt={project.title}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                            <FolderOpen className="w-5 h-5 text-purple-600" />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-900">{project.title}</p>
                          <p className="text-sm text-gray-500 truncate max-w-xs">
                            {project.description}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {project.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {project.price ? (
                        <span className="font-semibold text-emerald-600">
                          R$ {Number(project.price).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      ) : (
                        <span className="text-gray-400">Não informado</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(project.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(project)}
                          className="border-gray-300 hover:border-purple-500 hover:text-purple-600"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteProjectMutation.mutate(project.id)}
                          disabled={deleteProjectMutation.isPending}
                          className="border-gray-300 hover:border-red-500 hover:text-red-600"
                        >
                          {deleteProjectMutation.isPending ? (
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
          
          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhum projeto encontrado
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm ? "Tente ajustar sua busca" : "Comece criando seu primeiro projeto"}
              </p>
              {!searchTerm && (
                <Button 
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeiro Projeto
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}