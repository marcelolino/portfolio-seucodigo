# 📥 Instruções de Download e Configuração

## Download Realizado com Sucesso!

Você baixou: `seucodigo-clean.tar.gz`

## Próximos Passos

### 1. Extrair o Arquivo
```bash
tar -xzf seucodigo-clean.tar.gz
cd seucodigo-clean/
```

### 2. Instalar Dependências
```bash
npm install
```

### 3. Configurar Banco de Dados
Crie um arquivo `.env`:
```env
DATABASE_URL=postgresql://postgres:SUA_SENHA@localhost:5432/portfolio
SESSION_SECRET=chave_secreta_muito_forte
NODE_ENV=development
```

### 4. Configurar PostgreSQL
```sql
-- Conectar ao PostgreSQL
psql -U postgres

-- Criar banco
CREATE DATABASE portfolio;

-- Sair
\q
```

### 5. Executar Migração
```bash
# Opção 1: Via tsx (recomendado)
npx tsx run-local-migration.ts

# Opção 2: Via Node.js
node run-local-migration.js
```

### 6. Iniciar Aplicação
```bash
npm run dev
```

## Credenciais de Acesso
- **Admin**: admin / admin123
- **Cliente**: cliente1 / cliente123

## Estrutura de Dados
Após a migração você terá:
- 2 usuários
- 3 projetos
- 3 serviços  
- 3 depoimentos
- Configurações do site
- 2 métodos de pagamento

## Solução de Problemas

### Erro: Module not found
```bash
npm install -g tsx
```

### Erro: PostgreSQL connection
```bash
# Verificar se PostgreSQL está rodando
pg_ctl status

# Iniciar se necessário
pg_ctl start
```

### Erro: Database não existe
```bash
createdb portfolio
```

## Suporte
Se tiver problemas, verifique:
1. PostgreSQL rodando na porta 5432
2. Banco 'portfolio' criado
3. Credenciais corretas no .env
4. Todas as dependências instaladas
