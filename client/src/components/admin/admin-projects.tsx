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
    order: 0,
    price: "0"
  });
  
  const [technologyInput, setTechnologyInput] = useState("");
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

  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const addProjectMutation = useMutation({
    mutationFn: async (data: InsertProject) => {
      const res = await apiRequest("POST", "/api/projects", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
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

  const editProjectMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertProject> }) => {
      const res = await apiRequest("PUT", `/api/projects/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Projeto atualizado com sucesso",
        description: "As alterações foram salvas.",
      });
      setIsEditDialogOpen(false);
      resetForm();
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
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Projeto excluído com sucesso",
        description: "O projeto foi removido do portfólio.",
      });
      setIsDeleteDialogOpen(false);
      setCurrentProject(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao excluir projeto",
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

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "Web",
      technologies: [],
      image: "",
      previewImage1: "",
      previewImage2: "",
      previewImage3: "",
      previewImage4: "",
      featured: false,
      order: 0
    });
    setTechnologyInput("");
    setFormErrors({});
    setImagePreviews({
      main: null,
      preview1: null,
      preview2: null,
      preview3: null,
      preview4: null,
    });
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
      previewImage1: project.previewImage1 || "",
      previewImage2: project.previewImage2 || "",
      previewImage3: project.previewImage3 || "",
      previewImage4: project.previewImage4 || "",
      featured: project.featured ?? false,
      order: project.order ?? 0
    });
    setImagePreviews({
      main: project.image || null,
      preview1: project.previewImage1 || null,
      preview2: project.previewImage2 || null,
      preview3: project.previewImage3 || null,
      preview4: project.previewImage4 || null,
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
        editProjectMutation.mutate({
          id: currentProject.id,
          data: formData
        });
      } else {
        addProjectMutation.mutate(formData);
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
    if (currentProject) {
      deleteProjectMutation.mutate(currentProject.id);
    }
  };

  return (
    <div>
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Gerenciar Projetos</h1>
          <p className="text-gray-600">Adicione, edite ou remova projetos do portfólio.</p>
        </div>
        <Button onClick={openAddDialog} className="flex items-center gap-2">
          <RemixIcon name="ri-add-line" /> Novo Projeto
        </Button>
      </header>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : projects && projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {project.technologies.map((tech, index) => (
                    <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => openEditDialog(project)}
                >
                  <RemixIcon name="ri-edit-line mr-1" /> Editar
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                  onClick={() => openDeleteDialog(project)}
                >
                  <RemixIcon name="ri-delete-bin-line mr-1" /> Excluir
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <RemixIcon name="ri-folder-add-line text-4xl text-gray-400 mb-2" />
          <h3 className="text-lg font-medium text-gray-600">Nenhum projeto cadastrado</h3>
          <p className="text-gray-500 mb-4">Adicione projetos para exibir no portfólio.</p>
          <Button onClick={openAddDialog}>Adicionar Projeto</Button>
        </div>
      )}

      {/* Add Project Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Projeto</DialogTitle>
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
              <Label htmlFor="image">Imagem Principal do Projeto</Label>
              <div className="border-2 border-dashed rounded-lg p-4">
                {imagePreviews.main ? (
                  <div className="space-y-2">
                    <img 
                      src={imagePreviews.main} 
                      alt="Preview" 
                      className="w-full h-40 object-cover rounded"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={removeImage('main')}
                      className="w-full"
                      data-testid="button-remove-main-image"
                    >
                      Remover Imagem
                    </Button>
                  </div>
                ) : (
                  <>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload('main')}
                      className="hidden"
                      data-testid="input-main-image"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('image')?.click()}
                      className="w-full"
                      data-testid="button-upload-main-image"
                    >
                      Escolher Arquivo
                    </Button>
                  </>
                )}
              </div>
              {formErrors.image && (
                <p className="text-red-500 text-sm">{formErrors.image}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Imagens de Preview (4 imagens para exibir na home)</Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="border-2 border-dashed rounded-lg p-2">
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
                        data-testid="button-remove-preview1"
                      >
                        Remover
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Input
                        id="previewImage1"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload('preview1')}
                        className="hidden"
                        data-testid="input-preview1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('previewImage1')?.click()}
                        className="w-full text-xs"
                        data-testid="button-upload-preview1"
                      >
                        Preview 1
                      </Button>
                    </>
                  )}
                </div>
                <div className="border-2 border-dashed rounded-lg p-2">
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
                        data-testid="button-remove-preview2"
                      >
                        Remover
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Input
                        id="previewImage2"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload('preview2')}
                        className="hidden"
                        data-testid="input-preview2"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('previewImage2')?.click()}
                        className="w-full text-xs"
                        data-testid="button-upload-preview2"
                      >
                        Preview 2
                      </Button>
                    </>
                  )}
                </div>
                <div className="border-2 border-dashed rounded-lg p-2">
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
                        data-testid="button-remove-preview3"
                      >
                        Remover
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Input
                        id="previewImage3"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload('preview3')}
                        className="hidden"
                        data-testid="input-preview3"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('previewImage3')?.click()}
                        className="w-full text-xs"
                        data-testid="button-upload-preview3"
                      >
                        Preview 3
                      </Button>
                    </>
                  )}
                </div>
                <div className="border-2 border-dashed rounded-lg p-2">
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
                        data-testid="button-remove-preview4"
                      >
                        Remover
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Input
                        id="previewImage4"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload('preview4')}
                        className="hidden"
                        data-testid="input-preview4"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('previewImage4')?.click()}
                        className="w-full text-xs"
                        data-testid="button-upload-preview4"
                      >
                        Preview 4
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Valor do Projeto (R$)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price || ""}
                onChange={handleChange}
                placeholder="0.00"
                className={formErrors.price ? "border-red-500" : ""}
              />
              {formErrors.price && (
                <p className="text-red-500 text-sm">{formErrors.price}</p>
              )}
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
              ) : "Salvar Projeto"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Project Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Projeto</DialogTitle>
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
              <Label htmlFor="edit-image">Imagem Principal do Projeto</Label>
              <div className="border-2 border-dashed rounded-lg p-4">
                {imagePreviews.main ? (
                  <div className="space-y-2">
                    <img 
                      src={imagePreviews.main} 
                      alt="Preview" 
                      className="w-full h-40 object-cover rounded"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={removeImage('main')}
                      className="w-full"
                      data-testid="button-remove-edit-main-image"
                    >
                      Remover Imagem
                    </Button>
                  </div>
                ) : (
                  <>
                    <Input
                      id="edit-image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload('main')}
                      className="hidden"
                      data-testid="input-edit-main-image"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('edit-image')?.click()}
                      className="w-full"
                      data-testid="button-upload-edit-main-image"
                    >
                      Escolher Arquivo
                    </Button>
                  </>
                )}
              </div>
              {formErrors.image && (
                <p className="text-red-500 text-sm">{formErrors.image}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Imagens de Preview (4 imagens para exibir na home)</Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="border-2 border-dashed rounded-lg p-2">
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
                        data-testid="button-remove-edit-preview1"
                      >
                        Remover
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Input
                        id="edit-previewImage1"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload('preview1')}
                        className="hidden"
                        data-testid="input-edit-preview1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('edit-previewImage1')?.click()}
                        className="w-full text-xs"
                        data-testid="button-upload-edit-preview1"
                      >
                        Preview 1
                      </Button>
                    </>
                  )}
                </div>
                <div className="border-2 border-dashed rounded-lg p-2">
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
                        data-testid="button-remove-edit-preview2"
                      >
                        Remover
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Input
                        id="edit-previewImage2"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload('preview2')}
                        className="hidden"
                        data-testid="input-edit-preview2"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('edit-previewImage2')?.click()}
                        className="w-full text-xs"
                        data-testid="button-upload-edit-preview2"
                      >
                        Preview 2
                      </Button>
                    </>
                  )}
                </div>
                <div className="border-2 border-dashed rounded-lg p-2">
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
                        data-testid="button-remove-edit-preview3"
                      >
                        Remover
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Input
                        id="edit-previewImage3"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload('preview3')}
                        className="hidden"
                        data-testid="input-edit-preview3"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('edit-previewImage3')?.click()}
                        className="w-full text-xs"
                        data-testid="button-upload-edit-preview3"
                      >
                        Preview 3
                      </Button>
                    </>
                  )}
                </div>
                <div className="border-2 border-dashed rounded-lg p-2">
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
                        data-testid="button-remove-edit-preview4"
                      >
                        Remover
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Input
                        id="edit-previewImage4"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload('preview4')}
                        className="hidden"
                        data-testid="input-edit-preview4"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('edit-previewImage4')?.click()}
                        className="w-full text-xs"
                        data-testid="button-upload-edit-preview4"
                      >
                        Preview 4
                      </Button>
                    </>
                  )}
                </div>
              </div>
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
              disabled={editProjectMutation.isPending}
            >
              {editProjectMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Atualizando...
                </>
              ) : "Atualizar Projeto"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Projeto</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o projeto "{currentProject?.title}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {deleteProjectMutation.isPending ? (
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
