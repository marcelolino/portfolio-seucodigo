import { useState } from "react";
import { RemixIcon } from "@/components/ui/remixicon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import { InsertContact, SiteSettings } from "@shared/schema";
import { contactFormSchema } from "@shared/schema";
import { z } from "zod";
import { Skeleton } from "@/components/ui/skeleton";

export function ContactSection() {
  const { toast } = useToast();
  
  // Carregar configurações do site
  const { data: settings, isLoading: isLoadingSettings } = useQuery<SiteSettings>({
    queryKey: ["/api/settings"],
  });
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
    <section id="contato" className="py-16 bg-primary/20 relative overflow-hidden">
      {/* Efeito de círculos concêntricos neon no fundo */}
      <div className="absolute inset-0 z-0">
        {Array.from({ length: 5 }).map((_, i) => (
          <div 
            key={i} 
            className="absolute rounded-full border border-secondary/30"
            style={{ 
              width: `${(i + 1) * 20}%`,
              height: `${(i + 1) * 20}%`,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              opacity: 0.05 + (0.03 * i),
              animation: `pulse ${3 + i}s infinite alternate`
            }}
          ></div>
        ))}
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4 relative inline-block">
            Fale Comigo
            <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-accent"></span>
          </h2>
          <p className="text-foreground/80 max-w-2xl mx-auto">
            Tem um projeto em mente? Entre em contato para conversarmos sobre como posso ajudar.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2 bg-background/60 backdrop-blur-sm border border-secondary/30 rounded-lg p-8 relative group">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-secondary/10 to-accent/10"></div>
            </div>
            
            <h3 className="text-xl font-semibold mb-6 text-foreground relative z-10">Envie uma mensagem</h3>
            <form onSubmit={handleSubmit} className="relative z-10">
              <div className="mb-4">
                <Label htmlFor="name" className="text-foreground/90">Nome</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name}
                  onChange={handleChange}
                  className={`bg-background/40 border-secondary/30 text-foreground focus:border-accent ${formErrors.name ? "border-red-500" : ""}`}
                />
                {formErrors.name && (
                  <p className="text-accent text-sm mt-1">{formErrors.name}</p>
                )}
              </div>
              <div className="mb-4">
                <Label htmlFor="email" className="text-foreground/90">Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  value={formData.email}
                  onChange={handleChange}
                  className={`bg-background/40 border-secondary/30 text-foreground focus:border-accent ${formErrors.email ? "border-red-500" : ""}`}
                />
                {formErrors.email && (
                  <p className="text-accent text-sm mt-1">{formErrors.email}</p>
                )}
              </div>
              <div className="mb-4">
                <Label htmlFor="subject" className="text-foreground/90">Assunto</Label>
                <Input 
                  id="subject" 
                  name="subject" 
                  value={formData.subject}
                  onChange={handleChange}
                  className={`bg-background/40 border-secondary/30 text-foreground focus:border-accent ${formErrors.subject ? "border-red-500" : ""}`}
                />
                {formErrors.subject && (
                  <p className="text-accent text-sm mt-1">{formErrors.subject}</p>
                )}
              </div>
              <div className="mb-6">
                <Label htmlFor="message" className="text-foreground/90">Mensagem</Label>
                <Textarea 
                  id="message" 
                  name="message" 
                  rows={4} 
                  value={formData.message}
                  onChange={handleChange}
                  className={`bg-background/40 border-secondary/30 text-foreground focus:border-accent ${formErrors.message ? "border-red-500" : ""}`}
                />
                {formErrors.message && (
                  <p className="text-accent text-sm mt-1">{formErrors.message}</p>
                )}
              </div>
              <Button 
                type="submit" 
                className="w-full bg-secondary hover:bg-secondary/80 text-foreground neon-button"
                disabled={contactMutation.isPending}
              >
                {contactMutation.isPending ? "Enviando..." : "Enviar Mensagem"}
              </Button>
            </form>
          </div>
          
          <div className="w-full md:w-1/2 bg-background/60 backdrop-blur-sm border border-secondary/30 rounded-lg p-8 relative group">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-bl from-secondary/10 to-accent/10"></div>
            </div>
            
            <h3 className="text-xl font-semibold mb-6 text-foreground relative z-10">Informações de Contato</h3>
            <div className="space-y-6 relative z-10">
              <div className="flex items-start">
                <div className="text-secondary text-xl mr-4 neon-glow">
                  <RemixIcon name="ri-map-pin-line" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Endereço</h4>
                  {isLoadingSettings ? (
                    <Skeleton className="h-5 w-48 bg-secondary/20" />
                  ) : (
                    <p className="text-foreground/70">{settings?.address || 'São Paulo, SP - Brasil'}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="text-secondary text-xl mr-4 neon-glow">
                  <RemixIcon name="ri-mail-line" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Email</h4>
                  {isLoadingSettings ? (
                    <Skeleton className="h-5 w-48 bg-secondary/20" />
                  ) : (
                    <p className="text-foreground/70">{settings?.contactEmail || 'contato@seucodigo.com'}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="text-secondary text-xl mr-4 neon-glow">
                  <RemixIcon name="ri-phone-line" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Telefone</h4>
                  {isLoadingSettings ? (
                    <Skeleton className="h-5 w-48 bg-secondary/20" />
                  ) : (
                    <p className="text-foreground/70">{settings?.contactPhone || '(62) 3202-8119'}</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-8 relative z-10">
              <h4 className="font-semibold mb-4 text-foreground">Siga-me nas redes sociais</h4>
              <div className="flex space-x-6">
                {settings?.github && (
                  <a href={settings.github} target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-accent transition-colors text-2xl neon-glow">
                    <RemixIcon name="ri-github-fill" />
                  </a>
                )}
                {settings?.linkedin && (
                  <a href={settings.linkedin} target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-accent transition-colors text-2xl neon-glow">
                    <RemixIcon name="ri-linkedin-box-fill" />
                  </a>
                )}
                {settings?.twitter && (
                  <a href={settings.twitter} target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-accent transition-colors text-2xl neon-glow">
                    <RemixIcon name="ri-twitter-fill" />
                  </a>
                )}
                {settings?.instagram && (
                  <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-accent transition-colors text-2xl neon-glow">
                    <RemixIcon name="ri-instagram-fill" />
                  </a>
                )}
              </div>
            </div>
            
            <div className="mt-8 relative z-10">
              <a 
                href={settings?.whatsapp ? `https://wa.me/${settings.whatsapp.replace(/\D/g, '')}` : 'https://wa.me/5511999988888'} 
                className="flex items-center justify-center gap-2 font-medium text-foreground bg-accent/90 hover:bg-accent transition-colors px-6 py-3 rounded-md neon-button"
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
