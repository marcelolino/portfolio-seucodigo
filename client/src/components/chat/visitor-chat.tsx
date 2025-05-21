import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Message } from "@/shared/schema";
import { Loader2, X, MessageSquare, Send } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatMessage extends Message {
  animateIn?: boolean;
}

interface VisitorChatProps {
  onClose: () => void;
}

export function VisitorChat({ onClose }: VisitorChatProps) {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Initialize chat
  useEffect(() => {
    async function fetchMessages() {
      try {
        const response = await fetch("/api/messages", {
          credentials: "include"
        });
        
        if (response.ok) {
          const data = await response.json();
          setMessages(data.map((msg: Message) => ({ ...msg, animateIn: false })));
        }
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    }
    
    // Setup WebSocket connection
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      setIsConnected(true);
      // Authenticate with the WebSocket server
      ws.send(JSON.stringify({
        type: "authenticate",
        userId: user?.id
      }));
    };
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === "message" && data.message) {
        setMessages(prev => [...prev, { ...data.message, animateIn: true }]);
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
  
  // Toggle chat open/closed
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };
  
  // Send a message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim() && socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: "message",
        content: message,
        isAdmin: false
      }));
      
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
                        className={`px-3 py-2 rounded-lg ${
                          msg.isAdmin 
                            ? 'bg-gray-100 text-gray-800' 
                            : 'bg-primary text-white'
                        }`}
                      >
                        <div className="text-sm break-words">{msg.content}</div>
                        <div className={`text-xs mt-1 ${msg.isAdmin ? 'text-gray-500' : 'text-primary-50'}`}>
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