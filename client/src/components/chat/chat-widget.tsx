import { useState, useEffect, useRef } from "react";
import { RemixIcon } from "@/components/ui/remixicon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { User, Message } from "@shared/schema";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ChatWidgetProps {
  user: User;
  onClose: () => void;
}

interface ChatMessage extends Message {
  animateIn?: boolean;
}

export function ChatWidget({ user, onClose }: ChatWidgetProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [showChatBox, setShowChatBox] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Get messages from API
    const fetchMessages = async () => {
      try {
        const response = await fetch("/api/messages", {
          credentials: "include"
        });
        
        if (response.ok) {
          const data = await response.json();
          setMessages(data);
        }
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };
    
    fetchMessages();
    
    // Setup WebSocket connection
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      // Authenticate with the WebSocket server
      ws.send(JSON.stringify({
        type: "authenticate",
        userId: user.id
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
    };
    
    setSocket(ws);
    
    return () => {
      ws.close();
    };
  }, [user.id]);
  
  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim() && socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: "message",
        content: message
      }));
      
      setMessage("");
    }
  };
  
  const formatTime = (date: Date) => {
    return format(new Date(date), "HH:mm", { locale: ptBR });
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {showChatBox ? (
        <Card className="w-[350px] shadow-xl">
          <CardHeader className="bg-primary text-white p-4 flex flex-row justify-between items-center">
            <CardTitle className="text-white font-semibold text-base">Chat com SeuCodigo</CardTitle>
            <Button variant="ghost" size="icon" className="text-white" onClick={onClose}>
              <RemixIcon name="ri-close-line text-xl" />
            </Button>
          </CardHeader>
          
          <CardContent className="p-4 bg-gray-50 chat-window">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`mb-4 ${msg.isAdmin ? "" : "flex justify-end"} ${msg.animateIn ? "animate-fadeIn" : ""}`}
              >
                {msg.isAdmin ? (
                  <div className="flex items-start">
                    <Avatar className="h-8 w-8 mr-3">
                      <AvatarImage src="https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=30&h=30" alt="Admin" />
                      <AvatarFallback>SC</AvatarFallback>
                    </Avatar>
                    <div className="bg-blue-600 text-white rounded-lg py-3 px-4 max-w-xs shadow-lg">
                      <p className="text-sm font-medium">{msg.content}</p>
                      <span className="text-xs text-blue-100 mt-1 block">
                        {msg.createdAt ? formatTime(msg.createdAt) : ""}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-primary text-white rounded-lg py-2 px-4 max-w-xs">
                    <p className="text-sm">{msg.content}</p>
                    <span className="text-xs text-gray-200 mt-1 block">
                      {msg.createdAt ? formatTime(msg.createdAt) : ""}
                    </span>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </CardContent>
          
          <CardFooter className="p-4 border-t">
            <form onSubmit={handleSendMessage} className="flex items-center w-full">
              <Input 
                placeholder="Digite sua mensagem..." 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 mr-2"
              />
              <Button type="submit" size="icon" variant="default">
                <RemixIcon name="ri-send-plane-fill" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      ) : (
        <Button 
          className="bg-primary hover:bg-accent text-white rounded-full p-4 shadow-lg transition-colors flex items-center justify-center h-14 w-14"
          onClick={() => setShowChatBox(true)}
        >
          <RemixIcon name="ri-chat-3-line text-xl" />
        </Button>
      )}
    </div>
  );
}
