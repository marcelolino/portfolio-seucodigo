# 🚀 Guia de Deploy na Vercel com Neon Database

Este guia mostra como fazer deploy da sua aplicação fullstack (React + Express) na Vercel usando o banco de dados Neon PostgreSQL.

## 📋 Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Configurar Banco de Dados Neon](#1-configurar-banco-de-dados-neon)
3. [Fazer Deploy na Vercel](#2-fazer-deploy-na-vercel)
4. [Configurar Variáveis de Ambiente](#3-configurar-variáveis-de-ambiente)
5. [Executar Migrations](#4-executar-migrations)
6. [Verificar Deploy](#5-verificar-deploy)
7. [Desenvolvimento Local com Vercel](#desenvolvimento-local)
8. [Troubleshooting](#troubleshooting)

---

## Pré-requisitos

- ✅ Conta no [GitHub](https://github.com)
- ✅ Conta na [Vercel](https://vercel.com) (pode usar login do GitHub)
- ✅ Código do projeto no GitHub
- ✅ Node.js instalado localmente (para testes)

---

## 1. Configurar Banco de Dados Neon

### Opção A: Criar via Integração Vercel (RECOMENDADO)

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Vá em **Storage** no menu lateral
3. Clique em **Create Database**
4. Selecione **Neon Serverless Postgres**
5. Escolha um nome para o database
6. Clique em **Create**
7. ✅ A Vercel automaticamente adiciona a `DATABASE_URL` ao seu projeto!

### Opção B: Criar Manualmente no Neon

1. Acesse [console.neon.tech](https://console.neon.tech)
2. Faça login ou crie uma conta
3. Clique em **New Project**
4. Escolha:
   - **Name**: nome do seu projeto
   - **Region**: escolha a região mais próxima (ex: AWS us-east-1)
   - **Postgres version**: 15 ou superior
5. Clique em **Create Project**
6. Copie a **Connection String** que aparece:
   ```
   postgresql://user:password@host.region.aws.neon.tech/dbname?sslmode=require
   ```
7. Guarde essa string para usar na Vercel

---

## 2. Fazer Deploy na Vercel

### Via GitHub (Recomendado)

1. **Push seu código para o GitHub**
   ```bash
   git add .
   git commit -m "Preparar para deploy na Vercel"
   git push origin main
   ```

2. **Importar no Vercel**
   - Acesse [vercel.com/new](https://vercel.com/new)
   - Clique em **Import Git Repository**
   - Selecione seu repositório
   - Clique em **Import**

3. **Configurar o Projeto**
   - **Project Name**: escolha um nome (será usado no domínio)
   - **Framework Preset**: Vite (ou Other)
   - **Root Directory**: deixe em branco ou `.`
   - **Build Command**: `npm run build` (já configurado)
   - **Output Directory**: `client/dist` (já configurado no vercel.json)
   - Clique em **Deploy**

### Via Vercel CLI

```bash
# Instalar Vercel CLI
npm install -g vercel

# Fazer login
vercel login

# Deploy
vercel --prod
```

---

## 3. Configurar Variáveis de Ambiente

Após criar o projeto na Vercel:

1. Vá em **Settings** → **Environment Variables**
2. Adicione as seguintes variáveis:

### Variáveis Obrigatórias

| Nome | Valor | Descrição |
|------|-------|-----------|
| `DATABASE_URL` | `postgresql://user:password@host.neon.tech/dbname?sslmode=require` | Connection string do Neon |
| `SESSION_SECRET` | Gere uma string aleatória | Para segurança das sessões |
| `NODE_ENV` | `production` | Ambiente de produção |

### Variáveis Opcionais (se usar)

| Nome | Valor | Descrição |
|------|-------|-----------|
| `STRIPE_SECRET_KEY` | `sk_live_...` | Chave secreta do Stripe (pagamentos) |
| `STRIPE_PUBLISHABLE_KEY` | `pk_live_...` | Chave pública do Stripe |

### Como Gerar SESSION_SECRET Seguro

```bash
# No terminal (Linux/Mac)
openssl rand -base64 32

# Ou use um site
# https://randomkeygen.com/
```

3. Clique em **Save** em cada variável
4. Marque as caixas para aplicar em **Production**, **Preview** e **Development**

---

## 4. Executar Migrations

Após configurar o DATABASE_URL, você precisa criar as tabelas no banco:

### Opção A: Via Vercel CLI Local

```bash
# Instalar dependências
npm install

# Criar arquivo .env local com DATABASE_URL do Neon
echo "DATABASE_URL=sua_connection_string_aqui" > .env

# Executar migration
npm run db:push
```

### Opção B: Via Script Remoto

1. Na Vercel, vá em **Settings** → **Functions**
2. Crie uma nova função temporária de migration
3. Ou use o Vercel CLI:
   ```bash
   vercel env pull .env.local
   npm run db:push
   ```

---

## 5. Verificar Deploy

Após o deploy:

1. Acesse a URL do projeto: `https://seu-projeto.vercel.app`
2. Verifique se:
   - ✅ Frontend carrega corretamente
   - ✅ API responde: `https://seu-projeto.vercel.app/api/projects`
   - ✅ Login funciona
   - ✅ Dados aparecem na página

### Testar API Manualmente

```bash
# Testar endpoint de projetos
curl https://seu-projeto.vercel.app/api/projects

# Deve retornar JSON com os projetos
```

---

## Desenvolvimento Local

Para testar localmente com a estrutura da Vercel:

### 1. Instalar Vercel CLI

```bash
npm install -g vercel
```

### 2. Configurar Ambiente Local

```bash
# Linkar projeto local com Vercel
vercel link

# Baixar variáveis de ambiente
vercel env pull .env.local
```

### 3. Rodar em Modo Dev

```bash
# Usar servidor Vercel local (simula produção)
vercel dev

# Ou usar o servidor normal de desenvolvimento
npm run dev
```

### 4. Testar Localmente

Acesse:
- Frontend: `http://localhost:3000`
- API: `http://localhost:3000/api/projects`

---

## Estrutura do Projeto (Após Adaptação)

```
seu-projeto/
├── api/                    # Backend serverless
│   └── index.ts           # ✨ Express API como função serverless
├── client/                # Frontend React
│   ├── src/
│   ├── dist/              # Build do Vite (gerado)
│   └── index.html
├── server/                # Módulos auxiliares do backend
│   ├── auth.ts
│   ├── storage.ts
│   ├── db.ts              # Pool tradicional (para Replit)
│   ├── db-vercel.ts       # ✨ Driver Neon HTTP (para Vercel)
│   └── ...
├── shared/                # Código compartilhado
│   └── schema.ts          # Schema Drizzle
├── vercel.json            # ✨ Configuração da Vercel
├── .env.example           # ✨ Exemplo de variáveis
├── package.json
└── VERCEL_DEPLOY.md       # ✨ Este guia
```

**Arquivos Novos/Modificados**:
- ✨ `api/index.ts` - Backend adaptado para serverless
- ✨ `server/db-vercel.ts` - Conexão Neon otimizada para Vercel
- ✨ `vercel.json` - Configuração de rotas
- ✨ `.env.example` - Template de variáveis de ambiente

---

## ⚠️ Diferenças CRÍTICAS vs Servidor Tradicional

| Servidor Tradicional | Vercel Serverless |
|---------------------|-------------------|
| Express roda 24/7 | Express reinicia a cada request |
| `app.listen()` para iniciar | `export default app` para Vercel |
| Conexões de BD persistentes | Driver HTTP serverless (@neondatabase/serverless) |
| Sessions em memória OK | **Sessions DEVEM usar PostgreSQL store** |
| WebSockets funcionam | WebSockets **NÃO** funcionam* |
| Porta fixa (ex: 3000) | Domínio único para frontend + API |
| `pg` Pool tradicional | Driver `neon` HTTP (server/db-vercel.ts) |

> **⚠️ IMPORTANTE**: 
> - **Sessions**: MemoryStore NÃO funciona! Use PostgreSQL session store.
> - **Database**: Use `@neondatabase/serverless` (já configurado em `server/db-vercel.ts`)
> - **WebSockets**: Não suportados. Use Pusher, Ably ou Socket.io com adaptadores externos.
> - **Cold Starts**: Primeira requisição após inatividade pode demorar 1-3 segundos.

---

## Troubleshooting

### ❌ Erro: "Cannot find module '@shared/schema'"

**Solução**: Verifique se o `vercel.json` está configurado corretamente e que todos os imports usam caminhos relativos corretos.

### ❌ Erro: "DATABASE_URL is not defined"

**Solução**: 
1. Vá em Settings → Environment Variables
2. Adicione `DATABASE_URL`
3. Faça redeploy: `vercel --prod`

### ❌ API retorna 500/404

**Solução**:
1. Verifique os logs: `vercel logs seu-projeto`
2. Confirme que as rotas começam com `/api`
3. Verifique se `vercel.json` tem os rewrites corretos

### ❌ Sessões não persistem / Logout automático

**Problema**: Sessions em memória (MemoryStore) **NÃO funcionam em serverless** porque a memória é resetada entre invocações.

**Solução OBRIGATÓRIA**: Configure PostgreSQL session store no arquivo `server/storage.ts`:

```typescript
// Modificar DbStorage para usar PostgreSQL session store
export class DbStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    // IMPORTANTE: Usar PostgreSQL store ao invés de MemoryStore
    const PostgresSessionStore = connectPg(session);
    this.sessionStore = new PostgresSessionStore({
      pool: pool,
      tableName: 'session',
      createTableIfMissing: true
    });
  }
  // ... resto do código
}
```

**Verifique que está usando DbStorage**:
```typescript
// Em server/storage.ts, no final do arquivo
export const storage = process.env.DATABASE_URL 
  ? new DbStorage()  // ← DEVE usar DbStorage em produção
  : new MemStorage(); // ← Apenas para desenvolvimento local
```

**Criar tabela de sessions**:
```sql
-- Execute no Neon ou via drizzle migration
CREATE TABLE IF NOT EXISTS "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL,
  PRIMARY KEY ("sid")
);

CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");
```

### ❌ "Build time exceeded"

**Solução**: Verifique se não há dependências desnecessárias sendo instaladas. A Vercel tem limite de 45 segundos para builds no plano gratuito.

### ❌ Cold Start / Funções lentas

**Problema**: Primeira requisição após inatividade é lenta.

**Soluções**:
- Otimize imports (use tree-shaking)
- Minimize dependências pesadas
- Considere Vercel Pro para Edge Functions
- Use caching agressivo

---

## Atualizações Automáticas

✨ **Auto-Deploy está ativado!**

Sempre que você fizer push para o branch `main` no GitHub:
1. Vercel detecta automaticamente
2. Faz build do projeto
3. Faz deploy da nova versão
4. Seu site é atualizado em ~1 minuto

Para desativar:
- Vá em **Settings** → **Git** → Desmarque "Auto Deploy"

---

## Domínio Personalizado

Para usar seu próprio domínio (ex: `www.seusite.com`):

1. Vá em **Settings** → **Domains**
2. Clique em **Add Domain**
3. Digite seu domínio
4. Siga as instruções para configurar DNS
5. Aguarde propagação (pode levar até 24h)

### SSL/HTTPS

✅ A Vercel automaticamente configura SSL gratuito via Let's Encrypt!

---

## Comandos Úteis

```bash
# Ver logs em tempo real
vercel logs --follow

# Ver deploys
vercel ls

# Remover projeto
vercel remove seu-projeto

# Fazer deploy de uma branch específica
vercel --prod --branch staging

# Baixar env vars
vercel env pull

# Adicionar env var via CLI
vercel env add DATABASE_URL
```

---

## Checklist Final ✅

Antes de considerar o deploy completo:

- [ ] Projeto no GitHub
- [ ] Database Neon criado
- [ ] Projeto importado na Vercel
- [ ] `DATABASE_URL` configurada
- [ ] `SESSION_SECRET` configurada
- [ ] Migrations executadas (`npm run db:push`)
- [ ] Frontend acessível em `https://seu-projeto.vercel.app`
- [ ] API respondendo em `https://seu-projeto.vercel.app/api/...`
- [ ] Login/Logout funcionando
- [ ] Dados do banco aparecendo
- [ ] Auto-deploy ativado

---

## Recursos Adicionais

- 📖 [Documentação Vercel](https://vercel.com/docs)
- 📖 [Documentação Neon](https://neon.tech/docs)
- 📖 [Vercel Functions](https://vercel.com/docs/functions)
- 📖 [Environment Variables](https://vercel.com/docs/projects/environment-variables)

---

## Suporte

Se encontrar problemas:

1. Verifique os logs: `vercel logs`
2. Consulte a [documentação da Vercel](https://vercel.com/docs)
3. Acesse o [Discord da Vercel](https://vercel.com/discord)
4. Verifique o [Status da Vercel](https://www.vercel-status.com/)

---

**Bom deploy! 🚀**
