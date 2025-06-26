import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Loader2, X, MessageSquare, Send } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

// Define the Message interface since we're having import issues
interface Message {
  id: number;
  userId?: number;
  content: string;
  isAdmin: boolean;
  isRead: boolean; // Mantemos isRead na interface para compatibilidade com o código
  read: boolean;   // Adicionamos read que é o nome real no banco
  createdAt: Date;
}

interface ChatMessage extends Message {
  animateIn?: boolean;
}

interface VisitorChatProps {
  onClose?: () => void;
}

export function VisitorChat({ onClose = () => {} }: VisitorChatProps) {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Initialize chat
  useEffect(() => {
    // Carregar mensagens iniciais
    fetchMessages();
    
    // Setup WebSocket connection
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = window.location.host;
    const wsUrl = `${protocol}//${host}/ws`;
    console.log("Connecting to WebSocket URL:", wsUrl);
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      setIsConnected(true);
      // Authenticate with the WebSocket server (como visitante se não estiver logado)
      ws.send(JSON.stringify({
        type: "authenticate",
        userId: user?.id || null // Enviar null para visitantes não autenticados
      }));
      console.log("WebSocket connected, authenticated as:", user?.id ? "User "+user.id : "Visitor");
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("WebSocket message received:", data);
        
        if (data.type === "message" && data.message) {
          // Adicionar nova mensagem à lista com animação
          setMessages(prev => [...prev, { ...data.message, animateIn: true }]);
          
          // Garantir que o chat será aberto se receber mensagem do admin
          if (data.message.isAdmin && !isOpen) {
            setIsOpen(true);
          }
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };
    
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setIsConnected(false);
    };
    
    ws.onclose = () => {
      setIsConnected(false);
    };
    
    setSocket(ws);
    fetchMessages();
    
    return () => {
      ws.close();
    };
  }, [user]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  // Função para buscar mensagens
  async function fetchMessages() {
    try {
      // Buscar mensagens específicas para visitantes
      const response = await fetch("/api/messages?visitor=true", {
        credentials: "include"
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log("Visitor messages loaded:", data);
        
        // Processar os dados retornados para garantir a compatibilidade com a interface ChatMessage
        const processedMessages = data.map((msg: any) => ({
          id: msg.id,
          userId: msg.userId || msg.user_id,
          content: msg.content,
          isAdmin: msg.isAdmin || msg.is_admin,
          isRead: msg.isRead || msg.read,
          read: msg.read || false,
          createdAt: new Date(msg.createdAt || msg.created_at),
          animateIn: false
        }));
        
        setMessages(processedMessages);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  }

  // Toggle chat open/closed
  const toggleChat = () => {
    setIsOpen(!isOpen);
    // Atualizar mensagens quando abrir o chat
    if (!isOpen) {
      fetchMessages();
    }
  };
  
  // Send a message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim() && socket && socket.readyState === WebSocket.OPEN) {
      const messageData = {
        type: "message",
        content: message,
        isAdmin: false
      };
      
      console.log("Sending message as visitor:", messageData);
      socket.send(JSON.stringify(messageData));
      
      setMessage("");
    }
  };
  
  const formatTime = (date: Date) => {
    return format(new Date(date), "HH:mm", { locale: ptBR });
  };
  
  return (
    <>
      {/* Chat Button (Fixed) */}
      {!isOpen && (
        <button 
          onClick={toggleChat}
          className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 transition-all z-50"
        >
          <MessageSquare size={24} />
        </button>
      )}
      
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 md:w-96 bg-white rounded-lg shadow-lg flex flex-col z-50 border overflow-hidden">
          {/* Chat Header */}
          <div className="bg-primary p-3 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
              <h3 className="font-medium">Chat com Atendente</h3>
            </div>
            <button onClick={() => {
              setIsOpen(false);
              onClose();
            }} className="text-white hover:text-gray-200">
              <X size={18} />
            </button>
          </div>
          
          {/* Chat Messages */}
          <ScrollArea className="flex-1 p-3 max-h-[350px]">
            <div className="space-y-3">
              {messages.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>Comece uma conversa com nosso atendente!</p>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div 
                    key={msg.id || index} 
                    className={`flex ${msg.isAdmin ? 'justify-start' : 'justify-end'} 
                    ${msg.animateIn ? 'animate-in fade-in slide-in-from-bottom-2 duration-300' : ''}`}
                  >
                    <div className={`flex items-start gap-2 max-w-[80%] ${msg.isAdmin ? 'flex-row' : 'flex-row-reverse'}`}>
                      {msg.isAdmin && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/assets/admin-avatar.png" />
                          <AvatarFallback>A</AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div 
                        className={`px-3 py-2 rounded-lg shadow-md ${
                          msg.isAdmin 
                            ? 'bg-blue-600 text-white border border-blue-700' 
                            : 'bg-primary text-white'
                        }`}
                      >
                        <div className={`text-sm break-words ${msg.isAdmin ? 'font-medium' : ''}`}>{msg.content}</div>
                        <div className={`text-xs mt-1 ${msg.isAdmin ? 'text-blue-100' : 'text-primary-50'}`}>
                          {formatTime(msg.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef}></div>
            </div>
          </ScrollArea>
          
          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="p-3 border-t flex">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="flex-1 mr-2"
              disabled={!isConnected}
            />
            <Button 
              type="submit" 
              size="icon"
              disabled={!message.trim() || !isConnected}
            >
              <Send size={18} />
            </Button>
          </form>
        </div>
      )}
    </>
  );
}