import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Testimonial, InsertTestimonial, insertTestimonialSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { RemixIcon } from "@/components/ui/remixicon";
import { Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function AdminTestimonials() {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState<Testimonial | null>(null);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  
  const [formData, setFormData] = useState<InsertTestimonial>({
    name: "",
    company: "",
    avatar: "",
    content: "",
    rating: 5
  });

  const { data: testimonials, isLoading } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
  });

  const addTestimonialMutation = useMutation({
    mutationFn: async (data: InsertTestimonial) => {
      const res = await apiRequest("POST", "/api/testimonials", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
      toast({
        title: "Depoimento adicionado com sucesso",
        description: "O depoimento foi adicionado à lista de depoimentos.",
      });
      setIsAddDialogOpen(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao adicionar depoimento",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const editTestimonialMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertTestimonial> }) => {
      const res = await apiRequest("PUT", `/api/testimonials/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
      toast({
        title: "Depoimento atualizado com sucesso",
        description: "As alterações foram salvas.",
      });
      setIsEditDialogOpen(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao atualizar depoimento",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteTestimonialMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/testimonials/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
      toast({
        title: "Depoimento excluído com sucesso",
        description: "O depoimento foi removido da lista.",
      });
      setIsDeleteDialogOpen(false);
      setCurrentTestimonial(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao excluir depoimento",
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

  const handleRatingChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      rating: parseInt(value)
    }));
    
    // Clear error for rating field
    if (formErrors.rating) {
      setFormErrors(prev => ({
        ...prev,
        rating: ""
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      company: "",
      avatar: "",
      content: "",
      rating: 5
    });
    setFormErrors({});
  };

  const openAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (testimonial: Testimonial) => {
    setCurrentTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      company: testimonial.company,
      avatar: testimonial.avatar,
      content: testimonial.content,
      rating: testimonial.rating
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (testimonial: Testimonial) => {
    setCurrentTestimonial(testimonial);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmit = (isEdit: boolean = false) => {
    try {
      insertTestimonialSchema.parse(formData);
      
      if (isEdit && currentTestimonial) {
        editTestimonialMutation.mutate({
          id: currentTestimonial.id,
          data: formData
        });
      } else {
        addTestimonialMutation.mutate(formData);
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
    if (currentTestimonial) {
      deleteTestimonialMutation.mutate(currentTestimonial.id);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<RemixIcon key={i} name="ri-star-fill text-yellow-400" />);
      } else if (i - 0.5 === rating) {
        stars.push(<RemixIcon key={i} name="ri-star-half-fill text-yellow-400" />);
      } else {
        stars.push(<RemixIcon key={i} name="ri-star-line text-yellow-400" />);
      }
    }
    return stars;
  };

  return (
    <div>
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Gerenciar Depoimentos</h1>
          <p className="text-gray-600">Adicione, edite ou remova depoimentos de clientes.</p>
        </div>
        <Button onClick={openAddDialog} className="flex items-center gap-2">
          <RemixIcon name="ri-add-line" /> Novo Depoimento
        </Button>
      </header>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : testimonials && testimonials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-gray-50">
              <CardHeader>
                <div className="flex items-start mb-4">
                  <div className="flex text-xl">
                    {renderStars(testimonial.rating)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <Avatar className="mr-4">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.company}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => openEditDialog(testimonial)}
                >
                  <RemixIcon name="ri-edit-line mr-1" /> Editar
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                  onClick={() => openDeleteDialog(testimonial)}
                >
                  <RemixIcon name="ri-delete-bin-line mr-1" /> Excluir
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <RemixIcon name="ri-chat-quote-line text-4xl text-gray-400 mb-2" />
          <h3 className="text-lg font-medium text-gray-600">Nenhum depoimento cadastrado</h3>
          <p className="text-gray-500 mb-4">Adicione depoimentos de clientes para exibir na página.</p>
          <Button onClick={openAddDialog}>Adicionar Depoimento</Button>
        </div>
      )}

      {/* Add Testimonial Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Depoimento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Cliente</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={formErrors.name ? "border-red-500" : ""}
              />
              {formErrors.name && (
                <p className="text-red-500 text-sm">{formErrors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Empresa / Cargo</Label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className={formErrors.company ? "border-red-500" : ""}
              />
              {formErrors.company && (
                <p className="text-red-500 text-sm">{formErrors.company}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="avatar">URL da Foto</Label>
              <Input
                id="avatar"
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
                placeholder="https://exemplo.com/avatar.jpg"
                className={formErrors.avatar ? "border-red-500" : ""}
              />
              {formErrors.avatar && (
                <p className="text-red-500 text-sm">{formErrors.avatar}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Depoimento</Label>
              <Textarea
                id="content"
                name="content"
                rows={3}
                value={formData.content}
                onChange={handleChange}
                className={formErrors.content ? "border-red-500" : ""}
              />
              {formErrors.content && (
                <p className="text-red-500 text-sm">{formErrors.content}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Avaliação</Label>
              <RadioGroup 
                value={formData.rating.toString()} 
                onValueChange={handleRatingChange}
                className="flex space-x-4"
              >
                {[1, 2, 3, 4, 5].map((value) => (
                  <div key={value} className="flex items-center space-x-2">
                    <RadioGroupItem value={value.toString()} id={`rating-${value}`} />
                    <Label htmlFor={`rating-${value}`} className="flex">
                      {Array(value).fill(0).map((_, i) => (
                        <RemixIcon key={i} name="ri-star-fill text-yellow-400" />
                      ))}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              {formErrors.rating && (
                <p className="text-red-500 text-sm">{formErrors.rating}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={() => handleSubmit()}
              disabled={addTestimonialMutation.isPending}
            >
              {addTestimonialMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : "Salvar Depoimento"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Testimonial Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Depoimento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nome do Cliente</Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={formErrors.name ? "border-red-500" : ""}
              />
              {formErrors.name && (
                <p className="text-red-500 text-sm">{formErrors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-company">Empresa / Cargo</Label>
              <Input
                id="edit-company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className={formErrors.company ? "border-red-500" : ""}
              />
              {formErrors.company && (
                <p className="text-red-500 text-sm">{formErrors.company}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-avatar">URL da Foto</Label>
              <Input
                id="edit-avatar"
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
                placeholder="https://exemplo.com/avatar.jpg"
                className={formErrors.avatar ? "border-red-500" : ""}
              />
              {formErrors.avatar && (
                <p className="text-red-500 text-sm">{formErrors.avatar}</p>
              )}
              {formData.avatar && (
                <div className="mt-2 flex items-center gap-2">
                  <span>Preview:</span>
                  <Avatar>
                    <AvatarImage 
                      src={formData.avatar} 
                      alt="Preview" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=Error&background=FF0000&color=FFFFFF";
                      }}
                    />
                    <AvatarFallback>{formData.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-content">Depoimento</Label>
              <Textarea
                id="edit-content"
                name="content"
                rows={3}
                value={formData.content}
                onChange={handleChange}
                className={formErrors.content ? "border-red-500" : ""}
              />
              {formErrors.content && (
                <p className="text-red-500 text-sm">{formErrors.content}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Avaliação</Label>
              <RadioGroup 
                value={formData.rating.toString()} 
                onValueChange={handleRatingChange}
                className="flex space-x-4"
              >
                {[1, 2, 3, 4, 5].map((value) => (
                  <div key={value} className="flex items-center space-x-2">
                    <RadioGroupItem value={value.toString()} id={`edit-rating-${value}`} />
                    <Label htmlFor={`edit-rating-${value}`} className="flex">
                      {Array(value).fill(0).map((_, i) => (
                        <RemixIcon key={i} name="ri-star-fill text-yellow-400" />
                      ))}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              {formErrors.rating && (
                <p className="text-red-500 text-sm">{formErrors.rating}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={() => handleSubmit(true)}
              disabled={editTestimonialMutation.isPending}
            >
              {editTestimonialMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Atualizando...
                </>
              ) : "Atualizar Depoimento"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Depoimento</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o depoimento de "{currentTestimonial?.name}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {deleteTestimonialMutation.isPending ? (
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
