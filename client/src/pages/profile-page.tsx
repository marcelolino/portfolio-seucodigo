import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { User, ArrowLeft, Save, Upload, Settings } from "lucide-react";
import { Link } from "wouter";

const profileSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  username: z.string().min(3, "Username deve ter pelo menos 3 caracteres"),
  avatar: z.string().url("URL do avatar inválida").optional().or(z.literal("")),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      username: user?.username || "",
      avatar: user?.avatar || "",
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      const res = await apiRequest("PUT", "/api/profile", data);
      return await res.json();
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["/api/user"], updatedUser);
      toast({
        title: "Perfil atualizado com sucesso!",
        description: "Suas informações foram salvas.",
      });
      setIsEditing(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao atualizar perfil",
        description: error.message || "Tente novamente mais tarde",
        variant: "destructive",
      });
    },
  });

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const onSubmit = (data: ProfileFormData) => {
    updateProfileMutation.mutate(data);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p>Você precisa estar logado para acessar seu perfil.</p>
            <Link href="/auth">
              <Button className="mt-4">Fazer Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Meu Perfil
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie suas informações pessoais
          </p>
        </div>

        {/* Card do Perfil */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
          <CardHeader className="pb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="h-20 w-20 ring-4 ring-primary/20 shadow-lg">
                    <AvatarImage src={user.avatar ?? undefined} alt={user.name} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white text-xl font-bold">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  {user.role === 'admin' && (
                    <div className="absolute -top-1 -right-1 bg-yellow-500 text-white rounded-full p-1.5 shadow-md">
                      <Settings className="h-3 w-3" />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <User className="h-6 w-6 text-primary" />
                    {user.name}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      user.role === 'admin' 
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' 
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    }`}>
                      {user.role === 'admin' ? '👑 Administrador' : '👤 Usuário'}
                    </span>
                  </div>
                  <CardDescription className="text-base">
                    Membro desde {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                  </CardDescription>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant={isEditing ? "outline" : "default"}
                  className={isEditing ? "border-red-300 text-red-600 hover:bg-red-50" : "bg-primary hover:bg-primary/90 shadow-lg"}
                  size="lg"
                >
                  {isEditing ? "Cancelar" : "✏️ Editar Perfil"}
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Seção de Informações Pessoais */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl p-6 border border-blue-100 dark:border-blue-800">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informações Pessoais
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nome */}
                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      👤 Nome Completo
                    </Label>
                    <Input
                      id="name"
                      {...form.register("name")}
                      disabled={!isEditing}
                      className={`transition-all duration-200 ${
                        !isEditing 
                          ? "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700" 
                          : "bg-white dark:bg-gray-900 border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm"
                      }`}
                    />
                    {form.formState.errors.name && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        ⚠️ {form.formState.errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Username */}
                  <div className="space-y-3">
                    <Label htmlFor="username" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      @️ Nome de Usuário
                    </Label>
                    <Input
                      id="username"
                      {...form.register("username")}
                      disabled={!isEditing}
                      className={`transition-all duration-200 ${
                        !isEditing 
                          ? "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700" 
                          : "bg-white dark:bg-gray-900 border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm"
                      }`}
                    />
                    {form.formState.errors.username && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        ⚠️ {form.formState.errors.username.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Seção de Contato */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl p-6 border border-green-100 dark:border-green-800">
                <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-4 flex items-center gap-2">
                  📧 Informações de Contato
                </h3>
                
                <div className="space-y-6">
                  {/* Email */}
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      ✉️ Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      {...form.register("email")}
                      disabled={!isEditing}
                      className={`transition-all duration-200 ${
                        !isEditing 
                          ? "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700" 
                          : "bg-white dark:bg-gray-900 border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm"
                      }`}
                    />
                    {form.formState.errors.email && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        ⚠️ {form.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Avatar URL */}
                  <div className="space-y-3">
                    <Label htmlFor="avatar" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      🖼️ URL do Avatar (opcional)
                    </Label>
                    <div className="flex gap-3">
                      <Input
                        id="avatar"
                        {...form.register("avatar")}
                        disabled={!isEditing}
                        placeholder="https://exemplo.com/avatar.jpg"
                        className={`flex-1 transition-all duration-200 ${
                          !isEditing 
                            ? "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700" 
                            : "bg-white dark:bg-gray-900 border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm"
                        }`}
                      />
                      {isEditing && (
                        <Button type="button" variant="outline" size="icon" className="shrink-0 border-gray-300 hover:border-primary hover:bg-primary/5">
                          <Upload className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    {form.formState.errors.avatar && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        ⚠️ {form.formState.errors.avatar.message}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      💡 Deixe em branco para usar as iniciais do seu nome
                    </p>
                  </div>
                </div>
              </div>

              {/* Botões de Ação */}
              {isEditing && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-xl p-6 border border-purple-100 dark:border-purple-800">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      type="submit"
                      disabled={updateProfileMutation.isPending}
                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                      size="lg"
                    >
                      <Save className="h-5 w-5 mr-2" />
                      {updateProfileMutation.isPending ? "💾 Salvando..." : "✅ Salvar Alterações"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        form.reset();
                      }}
                      className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 transition-all duration-200"
                      size="lg"
                    >
                      ❌ Cancelar
                    </Button>
                  </div>
                </div>
              )}
            </form>

            {/* Informações da Conta */}
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 rounded-xl p-6 border border-orange-100 dark:border-orange-800">
              <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-4 flex items-center gap-2">
                🔐 Informações da Conta
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-orange-200 dark:border-orange-700">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-full">
                      {user.role === 'admin' ? '👑' : '👤'}
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Tipo de Conta</span>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {user.role === 'admin' ? 'Administrador' : 'Usuário'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-orange-200 dark:border-orange-700">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-full">
                      📅
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Membro desde</span>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-700">
                <p className="text-sm text-blue-800 dark:text-blue-200 flex items-center gap-2">
                  💡 <strong>Dica:</strong> Mantenha suas informações sempre atualizadas para uma melhor experiência.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}