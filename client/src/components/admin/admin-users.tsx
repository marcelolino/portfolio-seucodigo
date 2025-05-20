import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RemixIcon } from "@/components/ui/remixicon";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewUserDetails, setViewUserDetails] = useState<User | null>(null);
  
  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const formatDate = (date: Date) => {
    return format(new Date(date), "dd/MM/yyyy HH:mm", { locale: ptBR });
  };

  const filteredUsers = users?.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Gerenciar Usuários</h1>
          <p className="text-gray-600">Visualize os usuários registrados no sistema.</p>
        </div>
      </header>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Estatísticas de Usuários</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 text-primary rounded-full">
                  <RemixIcon name="ri-user-line text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total de Usuários</p>
                  <p className="text-2xl font-bold">{users?.length || 0}</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-green-100 text-green-600 rounded-full">
                  <RemixIcon name="ri-admin-line text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Administradores</p>
                  <p className="text-2xl font-bold">{users?.filter(u => u.role === "admin").length || 0}</p>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-full">
                  <RemixIcon name="ri-user-follow-line text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Usuários Comuns</p>
                  <p className="text-2xl font-bold">{users?.filter(u => u.role === "user").length || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex items-center">
            <Input
              placeholder="Buscar usuários..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
              startIcon={<RemixIcon name="ri-search-line" />}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredUsers && filteredUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Data de Cadastro</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`https://ui-avatars.com/api/?name=${user.name}&background=2563eb&color=fff`} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-gray-500">@{user.username}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.role === "admin" ? (
                        <Badge variant="default">Administrador</Badge>
                      ) : (
                        <Badge variant="outline">Usuário</Badge>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(new Date(user.createdAt))}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setViewUserDetails(user)}
                      >
                        <RemixIcon name="ri-eye-line mr-1" /> Detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-16">
            <RemixIcon name="ri-user-search-line text-4xl text-gray-400 mb-2" />
            <h3 className="text-lg font-medium text-gray-600">Nenhum usuário encontrado</h3>
            <p className="text-gray-500">Tente uma busca diferente ou verifique se há usuários cadastrados.</p>
          </div>
        )}
      </div>

      {/* User Details Dialog */}
      <Dialog open={!!viewUserDetails} onOpenChange={() => setViewUserDetails(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes do Usuário</DialogTitle>
            <DialogDescription>
              Informações completas do usuário.
            </DialogDescription>
          </DialogHeader>
          
          {viewUserDetails && (
            <div className="space-y-4 py-4">
              <div className="flex flex-col items-center gap-3 mb-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={`https://ui-avatars.com/api/?name=${viewUserDetails.name}&background=2563eb&color=fff&size=80`} />
                  <AvatarFallback className="text-2xl">{viewUserDetails.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h3 className="text-xl font-semibold">{viewUserDetails.name}</h3>
                  <p className="text-gray-500">@{viewUserDetails.username}</p>
                </div>
                <Badge variant={viewUserDetails.role === "admin" ? "default" : "outline"}>
                  {viewUserDetails.role === "admin" ? "Administrador" : "Usuário"}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">ID</p>
                  <p>{viewUserDetails.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p>{viewUserDetails.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Data de Registro</p>
                  <p>{formatDate(new Date(viewUserDetails.createdAt))}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Tipo de Usuário</p>
                  <p className="capitalize">{viewUserDetails.role}</p>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => setViewUserDetails(null)}
                >
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
