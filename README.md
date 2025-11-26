# CodeMarket - Marketplace de Produtos Digitais

Marketplace completo de produtos digitais similar ao CodeCanyon, construído com Node.js (backend) e React.js (frontend).

## 🌟 Features

### Para Clientes
- ✅ Navegação e busca de produtos
- ✅ Filtros por categoria, preço e ordenação
- ✅ Visualização detalhada de produtos
- ✅ Carrinho de compras
- ✅ Checkout com múltiplos métodos de pagamento (PIX, Cartão)
- ✅ Histórico de compras
- ✅ Download de produtos adquiridos
- ✅ Sistema de avaliações

### Para Vendedores
- ✅ Dashboard com estatísticas de vendas
- ✅ Gerenciamento de produtos (CRUD)
- ✅ Upload de imagens e arquivos digitais
- ✅ Editor rich text para descrições
- ✅ Relatórios de vendas
- ✅ Sistema de aprovação de produtos

### Para Administradores
- ✅ Dashboard com métricas gerais
- ✅ Gerenciamento de usuários
- ✅ Aprovação de vendedores
- ✅ Aprovação de produtos
- ✅ Gerenciamento de categorias
- ✅ Estatísticas do marketplace

### Recursos Gerais
- ✅ Autenticação JWT com refresh token
- ✅ Dark mode / Light mode
- ✅ Design responsivo
- ✅ Rate limiting
- ✅ Upload de arquivos
- ✅ Envio de emails
- ✅ API RESTful bem estruturada

## 🚀 Tecnologias

### Backend
- Node.js 18+
- Express.js
- Prisma ORM
- PostgreSQL
- JWT (jsonwebtoken)
- Bcrypt
- Multer
- Nodemailer

### Frontend
- React 18
- Vite
- TailwindCSS
- React Router DOM
- Zustand
- Axios
- React Icons

## 📋 Pré-requisitos

- **Node.js** 18 ou superior
- **PostgreSQL** 12 ou superior
- **npm** ou **yarn**

## ⚙️ Instalação

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd codemarket
```

### 2. Configurar Backend

```bash
cd backend

# Instalar dependências
npm install

# Configurar .env
cp .env.example .env
# Edite o arquivo .env com suas configurações

# Criar banco de dados
createdb codemarket

# Executar migrations
npm run prisma:migrate

# Popular banco com dados iniciais
npm run prisma:seed

# Iniciar servidor
npm run dev
```

O backend estará rodando em `http://localhost:5000`

### 3. Configurar Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Configurar .env (opcional, já tem valores padrão)
cp .env.example .env

# Iniciar servidor de desenvolvimento
npm run dev
```

O frontend estará rodando em `http://localhost:5173`

## 🔑 Credenciais Padrão

Após executar o seed, você terá acesso com:

### Administrador
- Email: `admin@codemarket.com`
- Senha: `admin123`

### Vendedor
- Email: `vendedor@codemarket.com`
- Senha: `seller123`

### Cliente
- Email: `cliente@codemarket.com`
- Senha: `cliente123`

## 📚 Estrutura do Projeto

```
codemarket/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── app.js
│   │   └── server.js
│   ├── uploads/
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── stores/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   └── package.json
│
└── README.md
```

## 🔌 API Endpoints

### Autenticação
- `POST /api/auth/register` - Registrar
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh-token` - Renovar token
- `POST /api/auth/forgot-password` - Recuperar senha

### Produtos
- `GET /api/products` - Listar produtos (público)
- `GET /api/products/:id` - Detalhes do produto
- `POST /api/products/seller/create` - Criar produto (seller)
- `PUT /api/products/seller/:id` - Editar produto (seller)
- `DELETE /api/products/seller/:id` - Deletar produto (seller)

### Pedidos
- `POST /api/orders/checkout` - Criar pedido
- `GET /api/orders` - Meus pedidos
- `GET /api/orders/download/:id` - Download de produto

### Admin
- `GET /api/admin/dashboard` - Dashboard
- `GET /api/admin/users` - Listar usuários
- `PUT /api/admin/users/:id/approve` - Aprovar vendedor
- `PUT /api/admin/products/:id/approve` - Aprovar produto

Veja a documentação completa em [backend/README.md](backend/README.md)

## 🎨 Screenshots

_(Adicione screenshots aqui após deployment)_

## 🧪 Testes

### Backend
```bash
cd backend
# Adicionar testes aqui
```

### Frontend
```bash
cd frontend
# Adicionar testes aqui
```

## 🚀 Deploy

### Backend (Heroku, Railway, etc)
```bash
cd backend
npm run build
# Configure as variáveis de ambiente
npm start
```

### Frontend (Vercel, Netlify, etc)
```bash
cd frontend
npm run build
# Deploy a pasta dist/
```

## 📝 Configuração de Email

Para usar o sistema de recuperação de senha, configure as credenciais SMTP no `.env`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu_email@gmail.com
SMTP_PASS=sua_senha_de_app
```

Para Gmail, você precisa criar uma [senha de app](https://support.google.com/accounts/answer/185833).

## 💳 Configuração de Pagamento

Para aceitar pagamentos, configure um dos gateways:

### Mercado Pago
```env
MERCADO_PAGO_ACCESS_TOKEN=seu_token
MERCADO_PAGO_PUBLIC_KEY=sua_chave
```

### Stripe
```env
STRIPE_SECRET_KEY=seu_secret_key
STRIPE_PUBLIC_KEY=sua_public_key
```

## 🔧 Desenvolvimento

### Adicionar nova migration
```bash
cd backend
npx prisma migrate dev --name nome_da_migration
```

### Ver banco de dados
```bash
cd backend
npm run prisma:studio
```

## 🐛 Problemas Comuns

### Erro de conexão com banco
- Verifique se o PostgreSQL está rodando
- Confirme as credenciais no `.env`
- Certifique-se de que o banco existe

### Erro de CORS
- Verifique se `FRONTEND_URL` está configurado corretamente no backend
- Certifique-se de que o frontend está rodando na porta correta

### Upload de arquivos não funciona
- Verifique permissões da pasta `uploads/`
- Confirme o limite de tamanho em `MAX_FILE_SIZE`

## 📄 Licença

MIT

## 👨‍💻 Autor

CodeMarket - Marketplace de Produtos Digitais

---

⭐ Se este projeto foi útil, deixe uma estrela!
