import { useState } from "react";
import { RemixIcon } from "@/components/ui/remixicon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { registerSchema, loginSchema } from "@shared/schema";
import { useLocation } from "wouter";

interface AuthModalsProps {
  showLoginModal: boolean;
  showRegisterModal: boolean;
  onCloseLoginModal: () => void;
  onCloseRegisterModal: () => void;
  onShowLoginModal: () => void;
  onShowRegisterModal: () => void;
}

export function AuthModals({
  showLoginModal,
  showRegisterModal,
  onCloseLoginModal,
  onCloseRegisterModal,
  onShowLoginModal,
  onShowRegisterModal
}: AuthModalsProps) {
  const { loginMutation, registerMutation } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  
  // Login form state
  const [loginData, setLoginData] = useState({
    username: "",
    password: ""
  });
  const [loginErrors, setLoginErrors] = useState<{ [key: string]: string }>({});
  
  // Register form state
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: ""
  });
  const [registerErrors, setRegisterErrors] = useState<{ [key: string]: string }>({});
  
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
    
    try {
      loginSchema.parse(loginData);
      loginMutation.mutate(loginData, {
        onSuccess: () => {
          onCloseLoginModal();
          navigate("/");
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: { [key: string]: string } = {};
        error.errors.forEach(err => {
          if (err.path) {
            errors[err.path[0]] = err.message;
          }
        });
        setLoginErrors(errors);
      }
    }
  };
  
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      registerSchema.parse(registerData);
      
      const { confirmPassword, ...userData } = registerData;
      registerMutation.mutate(userData, {
        onSuccess: () => {
          onCloseRegisterModal();
          navigate("/");
        }
      });
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
  
  // Handle click outside to close modals
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      if (showLoginModal) onCloseLoginModal();
      if (showRegisterModal) onCloseRegisterModal();
    }
  };

  if (!showLoginModal && !showRegisterModal) return null;

  return (
    <>
      {/* Login Modal */}
      {showLoginModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleBackdropClick}
        >
          <Card className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 relative">
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              onClick={onCloseLoginModal}
            >
              <RemixIcon name="ri-close-line text-xl" />
            </Button>
            
            <CardHeader className="pb-0">
              <CardTitle className="text-2xl font-bold text-center">Entrar na sua conta</CardTitle>
            </CardHeader>
            
            <CardContent className="pt-6">
              <form id="loginForm" onSubmit={handleLoginSubmit}>
                <div className="mb-4">
                  <Label htmlFor="loginUsername">Email ou Usuário</Label>
                  <Input 
                    type="text" 
                    id="loginUsername" 
                    name="username"
                    value={loginData.username}
                    onChange={handleLoginChange}
                    className={loginErrors.username ? "border-red-500" : ""}
                  />
                  {loginErrors.username && (
                    <p className="text-red-500 text-sm mt-1">{loginErrors.username}</p>
                  )}
                </div>
                <div className="mb-6">
                  <Label htmlFor="loginPassword">Senha</Label>
                  <Input 
                    type="password" 
                    id="loginPassword" 
                    name="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    className={loginErrors.password ? "border-red-500" : ""}
                  />
                  {loginErrors.password && (
                    <p className="text-red-500 text-sm mt-1">{loginErrors.password}</p>
                  )}
                  <a href="#" className="text-sm text-primary hover:text-accent mt-2 inline-block">
                    Esqueceu sua senha?
                  </a>
                </div>
                <Button 
                  type="submit" 
                  className="w-full mb-4"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? "Entrando..." : "Entrar"}
                </Button>
              </form>
            </CardContent>
            
            <CardFooter className="flex flex-col">
              <p className="text-center text-gray-600">
                Não tem uma conta? 
                <Button 
                  variant="link" 
                  className="text-primary hover:text-accent p-0 h-auto ml-1"
                  onClick={onShowRegisterModal}
                >
                  Cadastre-se
                </Button>
              </p>
            </CardFooter>
          </Card>
        </div>
      )}
      
      {/* Register Modal */}
      {showRegisterModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleBackdropClick}
        >
          <Card className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 relative">
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              onClick={onCloseRegisterModal}
            >
              <RemixIcon name="ri-close-line text-xl" />
            </Button>
            
            <CardHeader className="pb-0">
              <CardTitle className="text-2xl font-bold text-center">Criar nova conta</CardTitle>
            </CardHeader>
            
            <CardContent className="pt-6">
              <form id="registerForm" onSubmit={handleRegisterSubmit}>
                <div className="mb-4">
                  <Label htmlFor="registerName">Nome completo</Label>
                  <Input 
                    type="text" 
                    id="registerName" 
                    name="name"
                    value={registerData.name}
                    onChange={handleRegisterChange}
                    className={registerErrors.name ? "border-red-500" : ""}
                  />
                  {registerErrors.name && (
                    <p className="text-red-500 text-sm mt-1">{registerErrors.name}</p>
                  )}
                </div>
                <div className="mb-4">
                  <Label htmlFor="registerEmail">Email</Label>
                  <Input 
                    type="email" 
                    id="registerEmail" 
                    name="email"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    className={registerErrors.email ? "border-red-500" : ""}
                  />
                  {registerErrors.email && (
                    <p className="text-red-500 text-sm mt-1">{registerErrors.email}</p>
                  )}
                </div>
                <div className="mb-4">
                  <Label htmlFor="registerUsername">Nome de usuário</Label>
                  <Input 
                    type="text" 
                    id="registerUsername" 
                    name="username"
                    value={registerData.username}
                    onChange={handleRegisterChange}
                    className={registerErrors.username ? "border-red-500" : ""}
                  />
                  {registerErrors.username && (
                    <p className="text-red-500 text-sm mt-1">{registerErrors.username}</p>
                  )}
                </div>
                <div className="mb-4">
                  <Label htmlFor="registerPassword">Senha</Label>
                  <Input 
                    type="password" 
                    id="registerPassword" 
                    name="password"
                    value={registerData.password}
                    onChange={handleRegisterChange}
                    className={registerErrors.password ? "border-red-500" : ""}
                  />
                  {registerErrors.password && (
                    <p className="text-red-500 text-sm mt-1">{registerErrors.password}</p>
                  )}
                </div>
                <div className="mb-6">
                  <Label htmlFor="registerPasswordConfirm">Confirmar senha</Label>
                  <Input 
                    type="password" 
                    id="registerPasswordConfirm" 
                    name="confirmPassword"
                    value={registerData.confirmPassword}
                    onChange={handleRegisterChange}
                    className={registerErrors.confirmPassword ? "border-red-500" : ""}
                  />
                  {registerErrors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{registerErrors.confirmPassword}</p>
                  )}
                </div>
                <Button 
                  type="submit" 
                  className="w-full mb-4"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? "Cadastrando..." : "Cadastrar"}
                </Button>
              </form>
            </CardContent>
            
            <CardFooter className="flex flex-col">
              <p className="text-center text-gray-600">
                Já tem uma conta? 
                <Button 
                  variant="link" 
                  className="text-primary hover:text-accent p-0 h-auto ml-1"
                  onClick={onShowLoginModal}
                >
                  Entre aqui
                </Button>
              </p>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
}
