# 🏠 Configuração Local do SeuCodigo

## Pré-requisitos

1. **PostgreSQL instalado e rodando**
   ```bash
   # Ubuntu/Debian
   sudo apt install postgresql postgresql-contrib
   sudo service postgresql start
   
   # macOS
   brew install postgresql
   brew services start postgresql
   
   # Windows
   # Baixe e instale do site oficial postgresql.org
   ```

2. **Node.js 18+ instalado**

## Configuração Passo a Passo

### 1. Configurar PostgreSQL

```bash
# Conectar como usuário postgres
sudo -u postgres psql

# Criar banco de dados
CREATE DATABASE portfolio;

# Criar usuário (opcional)
CREATE USER seucodigo WITH PASSWORD '123';
GRANT ALL PRIVILEGES ON DATABASE portfolio TO seucodigo;

# Sair do psql
\q
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL=postgresql://postgres:123@localhost:5432/portfolio
SESSION_SECRET=seu_secret_key_aqui_muito_seguro
NODE_ENV=development
```

### 3. Instalar Dependências

```bash
npm install
```

### 4. Executar Migração Local

```bash
# Usar o script personalizado
npm run migrate:local

# Ou executar diretamente
node run-local-migration.js
```

### 5. Iniciar Aplicação

```bash
npm run dev
```

## Credenciais de Acesso

- **Admin**: `admin` / `admin123`
- **Cliente**: `cliente1` / `cliente123`

## Scripts Disponíveis

- `npm run migrate:local` - Executa migração no PostgreSQL local
- `npm run setup:local` - Migração + iniciar desenvolvimento
- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run db:push` - Push do schema (Drizzle)

## Solução de Problemas

### Erro de Conexão
```
ECONNREFUSED 127.0.0.1:5432
```
**Solução**: PostgreSQL não está rodando
```bash
sudo service postgresql start  # Linux
brew services start postgresql # macOS
```

### Banco Não Existe
```
database "portfolio" does not exist
```
**Solução**: Criar o banco
```bash
createdb portfolio
# ou
sudo -u postgres createdb portfolio
```

### Permissão Negada
```
FATAL: password authentication failed
```
**Solução**: Verificar credenciais no .env ou configurar PostgreSQL
```bash
sudo -u postgres psql
ALTER USER postgres PASSWORD '123';
```

### Porta Ocupada
```
Error: listen EADDRINUSE :::5000
```
**Solução**: Alterar porta no código ou matar processo
```bash
lsof -ti:5000 | xargs kill -9
```

## Estrutura de Dados

Após a migração, você terá:
- 2 usuários (admin + cliente)
- 3 projetos de exemplo
- 3 serviços disponíveis
- 3 depoimentos de clientes
- Configurações do site
- 2 métodos de pagamento (PIX + Stripe)

## Diferenças da Versão Replit

- Usa PostgreSQL local com driver `pg` padrão
- Não usa driver Neon serverless
- SSL desabilitado para conexões locais
- Pool de conexões otimizado para desenvolvimento local