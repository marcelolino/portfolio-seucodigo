# SeuCodigo - Portfolio & E-commerce Platform

## Overview

SeuCodigo is a modern full-stack web application that serves as both a portfolio showcase and e-commerce platform for web development services. The application features a React frontend with a Node.js/Express backend, utilizing PostgreSQL for data persistence and modern technologies throughout.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with a custom dark/neon theme
- **UI Components**: Radix UI primitives with shadcn/ui components
- **State Management**: Tanstack Query for server state, React Context for client state
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js with session-based authentication
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Authentication**: Passport.js with local strategy and bcrypt password hashing
- **Session Management**: Express-session with PostgreSQL session store
- **Real-time Communication**: WebSocket integration for chat functionality

### Database Design
- **Primary Database**: PostgreSQL configurado e funcionando
- **Schema Management**: Drizzle Kit para migrações e gerenciamento de schema
- **Storage**: Sistema automaticamente usa PostgreSQL quando DATABASE_URL está disponível
- **Tables**: Users, Projects, Services, Testimonials, Messages, Contacts, Site Settings, Orders, Payment Methods
- **Authentication**: Sistema de hash scrypt para senhas seguras

## Key Components

### Authentication System
- Session-based authentication using Passport.js
- Role-based access control (admin/user roles)
- Password hashing with scrypt algorithm
- Protected routes for admin functionality

### E-commerce Features
- Shopping cart functionality with React Context
- Project and service catalog management
- Order processing system
- Multiple payment method support (Stripe, PIX)
- Checkout flow with customer information collection

### Content Management
- Admin dashboard for managing projects, services, testimonials
- Dynamic site settings configuration
- File upload capabilities for images
- Real-time chat system for customer support

### UI/UX Design
- Futuristic neon theme with dark background
- Responsive design optimized for all devices
- Modern component library with consistent styling
- Smooth animations and transitions

## Data Flow

1. **Client Requests**: Frontend makes API calls using Tanstack Query
2. **Server Processing**: Express.js handles requests with proper authentication checks
3. **Database Operations**: Drizzle ORM manages all database interactions
4. **Response Handling**: Structured JSON responses with error handling
5. **State Updates**: Client updates local state and cache automatically

## External Dependencies

### Core Technologies
- **Database**: Neon PostgreSQL serverless database
- **Payment Processing**: Stripe for card payments, PIX for Brazilian payments
- **UI Framework**: Radix UI for accessible components
- **Validation**: Zod for runtime type validation
- **Development**: tsx for TypeScript execution

### Optional Integrations
- **Analytics**: Can be integrated for user tracking
- **Email**: SMTP integration for notifications
- **File Storage**: Current setup uses URLs, can be extended with cloud storage

## Deployment Strategy

### Development Environment
- **Replit Integration**: Configured for seamless Replit development
- **Hot Reload**: Vite dev server with HMR
- **Development Database**: Provisioned PostgreSQL instance
- **Port Configuration**: Backend on port 5000, frontend served via Vite

### Production Build
- **Frontend**: Static files built with Vite and served from `/dist/public`
- **Backend**: Bundled with esbuild for optimized Node.js execution
- **Database**: Production PostgreSQL connection via environment variables
- **Session Storage**: PostgreSQL-backed session store for persistence

### Environment Configuration
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Session encryption key
- `STRIPE_SECRET_KEY`: Payment processing (optional)
- `NODE_ENV`: Environment flag for production optimizations

## Recent Changes

✓ Sistema de e-commerce completo implementado e funcional
✓ Carrinho de compras com Context API
✓ Processo de checkout com formulário de dados do cliente
✓ Métodos de pagamento PIX e cartão configurados
✓ Tela PIX personalizada conforme design fornecido
✓ Interface responsiva com tema neon/dark
✓ Banco PostgreSQL configurado e funcionando corretamente
✓ Sistema de autenticação corrigido (hash scrypt)
✓ Migração completa de dados para PostgreSQL executada
✓ Login do usuário admin funcionando (admin/admin123)
✓ Configuração local PostgreSQL criada e otimizada
✓ Scripts de migração para ambiente local implementados
✓ Arquivo de download otimizado criado (136KB)
✓ Problema de imports TypeScript corrigido
✓ Scripts de migração local funcionais implementados
✓ Guia completo de configuração local criado
✓ Seeds com dados reais do João Moura implementadas
✓ Portfolio automotivo especializado configurado
✓ Dados reais de clientes e projetos inseridos
✓ Script completo de seed com dados autênticos criado
✓ Documentação detalhada para configuração local
✓ Arquivo otimizado com dados reais gerado (220KB)
✓ Sistema de chat admin corrigido para mostrar nomes reais dos usuários
✓ Cores únicas implementadas para cada usuário no chat (8 cores diferentes)
✓ Problema de build de produção corrigido (Vite import condicional)
✓ Guia completo de deployment para AAPanel criado
✓ WebSocket authentication melhorado para usuários logados
✓ Filtragem de mensagens por usuário implementada

## Changelog

```
Changelog:
- June 25, 2025: Problemas de login e migração resolvidos
- June 25, 2025: PostgreSQL configurado e dados migrados com sucesso
- June 25, 2025: Sistema e-commerce completo implementado
- June 25, 2025: Configuração inicial e estrutura base
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```