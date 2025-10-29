import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { RemixIcon } from "@/components/ui/remixicon";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SiteSettingsForm {
  siteName: string;
  siteTitle: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  logo: string;
  github: string;
  linkedin: string;
  twitter: string;
  instagram: string;
  whatsapp: string;
}

export function AdminSettings() {
  const { toast } = useToast();
  const [uploadedLogo, setUploadedLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  
  // Carregar configurações existentes
  const { data: settings, isLoading } = useQuery({
    queryKey: ["/api/settings"],
  });
  
  // Form state
  const [formData, setFormData] = useState<SiteSettingsForm>({
    siteName: "",
    siteTitle: "",
    contactEmail: "",
    contactPhone: "",
    address: "",
    logo: "",
    github: "",
    linkedin: "",
    twitter: "",
    instagram: "",
    whatsapp: "",
  });
  
  // Atualizar form state quando os dados forem carregados
  useEffect(() => {
    if (settings) {
      setFormData({
        siteName: settings.siteName || "",
        siteTitle: settings.siteTitle || "",
        contactEmail: settings.contactEmail || "",
        contactPhone: settings.contactPhone || "",
        address: settings.address || "",
        logo: settings.logo || "",
        github: settings.github || "",
        linkedin: settings.linkedin || "",
        twitter: settings.twitter || "",
        instagram: settings.instagram || "",
        whatsapp: settings.whatsapp || "",
      });
      
      if (settings.logo) {
        setLogoPreview(settings.logo);
      }
    }
  }, [settings]);
  
  // Mutation para salvar as configurações
  const updateMutation = useMutation({
    mutationFn: async (data: SiteSettingsForm) => {
      return await apiRequest("PUT", "/api/settings", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: "Configurações atualizadas",
        description: "As configurações do site foram atualizadas com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao atualizar configurações",
        description: error.message || "Ocorreu um erro ao atualizar as configurações.",
        variant: "destructive",
      });
    },
  });
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle logo file upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Criar preview da imagem
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setLogoPreview(result);
        // Armazenar a imagem como base64
        setFormData(prev => ({ ...prev, logo: result }));
      };
      reader.readAsDataURL(file);
      setUploadedLogo(file);
    }
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Configurações Gerais</h1>
        <p className="text-gray-600">Configure as informações gerais do site, contato e redes sociais.</p>
      </header>
      
      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Informações do Site</CardTitle>
            <CardDescription>Configure as informações básicas do seu site</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="siteName">Nome do Site</Label>
                <Input
                  id="siteName"
                  name="siteName"
                  value={formData.siteName}
                  onChange={handleChange}
                  placeholder="Seu Código"
                />
              </div>
              <div>
                <Label htmlFor="siteTitle">Título do Site</Label>
                <Input
                  id="siteTitle"
                  name="siteTitle"
                  value={formData.siteTitle}
                  onChange={handleChange}
                  placeholder="Portfólio & Serviços"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Informações de Contato</CardTitle>
            <CardDescription>Configure as informações de contato exibidas no site</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <Label htmlFor="contactEmail">Email de Contato</Label>
                <Input
                  id="contactEmail"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  placeholder="contato@seucodigo.com"
                />
              </div>
              <div>
                <Label htmlFor="contactPhone">Telefone</Label>
                <Input
                  id="contactPhone"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  placeholder="(11) 99999-8888"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="address">Endereço</Label>
              <Textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Rua Exemplo, 123 - São Paulo, SP"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Redes Sociais</CardTitle>
            <CardDescription>Configure links para suas redes sociais</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <Label htmlFor="github">GitHub</Label>
                <Input
                  id="github"
                  name="github"
                  value={formData.github}
                  onChange={handleChange}
                  placeholder="https://github.com/seuusuario"
                />
              </div>
              <div>
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/seuusuario"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleChange}
                  placeholder="https://twitter.com/seuusuario"
                />
              </div>
              <div>
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  placeholder="https://instagram.com/seuusuario"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="whatsapp">Número do WhatsApp</Label>
              <Input
                id="whatsapp"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                placeholder="Número com código do país (ex: 5511999999999)"
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Logo do Site</CardTitle>
            <CardDescription>Faça upload da logo do seu site (recomendado: formato PNG com fundo transparente)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4">
              {logoPreview ? (
                <div className="mb-4 flex flex-col items-center">
                  <img 
                    src={logoPreview} 
                    alt="Logo Preview" 
                    className="max-h-32 max-w-full mb-2"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setLogoPreview(null);
                      setUploadedLogo(null);
                      setFormData(prev => ({ ...prev, logo: "" }));
                    }}
                  >
                    Remover Logo
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex flex-col items-center justify-center py-4">
                    <div className="text-4xl text-gray-400 mb-2">
                      <RemixIcon name="ri-image-add-line" />
                    </div>
                    <p className="text-gray-500 mb-2">Clique para fazer upload da logo</p>
                    <p className="text-xs text-gray-400">PNG, JPG ou SVG (máximo 2MB)</p>
                  </div>
                  <input
                    type="file"
                    id="logo"
                    name="logo"
                    onChange={handleLogoUpload}
                    accept="image/png, image/jpeg, image/svg+xml"
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById("logo")?.click()}
                    type="button"
                  >
                    Escolher Arquivo
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={updateMutation.isPending}
            className="min-w-32"
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : "Salvar Configurações"}
          </Button>
        </div>
      </form>
    </div>
  );
}