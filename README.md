# SeuCodigo - Portfolio & E-commerce Platform

Um sistema completo de portfólio e e-commerce para desenvolvedores, construído com tecnologias modernas.

## 🚀 Tecnologias

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL + Drizzle ORM
- **Styling**: Tailwind CSS + shadcn/ui
- **Authentication**: Passport.js + Session-based auth
- **State Management**: TanStack Query + React Context
- **Real-time**: WebSocket para chat
- **Payments**: Stripe + PIX

## 📋 Funcionalidades

### 🎨 Frontend
- Design moderno com tema neon/dark
- Interface responsiva para todos os dispositivos
- Componentes reutilizáveis com shadcn/ui
- Sistema de carrinho de compras
- Checkout completo com métodos de pagamento
- Chat em tempo real

### ⚙️ Backend
- API RESTful completa
- Autenticação baseada em sessões
- Sistema de roles (admin/user)
- WebSocket para comunicação real-time
- Upload de arquivos
- Sistema de pedidos

### 💾 Database
- Schema PostgreSQL otimizado
- Migrações automáticas com Drizzle
- Relacionamentos bem estruturados
- Seed data completo para desenvolvimento

## 🛠️ Instalação

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   ```bash
   DATABASE_URL=your_postgresql_url
   SESSION_SECRET=your_session_secret
   ```

4. Execute as migrações:
   ```bash
   npm run db:push
   ```

5. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## 🔑 Credenciais de Acesso

### Admin
- **Username**: admin
- **Password**: admin123

### Cliente Teste
- **Username**: cliente1
- **Password**: cliente123

## 📁 Estrutura do Projeto

```
├── client/           # Frontend React
│   └── src/
│       ├── components/  # Componentes reutilizáveis
│       ├── pages/       # Páginas da aplicação
│       ├── hooks/       # Custom hooks
│       └── lib/         # Utilitários
├── server/           # Backend Express
│   ├── auth.ts         # Sistema de autenticação
│   ├── routes.ts       # Rotas da API
│   ├── storage.ts      # Interface de armazenamento
│   └── migration/      # Scripts de migração
├── shared/           # Código compartilhado
│   └── schema.ts       # Schema do banco de dados
└── README.md
```

## 🚀 Deploy

O projeto está configurado para deploy automático no Replit:

1. Configure as variáveis de ambiente
2. O build será executado automaticamente
3. A aplicação estará disponível na URL do Replit

## 📊 Dados de Demonstração

O sistema inclui dados completos para demonstração:
- 3 usuários (1 admin + 2 clientes)
- 6 serviços variados
- 6 projetos de exemplo
- 6 depoimentos de clientes
- 2 métodos de pagamento (PIX + Stripe)
- Configurações do site

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run start` - Inicia servidor de produção
- `npm run db:push` - Executa migrações do banco

## 📝 Licença

Este projeto é privado e proprietário.

## 📞 Suporte

Para suporte técnico ou dúvidas sobre o projeto, entre em contato através do sistema de chat integrado.