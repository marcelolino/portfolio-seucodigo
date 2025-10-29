import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { User, Message } from "@shared/schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RemixIcon } from "@/components/ui/remixicon";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Loader2, MessageCircle, Users, Clock, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage extends Message {
  animateIn?: boolean;
}

export function AdminChat() {
  const { toast } = useToast();
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [message, setMessage] = useState("");
  const [userMessages, setUserMessages] = useState<{ [userId: number]: ChatMessage[] }>({});
  const [allMessages, setAllMessages] = useState<ChatMessage[]>([]);
  const [chatConnected, setChatConnected] = useState(false);
  const [hasVisitorMessages, setHasVisitorMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: users, isLoading: isLoadingUsers } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const { data: messages, isLoading: isLoadingMessages } = useQuery<Message[]>({
    queryKey: ["/api/messages"]
  });

  // Processar mensagens quando elas chegarem
  useEffect(() => {
    if (messages) {
      // Group messages by user ID
      const messagesByUser: { [userId: number]: ChatMessage[] } = {};
      let hasVisitors = false;
      
      messages.forEach((msg: Message) => {
        // Lidar com mensagens de visitantes (sem userId)
        const userKey = msg.userId || 0; // Usar 0 como chave para visitantes
        
        if (userKey === 0) {
          hasVisitors = true;
        }
        
        if (!messagesByUser[userKey]) {
          messagesByUser[userKey] = [];
        }
        messagesByUser[userKey].push({ ...msg, animateIn: false });
      });
      
      setHasVisitorMessages(hasVisitors);
      setUserMessages(messagesByUser);
      setAllMessages(messages as ChatMessage[]);
    }
  }, [messages]);

  useEffect(() => {
    // Setup WebSocket connection
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      // Authenticate with the WebSocket server as admin
      ws.send(JSON.stringify({
        type: "authenticate",
        userId: undefined,
        isAdmin: true
      }));
      
      setChatConnected(true);
      toast({
        title: "Chat conectado",
        description: "Você está pronto para responder mensagens.",
      });
    };
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === "message" && data.message) {
        const newMessage = { ...data.message, animateIn: true };
        
        // Add to all messages
        setAllMessages(prev => [...prev, newMessage]);
        
        // Add to user messages if it has a userId
        if (newMessage.userId) {
          setUserMessages(prev => {
            const userMsgs = prev[newMessage.userId] || [];
            return {
              ...prev,
              [newMessage.userId]: [...userMsgs, newMessage]
            };
          });
        }
      }
    };
    
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setChatConnected(false);
      toast({
        title: "Erro de conexão",
        description: "Não foi possível conectar ao servidor de chat.",
        variant: "destructive",
      });
    };
    
    ws.onclose = () => {
      setChatConnected(false);
    };
    
    setSocket(ws);
    
    return () => {
      ws.close();
    };
  }, [toast]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [userMessages, activeUser]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Permitir enviar mensagens para visitantes (sem userId) ou usuários autenticados
    if (message.trim() && socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: "message",
        userId: activeUser?.id || 0, // Usar 0 para visitantes
        content: message,
        isAdmin: true
      }));
      
      setMessage("");
    }
  };

  const getUserLastMessage = (userId: number) => {
    const userMsgs = userMessages[userId] || [];
    return userMsgs.length > 0 ? userMsgs[userMsgs.length - 1] : null;
  };

  const formatTime = (date: Date) => {
    return format(new Date(date), "HH:mm", { locale: ptBR });
  };

  const formatDate = (date: Date) => {
    return format(new Date(date), "dd MMM yyyy, HH:mm", { locale: ptBR });
  };

  const getDisplayMessages = () => {
    if (activeUser) {
      // Mensagens de usuário registrado específico
      return allMessages.filter(msg => msg.userId === activeUser.id);
    } else {
      // Mensagens de visitantes (userId = null)
      return allMessages.filter(msg => !msg.userId);
    }
  };

  const getUnreadCount = (userId: number) => {
    const userMsgs = userMessages[userId] || [];
    // Count messages that are not from admin and are newer than last viewed
    return userMsgs.filter(msg => !msg.isAdmin).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50/30 p-6">
      {/* Header redesenhado - Tema Roxo */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              💜 Caixa de Entrada
            </h1>
            <p className="text-slate-600 text-lg">Gerencie conversas e mensagens dos clientes</p>
          </div>
        </div>
        
        {/* Status cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Total Mensagens</p>
                  <p className="text-2xl font-bold">{allMessages.length}</p>
                </div>
                <MessageCircle className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm">Usuários Ativos</p>
                  <p className="text-2xl font-bold">{users?.length || 0}</p>
                </div>
                <Users className="w-8 h-8 text-emerald-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-sm">Conexão</p>
                  <p className="text-lg font-semibold">
                    {chatConnected ? "🟢 Online" : "🔴 Offline"}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-amber-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Visitantes</p>
                  <p className="text-lg font-semibold">
                    {hasVisitorMessages ? "✅ Ativo" : "⚠️ Nenhum"}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="flex h-[calc(100vh-10rem)] bg-white rounded-lg shadow-sm overflow-hidden">
        {/* User list sidebar */}
        <div className="w-80 border-r flex flex-col">
          <div className="p-4 border-b">
            <h2 className="font-semibold">Conversas</h2>
            <div className="flex items-center mt-2">
              <div className={`w-2 h-2 rounded-full mr-2 ${chatConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-gray-600">
                {chatConnected ? 'Conectado' : 'Desconectado'}
              </span>
            </div>
          </div>
          
          <ScrollArea className="flex-1">
            {isLoadingUsers || isLoadingMessages ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : users && users.length > 0 ? (
              <div className="space-y-1 p-2">
                {/* Show visitor messages only if there are messages from users without userId or userId=null */}
                {allMessages.some(msg => !msg.userId) && (
                  <button
                    className={`w-full flex items-center p-3 rounded-md transition-colors ${
                      activeUser === null && !isLoadingMessages
                        ? 'bg-primary/10 text-primary'
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveUser(null)}
                  >
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={`https://ui-avatars.com/api/?name=Visitante&background=4f46e5&color=fff`} />
                      <AvatarFallback>V</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                      <div className="flex justify-between">
                        <p className="font-medium truncate">Visitantes</p>
                        {allMessages.filter(msg => !msg.userId && !msg.isAdmin).length > 0 && (
                          <Badge variant="destructive" className="ml-2">
                            {allMessages.filter(msg => !msg.userId && !msg.isAdmin).length}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {allMessages.filter(msg => !msg.userId).length > 0 
                          ? allMessages.filter(msg => !msg.userId).slice(-1)[0]?.content 
                          : "Nenhuma mensagem"}
                      </p>
                    </div>
                  </button>
                )}

                {/* Usuários registrados */}
                {users?.filter(user => {
                  // Only show users who have messages and are not admin
                  return user.role !== "admin" && allMessages.some(msg => msg.userId === user.id);
                }).map((user) => {
                  const userMsgs = allMessages.filter(msg => msg.userId === user.id);
                  const lastMsg = userMsgs[userMsgs.length - 1];
                  const unreadCount = userMsgs.filter(msg => !msg.isAdmin && !msg.isRead).length;
                  
                  // Generate consistent color for each user based on their ID
                  const colors = [
                    { bg: 'bg-blue-500', color: '3b82f6' },
                    { bg: 'bg-green-500', color: '22c55e' },
                    { bg: 'bg-purple-500', color: 'a855f7' },
                    { bg: 'bg-red-500', color: 'ef4444' },
                    { bg: 'bg-yellow-500', color: 'eab308' },
                    { bg: 'bg-indigo-500', color: '6366f1' },
                    { bg: 'bg-pink-500', color: 'ec4899' },
                    { bg: 'bg-teal-500', color: '14b8a6' }
                  ];
                  const userColorScheme = colors[user.id % colors.length];
                  
                  return (
                    <button
                      key={user.id}
                      className={`w-full flex items-center p-3 rounded-md transition-colors ${
                        activeUser?.id === user.id
                          ? 'bg-primary/10 text-primary'
                          : 'hover:bg-gray-100'
                      }`}
                      onClick={() => setActiveUser(user)}
                    >
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=${userColorScheme.color}&color=fff`} />
                        <AvatarFallback className={`${userColorScheme.bg} text-white`}>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 text-left">
                        <div className="flex justify-between">
                          <p className="font-medium truncate">{user.name}</p>
                          {unreadCount > 0 && (
                            <Badge variant="destructive" className="ml-2">
                              {unreadCount}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 truncate">
                          {lastMsg ? lastMsg.content : "Nenhuma mensagem"}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-4">
                <RemixIcon name="ri-chat-3-line text-4xl text-gray-400 mb-2" />
                <p className="text-gray-500 text-center">
                  Nenhum usuário encontrado.
                </p>
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {(activeUser || hasVisitorMessages) ? (
            <>
              <div className="p-4 border-b flex items-center">
                <Avatar className="h-10 w-10 mr-3">
                  {activeUser ? (
                    <>
                      <AvatarImage src={`https://ui-avatars.com/api/?name=${activeUser.name}&background=2563eb&color=fff`} />
                      <AvatarFallback>{activeUser.name.charAt(0)}</AvatarFallback>
                    </>
                  ) : (
                    <>
                      <AvatarImage src="https://ui-avatars.com/api/?name=Visitante&background=4f46e5&color=fff" />
                      <AvatarFallback>V</AvatarFallback>
                    </>
                  )}
                </Avatar>
                <div>
                  <h3 className="font-semibold">{activeUser ? activeUser.name : "Visitante"}</h3>
                  <p className="text-sm text-gray-500">
                    {activeUser ? activeUser.email : "Usuário não autenticado"}
                  </p>
                </div>
              </div>

              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {getDisplayMessages().length > 0 ? (
                    getDisplayMessages().map((msg, index) => {
                      // Generate consistent color for each user
                      const colors = [
                        { bg: 'bg-blue-500', border: 'border-blue-600' },
                        { bg: 'bg-green-500', border: 'border-green-600' },
                        { bg: 'bg-purple-500', border: 'border-purple-600' },
                        { bg: 'bg-red-500', border: 'border-red-600' },
                        { bg: 'bg-yellow-500', border: 'border-yellow-600' },
                        { bg: 'bg-indigo-500', border: 'border-indigo-600' },
                        { bg: 'bg-pink-500', border: 'border-pink-600' },
                        { bg: 'bg-teal-500', border: 'border-teal-600' }
                      ];
                      
                      let userColorScheme = { bg: 'bg-gray-200', border: 'border-gray-300' };
                      if (msg.userId && !msg.isAdmin) {
                        userColorScheme = colors[msg.userId % colors.length];
                      }
                      
                      return (
                        <div
                          key={index}
                          className={`flex ${msg.isAdmin ? 'justify-end' : 'justify-start'} ${
                            msg.animateIn ? 'animate-fadeIn' : ''
                          }`}
                        >
                          <div
                            className={`max-w-[80%] px-4 py-2 rounded-lg ${
                              msg.isAdmin
                                ? 'bg-blue-600 text-white shadow-md'
                                : msg.userId 
                                  ? `${userColorScheme.bg} text-white shadow-md border ${userColorScheme.border}`
                                  : 'bg-gray-200 text-gray-800 border border-gray-300'
                            }`}
                          >
                            <p className="mb-1">{msg.content}</p>
                            <p className={`text-xs ${msg.isAdmin || msg.userId ? 'text-white/70' : 'text-gray-500'}`}>
                              {formatDate(new Date(msg.createdAt))}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-gray-500">
                        Nenhuma mensagem. Comece a conversa agora!
                      </p>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <form onSubmit={handleSendMessage} className="p-4 border-t flex text-[#ffffff]">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 mr-2 bg-[#6178fa]"
                  disabled={!chatConnected}
                />
                <Button
                  type="submit"
                  disabled={!message.trim() || !chatConnected}
                >
                  <RemixIcon name="ri-send-plane-fill" />
                </Button>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-4">
              <RemixIcon name="ri-chat-smile-3-line text-6xl text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">Nenhuma conversa selecionada</h3>
              <p className="text-gray-500 text-center max-w-md">
                Selecione um usuário à esquerda para iniciar uma conversa ou visualizar mensagens anteriores.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
