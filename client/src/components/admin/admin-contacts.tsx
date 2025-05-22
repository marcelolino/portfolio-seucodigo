import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Contact } from "@shared/schema";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { RemixIcon } from "@/components/ui/remixicon";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

export function AdminContacts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isContactDetailsOpen, setIsContactDetailsOpen] = useState(false);
  
  const { data: contacts, isLoading } = useQuery<Contact[]>({
    queryKey: ["/api/contacts"],
  });
  
  const formatDate = (date: Date) => {
    return format(new Date(date), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR });
  };
  
  const filteredContacts = contacts?.filter(contact => {
    if (!searchTerm) return true;
    
    const searchTermLower = searchTerm.toLowerCase();
    return (
      contact.name.toLowerCase().includes(searchTermLower) ||
      contact.email.toLowerCase().includes(searchTermLower) ||
      contact.subject.toLowerCase().includes(searchTermLower) ||
      contact.message.toLowerCase().includes(searchTermLower)
    );
  });
  
  const openContactDetails = (contact: Contact) => {
    setSelectedContact(contact);
    setIsContactDetailsOpen(true);
  };
  
  return (
    <div className="container py-6 space-y-6 bg-background">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Caixa de Entrada</h1>
          <p className="text-foreground/70">Gerencie as mensagens enviadas pelo formulário de contato</p>
        </div>
        
        <div className="w-full md:w-64 relative">
          <Input 
            placeholder="Buscar mensagens..." 
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="bg-background/40 border-secondary/30 text-foreground focus:border-accent pr-10"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-foreground/50">
            <RemixIcon name="ri-search-line" />
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="space-y-4">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="p-4 border border-secondary/20 rounded-md">
              <div className="flex justify-between items-start">
                <div>
                  <Skeleton className="h-5 w-40 mb-2 bg-secondary/20" />
                  <Skeleton className="h-4 w-60 mb-1 bg-secondary/20" />
                </div>
                <Skeleton className="h-6 w-24 bg-secondary/20" />
              </div>
              <Skeleton className="h-4 w-full mt-4 bg-secondary/20" />
              <Skeleton className="h-4 w-3/4 mt-2 bg-secondary/20" />
            </div>
          ))}
        </div>
      ) : filteredContacts && filteredContacts.length > 0 ? (
        <div className="border border-secondary/20 rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-primary/20 hover:bg-primary/30">
                <TableHead className="text-foreground">Nome</TableHead>
                <TableHead className="text-foreground">Assunto</TableHead>
                <TableHead className="text-foreground">Data</TableHead>
                <TableHead className="text-foreground text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContacts.map((contact) => (
                <TableRow 
                  key={contact.id} 
                  className="border-b border-secondary/10 hover:bg-primary/10 cursor-pointer"
                  onClick={() => openContactDetails(contact)}
                >
                  <TableCell className="font-medium text-foreground">
                    <div>
                      {contact.name}
                      <div className="text-xs text-foreground/60">{contact.email}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-foreground/80">
                    {contact.subject}
                  </TableCell>
                  <TableCell className="text-foreground/60">
                    {formatDate(contact.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-secondary hover:text-accent"
                      onClick={(e) => {
                        e.stopPropagation();
                        openContactDetails(contact);
                      }}
                    >
                      <RemixIcon name="ri-eye-line mr-1" />
                      Ver
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-secondary/20 rounded-md">
          <div className="text-4xl text-secondary/50 mb-4">
            <RemixIcon name="ri-mail-open-line" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-1">Nenhuma mensagem encontrada</h3>
          <p className="text-foreground/60">
            {searchTerm ? "Nenhuma mensagem corresponde à sua busca" : "Você ainda não recebeu mensagens do formulário de contato"}
          </p>
        </div>
      )}
      
      {/* Dialog para exibir detalhes do contato */}
      <Dialog open={isContactDetailsOpen} onOpenChange={setIsContactDetailsOpen}>
        <DialogContent className="bg-background border border-secondary/30 text-foreground max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-foreground text-xl flex items-center gap-2">
              <RemixIcon name="ri-mail-open-line" /> Detalhes da Mensagem
            </DialogTitle>
            <DialogDescription className="text-foreground/70">
              Mensagem enviada por {selectedContact?.name} em {selectedContact && formatDate(selectedContact.createdAt)}
            </DialogDescription>
          </DialogHeader>
          
          {selectedContact && (
            <div className="space-y-6 py-4">
              <div className="flex flex-col md:flex-row gap-6 md:gap-10">
                <div className="flex-1 space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-foreground/60 mb-1">Remetente</h4>
                    <p className="text-foreground font-medium">{selectedContact.name}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-foreground/60 mb-1">E-mail</h4>
                    <p className="text-foreground">{selectedContact.email}</p>
                  </div>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-foreground/60 mb-1">Data</h4>
                    <p className="text-foreground">{formatDate(selectedContact.createdAt)}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-foreground/60 mb-1">Assunto</h4>
                    <p className="text-foreground font-medium">{selectedContact.subject}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-foreground/60 mb-2">Mensagem</h4>
                <div className="bg-primary/10 p-4 rounded-md text-foreground whitespace-pre-wrap">
                  {selectedContact.message}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="sm:justify-between">
            <div className="flex items-center gap-2">
              <Badge className="bg-secondary/20 text-secondary border border-secondary/20 hover:bg-secondary/30">
                Formulário de Contato
              </Badge>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="border-secondary text-secondary hover:bg-secondary/10"
                onClick={() => setIsContactDetailsOpen(false)}
              >
                <RemixIcon name="ri-close-line mr-1" /> Fechar
              </Button>
              
              <a 
                href={`mailto:${selectedContact?.email}`}
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button className="bg-secondary hover:bg-secondary/80 text-foreground">
                  <RemixIcon name="ri-mail-send-line mr-1" /> Responder por E-mail
                </Button>
              </a>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}