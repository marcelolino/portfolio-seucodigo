import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Project, InsertProject, insertProjectSchema } from "@shared/schema";
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
import { Badge } from "@/components/ui/badge";
import { RemixIcon } from "@/components/ui/remixicon";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function AdminProjects() {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  
  const [formData, setFormData] = useState<InsertProject>({
    title: "",
    description: "",
    category: "Web",
    technologies: [],
    image: "",
    featured: false,
    order: 0
  });
  
  const [technologyInput, setTechnologyInput] = useState("");

  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const addProjectMutation = useMutation({
    mutationFn: async (data: InsertProject) => {
      const res = await apiRequest("POST", "/api/projects", data);
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      // Atualize o cache diretamente para evitar necessidade de refresh
      queryClient.setQueryData(["/api/projects"], (oldData: Project[] | undefined) => {
        return oldData ? [...oldData, data] : [data];
      });
      toast({
        title: "Projeto adicionado com sucesso",
        description: "O projeto foi adicionado ao portfólio.",
      });
      setIsAddDialogOpen(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao adicionar projeto",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertProject> }) => {
      const res = await apiRequest("PATCH", `/api/projects/${id}`, data);
      return await res.json();
    },
    onSuccess: (updatedProject) => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      // Atualiza o cache diretamente para evitar necessidade de refresh
      queryClient.setQueryData(["/api/projects"], (oldData: Project[] | undefined) => {
        if (!oldData) return [updatedProject];
        return oldData.map(project => 
          project.id === updatedProject.id ? updatedProject : project
        );
      });
      toast({
        title: "Projeto atualizado com sucesso",
        description: "As alterações foram salvas.",
      });
      setIsEditDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao atualizar projeto",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/projects/${id}`);
    },
    onSuccess: () => {
      // Atualiza o cache diretamente para evitar necessidade de refresh
      queryClient.setQueryData(["/api/projects"], (oldData: Project[] | undefined) => {
        if (!oldData) return [];
        return oldData.filter(project => project.id !== currentProject?.id);
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      
      toast({
        title: "Projeto excluído com sucesso",
        description: "O projeto foi removido do portfólio.",
      });
      setIsDeleteDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao excluir projeto",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
  
  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      featured: checked
    }));
  };
  
  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      category: value
    }));
  };

  const handleTechnologyAdd = () => {
    if (technologyInput.trim()) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, technologyInput.trim()]
      }));
      setTechnologyInput("");
    }
  };

  const handleTechnologyRemove = (techToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(tech => tech !== techToRemove)
    }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "Web",
      technologies: [],
      image: "",
      featured: false,
      order: 0
    });
    setTechnologyInput("");
    setFormErrors({});
  };

  const openAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (project: Project) => {
    setCurrentProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      category: project.category,
      technologies: [...project.technologies],
      image: project.image,
      featured: project.featured ?? false,
      order: project.order ?? 0
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (project: Project) => {
    setCurrentProject(project);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmit = (isEdit: boolean = false) => {
    try {
      insertProjectSchema.parse(formData);
      
      if (isEdit && currentProject) {
        updateProjectMutation.mutate({ id: currentProject.id, data: formData });
      } else {
        addProjectMutation.mutate(formData);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          if (err.path) {
            errors[err.path[0]] = err.message;
          }
        });
        setFormErrors(errors);
        
        toast({
          title: "Formulário inválido",
          description: "Por favor, corrija os erros no formulário.",
          variant: "destructive",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Projetos</h2>
        <Button onClick={openAddDialog}>
          <RemixIcon name="ri-add-line" className="mr-2 h-4 w-4" />
          Novo Projeto
        </Button>
      </div>
      
      <Separator />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects?.map((project) => (
          <Card key={project.id} className="overflow-hidden flex flex-col">
            <div className="relative aspect-video overflow-hidden">
              <img
                src={project.image}
                alt={project.title}
                className="object-cover w-full h-full"
              />
              {project.featured && (
                <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-md">
                  Destacado
                </span>
              )}
            </div>
            <CardHeader className="pb-2">
              <CardTitle>{project.title}</CardTitle>
              <Badge>{project.category}</Badge>
            </CardHeader>
            <CardContent className="pb-3 flex-grow">
              <p className="text-muted-foreground text-sm line-clamp-3">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-1 mt-3">
                {project.technologies.map((tech, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-3 flex justify-end space-x-2">
              <Button variant="outline" size="sm" onClick={() => openEditDialog(project)}>
                <RemixIcon name="ri-edit-line" className="mr-1" />
                Editar
              </Button>
              <Button variant="destructive" size="sm" onClick={() => openDeleteDialog(project)}>
                <RemixIcon name="ri-delete-bin-line" className="mr-1" />
                Excluir
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Adicionar Projeto</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
              />
              {formErrors.title && (
                <p className="text-red-500 text-sm">{formErrors.title}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Categoria</Label>
                <Select value={formData.category} onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Web">Web</SelectItem>
                    <SelectItem value="Mobile">Mobile</SelectItem>
                    <SelectItem value="Desktop">Desktop</SelectItem>
                    <SelectItem value="API">API</SelectItem>
                    <SelectItem value="Outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
                {formErrors.category && (
                  <p className="text-red-500 text-sm">{formErrors.category}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="order">Ordem</Label>
                <Input
                  id="order"
                  name="order"
                  type="number"
                  value={formData.order?.toString() || "0"}
                  onChange={handleInputChange}
                />
                {formErrors.order && (
                  <p className="text-red-500 text-sm">{formErrors.order}</p>
                )}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
              />
              {formErrors.description && (
                <p className="text-red-500 text-sm">{formErrors.description}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="image">URL da Imagem</Label>
              <Input
                id="image"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="https://exemplo.com/imagem.jpg"
              />
              {formErrors.image && (
                <p className="text-red-500 text-sm">{formErrors.image}</p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="featured"
                checked={formData.featured === true}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="featured">Projeto Destacado</Label>
            </div>
            <div className="space-y-2">
              <Label>Tecnologias</Label>
              <div className="flex items-center gap-2">
                <Input
                  value={technologyInput}
                  onChange={(e) => setTechnologyInput(e.target.value)}
                  placeholder="Adicionar tecnologia"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleTechnologyAdd();
                    }
                  }}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleTechnologyAdd}
                  size="icon"
                >
                  <RemixIcon name="ri-add-line" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.technologies.map((tech, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1 bg-blue-100 text-blue-800">
                    {tech}
                    <button 
                      type="button" 
                      onClick={() => handleTechnologyRemove(tech)}
                      className="text-blue-800 hover:text-blue-900 focus:outline-none"
                    >
                      <RemixIcon name="ri-close-line" />
                    </button>
                  </Badge>
                ))}
              </div>
              {formErrors.technologies && (
                <p className="text-red-500 text-sm">{formErrors.technologies}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={() => handleSubmit()}
              disabled={addProjectMutation.isPending}
            >
              {addProjectMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Adicionar Projeto"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Editar Projeto</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title-edit">Título</Label>
              <Input
                id="title-edit"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
              />
              {formErrors.title && (
                <p className="text-red-500 text-sm">{formErrors.title}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category-edit">Categoria</Label>
                <Select value={formData.category} onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Web">Web</SelectItem>
                    <SelectItem value="Mobile">Mobile</SelectItem>
                    <SelectItem value="Desktop">Desktop</SelectItem>
                    <SelectItem value="API">API</SelectItem>
                    <SelectItem value="Outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
                {formErrors.category && (
                  <p className="text-red-500 text-sm">{formErrors.category}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="order-edit">Ordem</Label>
                <Input
                  id="order-edit"
                  name="order"
                  type="number"
                  value={formData.order?.toString() || "0"}
                  onChange={handleInputChange}
                />
                {formErrors.order && (
                  <p className="text-red-500 text-sm">{formErrors.order}</p>
                )}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description-edit">Descrição</Label>
              <Textarea
                id="description-edit"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
              />
              {formErrors.description && (
                <p className="text-red-500 text-sm">{formErrors.description}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="image-edit">URL da Imagem</Label>
              <Input
                id="image-edit"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="https://exemplo.com/imagem.jpg"
              />
              {formErrors.image && (
                <p className="text-red-500 text-sm">{formErrors.image}</p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="featured-edit"
                checked={formData.featured === true}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="featured-edit">Projeto Destacado</Label>
            </div>
            <div className="space-y-2">
              <Label>Tecnologias</Label>
              <div className="flex items-center gap-2">
                <Input
                  value={technologyInput}
                  onChange={(e) => setTechnologyInput(e.target.value)}
                  placeholder="Adicionar tecnologia"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleTechnologyAdd();
                    }
                  }}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleTechnologyAdd}
                  size="icon"
                >
                  <RemixIcon name="ri-add-line" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.technologies.map((tech, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1 bg-blue-100 text-blue-800">
                    {tech}
                    <button 
                      type="button" 
                      onClick={() => handleTechnologyRemove(tech)}
                      className="text-blue-800 hover:text-blue-900 focus:outline-none"
                    >
                      <RemixIcon name="ri-close-line" />
                    </button>
                  </Badge>
                ))}
              </div>
              {formErrors.technologies && (
                <p className="text-red-500 text-sm">{formErrors.technologies}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={() => handleSubmit(true)}
              disabled={updateProjectMutation.isPending}
            >
              {updateProjectMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar Alterações"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o projeto
              <strong> {currentProject?.title}</strong> do seu portfólio.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => currentProject && deleteProjectMutation.mutate(currentProject.id)}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              disabled={deleteProjectMutation.isPending}
            >
              {deleteProjectMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Excluindo...
                </>
              ) : (
                "Sim, excluir projeto"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}