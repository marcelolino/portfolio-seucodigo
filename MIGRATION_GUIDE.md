# 🔄 Guia de Migração Local - SeuCodigo

## Pré-requisitos

### 1. PostgreSQL Instalado
```bash
# Windows (usando chocolatey)
choco install postgresql

# Ou baixar do site oficial
# https://www.postgresql.org/download/windows/

# Verificar se está rodando
pg_ctl status
```

### 2. Node.js 18+ com tsx
```bash
# Instalar dependências
npm install

# Verificar tsx
npx tsx --version
```

## Configuração

### 1. Configurar PostgreSQL
```sql
-- Conectar ao PostgreSQL
psql -U postgres

-- Criar banco
CREATE DATABASE portfolio;

-- Verificar
\l
\q
```

### 2. Arquivo .env
Crie `.env` na raiz do projeto:
```env
DATABASE_URL=postgresql://postgres:SUA_SENHA@localhost:5432/portfolio
SESSION_SECRET=chave_secreta_muito_forte_aqui
NODE_ENV=development
```

## Executar Migração

### Opção 1: Via npm (Recomendado)
```bash
npm run db:migrate:local
```

### Opção 2: Via tsx diretamente
```bash
npx tsx run-local-migration.ts
```

### Opção 3: Via Node.js (se configurado)
```bash
node --loader tsx/esm run-local-migration.ts
```

## Scripts Disponíveis

```json
{
  "scripts": {
    "db:migrate:local": "tsx run-local-migration.ts",
    "db:test": "tsx test-local-connection.ts",
    "db:setup": "npm run db:migrate:local && npm run dev"
  }
}
```

## Dados Criados

Após a migração, você terá:

### Usuários
- **admin** / admin123 (Administrador)
- **cliente1** / cliente123 (Cliente)

### Projetos (3)
- E-commerce Platform
- Portfolio Responsivo  
- Sistema de Gestão

### Serviços (3)
- Desenvolvimento Web Full-Stack
- Design UX/UI
- Consultoria Técnica

### Outros
- 3 depoimentos de clientes
- Configurações do site
- 2 métodos de pagamento (PIX, Stripe)

## Solução de Problemas

### Erro: Module not found
```bash
# Instalar tsx globalmente
npm install -g tsx

# Ou usar npx
npx tsx run-local-migration.ts
```

### Erro: Cannot find module 'pg'
```bash
npm install pg @types/pg
```

### Erro: ECONNREFUSED
```bash
# Iniciar PostgreSQL
# Windows
net start postgresql-x64-14

# Verificar porta
netstat -an | findstr :5432
```

### Erro: database "portfolio" does not exist
```bash
# Conectar e criar banco
psql -U postgres
CREATE DATABASE portfolio;
\q
```

### Erro: password authentication failed
```bash
# Resetar senha do postgres
psql -U postgres
ALTER USER postgres PASSWORD 'nova_senha';
\q

# Atualizar .env
DATABASE_URL=postgresql://postgres:nova_senha@localhost:5432/portfolio
```

## Estrutura Final

```
portfolio/
├── users (2 registros)
├── projects (3 registros)
├── services (3 registros)
├── testimonials (3 registros)
├── messages (0 registros)
├── contacts (0 registros)
├── orders (0 registros)
├── payment_methods (2 registros)
└── site_settings (1 registro)
```

## Verificação

### 1. Testar Conexão
```bash
npx tsx test-local-connection.ts
```

### 2. Verificar Dados
```sql
psql -U postgres -d portfolio
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM projects;
\q
```

### 3. Iniciar Aplicação
```bash
npm run dev
# Acesse: http://localhost:5000
# Login: admin/admin123
```

## Troubleshooting Avançado

### Windows Specific
```bash
# Verificar serviços PostgreSQL
services.msc
# Procurar por "postgresql"

# Path do PostgreSQL
# C:\Program Files\PostgreSQL\14\bin\
```

### Port Issues
```bash
# Verificar porta ocupada
netstat -ano | findstr :5432
netstat -ano | findstr :5000

# Matar processo se necessário
taskkill /PID <PID> /F
```

### Logs do PostgreSQL
```bash
# Localizar logs
# Windows: C:\Program Files\PostgreSQL\14\data\log\
tail -f postgresql-*.log
```