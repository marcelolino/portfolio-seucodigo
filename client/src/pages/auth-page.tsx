import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RemixIcon } from "@/components/ui/remixicon";
import { useAuth } from "@/hooks/use-auth";
import { registerSchema } from "@shared/schema";
import { z } from "zod";

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [, navigate] = useLocation();
  
  const [loginData, setLoginData] = useState({
    username: "admin@gmail.com",
    password: "admin123"
  });
  
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: ""
  });
  
  const [loginErrors, setLoginErrors] = useState<{ [key: string]: string }>({});
  const [registerErrors, setRegisterErrors] = useState<{ [key: string]: string }>({});
  
  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);
  
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field changes
    if (loginErrors[name]) {
      setLoginErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };
  
  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field changes
    if (registerErrors[name]) {
      setRegisterErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };
  
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Tentando login com:", loginData);
    
    // Certifique-se de que o loginData tem os campos corretos
    const loginPayload = {
      username: loginData.username,
      password: loginData.password
    };
    
    loginMutation.mutate(loginPayload);
  };
  
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      registerSchema.parse(registerData);
      
      const { confirmPassword, ...userData } = registerData;
      registerMutation.mutate(userData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: { [key: string]: string } = {};
        error.errors.forEach(err => {
          if (err.path) {
            errors[err.path[0]] = err.message;
          }
        });
        setRegisterErrors(errors);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Cadastro</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Entrar na sua conta</CardTitle>
                  <CardDescription>
                    Digite suas credenciais para acessar sua conta SeuCodigo.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLoginSubmit}>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="username">Nome de usuário</Label>
                        <Input
                          id="username"
                          name="username"
                          type="text"
                          placeholder="admin"
                          value={loginData.username}
                          onChange={handleLoginChange}
                          className={loginErrors.username ? "border-red-500" : ""}
                        />
                        {loginErrors.username && (
                          <p className="text-red-500 text-sm mt-1">{loginErrors.username}</p>
                        )}
                      </div>
                      <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password">Senha</Label>
                          <a href="#" className="text-sm text-primary hover:text-accent">
                            Esqueceu a senha?
                          </a>
                        </div>
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          placeholder="••••••••"
                          value={loginData.password}
                          onChange={handleLoginChange}
                          className={loginErrors.password ? "border-red-500" : ""}
                        />
                        {loginErrors.password && (
                          <p className="text-red-500 text-sm mt-1">{loginErrors.password}</p>
                        )}
                      </div>
                      
                      {loginMutation.isError && (
                        <Alert variant="destructive">
                          <AlertDescription>
                            {loginMutation.error.message}
                          </AlertDescription>
                        </Alert>
                      )}
                      
                      <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                        {loginMutation.isPending ? "Entrando..." : "Entrar"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Criar uma conta</CardTitle>
                  <CardDescription>
                    Preencha o formulário abaixo para se cadastrar no SeuCodigo.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleRegisterSubmit}>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Nome completo</Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Seu nome completo"
                          value={registerData.name}
                          onChange={handleRegisterChange}
                          className={registerErrors.name ? "border-red-500" : ""}
                        />
                        {registerErrors.name && (
                          <p className="text-red-500 text-sm mt-1">{registerErrors.name}</p>
                        )}
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="username">Nome de usuário</Label>
                        <Input
                          id="username"
                          name="username"
                          placeholder="seuusername"
                          value={registerData.username}
                          onChange={handleRegisterChange}
                          className={registerErrors.username ? "border-red-500" : ""}
                        />
                        {registerErrors.username && (
                          <p className="text-red-500 text-sm mt-1">{registerErrors.username}</p>
                        )}
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="register-email">Email</Label>
                        <Input
                          id="register-email"
                          name="email"
                          type="email"
                          placeholder="exemplo@email.com"
                          value={registerData.email}
                          onChange={handleRegisterChange}
                          className={registerErrors.email ? "border-red-500" : ""}
                        />
                        {registerErrors.email && (
                          <p className="text-red-500 text-sm mt-1">{registerErrors.email}</p>
                        )}
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="register-password">Senha</Label>
                        <Input
                          id="register-password"
                          name="password"
                          type="password"
                          placeholder="••••••••"
                          value={registerData.password}
                          onChange={handleRegisterChange}
                          className={registerErrors.password ? "border-red-500" : ""}
                        />
                        {registerErrors.password && (
                          <p className="text-red-500 text-sm mt-1">{registerErrors.password}</p>
                        )}
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="confirmPassword">Confirmar senha</Label>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          placeholder="••••••••"
                          value={registerData.confirmPassword}
                          onChange={handleRegisterChange}
                          className={registerErrors.confirmPassword ? "border-red-500" : ""}
                        />
                        {registerErrors.confirmPassword && (
                          <p className="text-red-500 text-sm mt-1">{registerErrors.confirmPassword}</p>
                        )}
                      </div>
                      
                      {registerMutation.isError && (
                        <Alert variant="destructive">
                          <AlertDescription>
                            {registerMutation.error.message}
                          </AlertDescription>
                        </Alert>
                      )}
                      
                      <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
                        {registerMutation.isPending ? "Cadastrando..." : "Cadastrar"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Hero section */}
        <div className="hidden md:block text-center md:text-left">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-dark">
              Bem-vindo ao <span className="text-primary">SeuCodigo</span>
            </h1>
            <p className="text-lg text-gray-600">
              Transforme suas ideias em realidade com desenvolvimento web personalizado e soluções digitais para 
              potencializar seu negócio ou projeto pessoal.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <RemixIcon name="ri-check-line text-primary text-xl" />
                </div>
                <span className="text-gray-700">Projetos personalizados para sua necessidade</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <RemixIcon name="ri-check-line text-primary text-xl" />
                </div>
                <span className="text-gray-700">Atendimento personalizado via chat</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <RemixIcon name="ri-check-line text-primary text-xl" />
                </div>
                <span className="text-gray-700">Acompanhe o progresso do seu projeto</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <RemixIcon name="ri-check-line text-primary text-xl" />
                </div>
                <span className="text-gray-700">Suporte técnico contínuo</span>
              </div>
            </div>
          </div>
          <img 
            src="https://images.unsplash.com/photo-1561883088-039e53143d73?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=300" 
            alt="Desenvolvimento web" 
            className="mt-8 rounded-lg shadow-lg mx-auto md:mx-0"
          />
        </div>
      </div>
    </div>
  );
}
