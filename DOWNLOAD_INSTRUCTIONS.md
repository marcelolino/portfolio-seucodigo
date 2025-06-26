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

### 5. Executar Seeds com Dados Reais
```bash
# Opção 1: Seed com dados reais do João Moura
npx tsx run-seed-real-data.ts

# Opção 2: Seed padrão (se preferir dados genéricos)
npx tsx run-local-migration.ts
```

### 6. Iniciar Aplicação
```bash
npm run dev
```

## Credenciais de Acesso

### Com Dados Reais (run-seed-real-data.ts)
- **Admin**: admin / admin123
- **Cliente**: roberto / roberto123  
- **Cliente**: anderson / anderson123
- **Cliente**: carlos / carlos123

### Com Dados Padrão (run-local-migration.ts)
- **Admin**: admin / admin123
- **Cliente**: cliente1 / cliente123

## Estrutura de Dados

### Dados Reais - João Moura
Após a migração você terá:
- 5 usuários (João Moura como admin + 4 clientes reais)
- 4 projetos especializados em sistemas automotivos
- 4 serviços especializados
- 4 depoimentos reais de clientes
- Configurações personalizadas
- 3 métodos de pagamento

### Projetos Incluídos
1. **Sistema OfiMotors** - Gestão completa para oficinas
2. **Portal AutoPeças Brasil** - E-commerce automotivo
3. **App Mecânicos Mobile** - Aplicativo para oficinas
4. **Dashboard Analytics** - Métricas em tempo real

## Solução de Problemas

### Erro: Module not found
```bash
npm install -g tsx
```

### Erro: PostgreSQL connection
```bash
# Verificar se PostgreSQL está rodando
pg_ctl status

# Iniciar se necessário (Windows)
net start postgresql-x64-14

# Iniciar se necessário (Linux/Mac)
sudo service postgresql start
```

### Erro: Database não existe
```bash
createdb portfolio
# ou
sudo -u postgres createdb portfolio
```

### Erro: Permissão negada
```bash
# Resetar senha do postgres
psql -U postgres
ALTER USER postgres PASSWORD 'nova_senha';
\q

# Atualizar .env
DATABASE_URL=postgresql://postgres:nova_senha@localhost:5432/portfolio
```

## Informações de Contato

- **Desenvolvedor**: João Moura
- **Email**: joaomoura.gta49@gmail.com
- **Telefone**: (62) 99888-7766
- **Localização**: Goiânia, GO

## Suporte
Se tiver problemas, verifique:
1. PostgreSQL rodando na porta 5432
2. Banco 'portfolio' criado
3. Credenciais corretas no .env
4. Todas as dependências instaladas (npm install)
5. tsx instalado globalmente (npm install -g tsx)