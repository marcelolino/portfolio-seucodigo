import { useState } from "react";
import { RemixIcon } from "@/components/ui/remixicon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { InsertContact } from "@shared/schema";
import { contactFormSchema } from "@shared/schema";
import { z } from "zod";

export function ContactSection() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  
  const contactMutation = useMutation({
    mutationFn: async (data: InsertContact) => {
      const res = await apiRequest("POST", "/api/contacts", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Mensagem enviada com sucesso!",
        description: "Entraremos em contato em breve.",
      });
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao enviar mensagem",
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
    
    // Clear the error for this field when it's changed
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      contactFormSchema.parse(formData);
      contactMutation.mutate(formData);
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

  return (
    <section id="contato" className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-dark mb-4">Fale Comigo</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Tem um projeto em mente? Entre em contato para conversarmos sobre como posso ajudar.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2 bg-white rounded-lg shadow-md p-8">
            <h3 className="text-xl font-semibold mb-6">Envie uma mensagem</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <Label htmlFor="name">Nome</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name}
                  onChange={handleChange}
                  className={formErrors.name ? "border-red-500" : ""}
                />
                {formErrors.name && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                )}
              </div>
              <div className="mb-4">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  value={formData.email}
                  onChange={handleChange}
                  className={formErrors.email ? "border-red-500" : ""}
                />
                {formErrors.email && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                )}
              </div>
              <div className="mb-4">
                <Label htmlFor="subject">Assunto</Label>
                <Input 
                  id="subject" 
                  name="subject" 
                  value={formData.subject}
                  onChange={handleChange}
                  className={formErrors.subject ? "border-red-500" : ""}
                />
                {formErrors.subject && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.subject}</p>
                )}
              </div>
              <div className="mb-6">
                <Label htmlFor="message">Mensagem</Label>
                <Textarea 
                  id="message" 
                  name="message" 
                  rows={4} 
                  value={formData.message}
                  onChange={handleChange}
                  className={formErrors.message ? "border-red-500" : ""}
                />
                {formErrors.message && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.message}</p>
                )}
              </div>
              <Button 
                type="submit" 
                className="w-full"
                disabled={contactMutation.isPending}
              >
                {contactMutation.isPending ? "Enviando..." : "Enviar Mensagem"}
              </Button>
            </form>
          </div>
          
          <div className="w-full md:w-1/2 bg-white rounded-lg shadow-md p-8">
            <h3 className="text-xl font-semibold mb-6">Informações de Contato</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="text-primary text-xl mr-4">
                  <RemixIcon name="ri-map-pin-line" />
                </div>
                <div>
                  <h4 className="font-medium">Endereço</h4>
                  <p className="text-gray-600">São Paulo, SP - Brasil</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="text-primary text-xl mr-4">
                  <RemixIcon name="ri-mail-line" />
                </div>
                <div>
                  <h4 className="font-medium">Email</h4>
                  <p className="text-gray-600">contato@seucodigo.com</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="text-primary text-xl mr-4">
                  <RemixIcon name="ri-phone-line" />
                </div>
                <div>
                  <h4 className="font-medium">Telefone</h4>
                  <p className="text-gray-600">(11) 9999-8888</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h4 className="font-semibold mb-4">Siga-me nas redes sociais</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-600 hover:text-primary transition-colors">
                  <RemixIcon name="ri-github-fill text-2xl" />
                </a>
                <a href="#" className="text-gray-600 hover:text-primary transition-colors">
                  <RemixIcon name="ri-linkedin-box-fill text-2xl" />
                </a>
                <a href="#" className="text-gray-600 hover:text-primary transition-colors">
                  <RemixIcon name="ri-twitter-fill text-2xl" />
                </a>
                <a href="#" className="text-gray-600 hover:text-primary transition-colors">
                  <RemixIcon name="ri-instagram-fill text-2xl" />
                </a>
              </div>
            </div>
            
            <div className="mt-8">
              <a 
                href="https://wa.me/5511999988888" 
                className="flex items-center justify-center gap-2 font-medium text-white bg-green-500 hover:bg-green-600 transition-colors px-6 py-3 rounded-md"
                target="_blank"
                rel="noopener noreferrer"
              >
                <RemixIcon name="ri-whatsapp-line" /> Fale pelo WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
