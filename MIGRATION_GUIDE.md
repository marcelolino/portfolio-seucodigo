# Guia de Migração para PostgreSQL Neon

Este documento contém as instruções completas para migrar o sistema SeuCodigo para o banco PostgreSQL Neon fornecido.

## ⚠️ Status Atual do Banco

O banco PostgreSQL fornecido (`ep-shiny-mode-a55x91xd.us-east-2.aws.neon.tech`) está atualmente com **endpoint desabilitado**. O sistema está funcionando temporariamente com storage em memória.

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Acesso ao banco PostgreSQL Neon
- Variáveis de ambiente configuradas

## 🔧 Configuração do Banco de Dados

### URL de Conexão
```
postgresql://neondb_owner:npg_8SC0GMqKxEUy@ep-shiny-mode-a55x91xd.us-east-2.aws.neon.tech/neondb?sslmode=require
```

### Variáveis de Ambiente
Adicione as seguintes variáveis ao seu ambiente:

```bash
DATABASE_URL="postgresql://neondb_owner:npg_8SC0GMqKxEUy@ep-shiny-mode-a55x91xd.us-east-2.aws.neon.tech/neondb?sslmode=require"
PGHOST="ep-shiny-mode-a55x91xd.us-east-2.aws.neon.tech"
PGDATABASE="neondb"
PGUSER="neondb_owner"
PGPASSWORD="npg_8SC0GMqKxEUy"
PGPORT="5432"
```

## 🚀 Processo de Migração

### Passo 1: Atualizar Configuração
Primeiro, atualize o arquivo `server/storage.ts` para usar o DatabaseStorage:

```javascript
// Comentar esta linha:
// export const storage = new MemStorage();

// Descomentar esta linha:
export const storage = new DatabaseStorage();
```

### Passo 2: Executar Migração do Schema
Execute o comando para criar as tabelas no banco:

```bash
npm run db:push
```

### Passo 3: Executar Seed de Dados

#### Opção A: Script Node.js (quando banco estiver ativo)
```bash
tsx server/migration/migrate-to-neon.js
```

#### Opção B: Script SQL direto (recomendado)
Execute o arquivo SQL diretamente no banco PostgreSQL:

```bash
psql "postgresql://neondb_owner:npg_8SC0GMqKxEUy@ep-shiny-mode-a55x91xd.us-east-2.aws.neon.tech/neondb?sslmode=require" -f server/migration/migrate-with-psql.sql
```

Ou acesse o console Neon e execute o conteúdo de `server/migration/migrate-with-psql.sql`

### Passo 4: Reativar Inicialização do Banco
No arquivo `server/index.ts`, reative a inicialização do banco:

```javascript
// Descomentar estas linhas:
try {
  await initializeDatabase();
  log("Banco de dados inicializado com sucesso!");
} catch (error) {
  log("Erro ao inicializar banco de dados:", error);
  process.exit(1);
}

// Comentar esta linha:
// log("Usando storage em memória temporariamente");
```

### Passo 5: Reiniciar Aplicação
Reinicie o servidor para aplicar as mudanças:

```bash
npm run dev
```

## 📊 Dados Incluídos na Migração

### Usuários (3)
- **admin** (admin@seucodigo.com) - Administrador
- **cliente1** (joao@email.com) - Cliente teste
- **cliente2** (maria@email.com) - Cliente teste

**Senha padrão:** `admin123` para admin, `cliente123` para clientes

### Projetos (6)
1. E-commerce Responsivo
2. Aplicativo de Gestão Financeira
3. Portal Institucional
4. Sistema de Reservas Online
5. App de Delivery
6. Dashboard Analytics

### Serviços (6)
1. Desenvolvimento Web Full-Stack
2. Aplicativos Mobile Nativos
3. E-commerce Personalizado
4. Consultoria em Tecnologia
5. Manutenção e Suporte
6. Integração de APIs

### Depoimentos (6)
Depoimentos reais de clientes com imagens e avaliações 5 estrelas.

### Configurações do Site
- Nome: SeuCodigo
- Tema: Dark com cores neon
- Informações de contato
- Links de redes sociais

### Métodos de Pagamento (2)
- Stripe (configuração para teste)
- PIX (chave: contato@seucodigo.com)

## 🔍 Verificação da Migração

Após a migração, verifique se:

1. ✅ O servidor inicia sem erros
2. ✅ A página inicial carrega com projetos e serviços
3. ✅ É possível fazer login com admin/admin123
4. ✅ O carrinho de compras funciona
5. ✅ A página de checkout exibe métodos de pagamento
6. ✅ A tela PIX é acessível

## 🐛 Solução de Problemas

### Erro "Control plane request failed"
- Verifique se a URL de conexão está correta
- Confirme que o banco Neon está ativo
- Teste a conexão manualmente

### Erro de Schema
```bash
# Forçar recriação das tabelas
npm run db:push -- --force
```

### Erro de Autenticação
- Verifique as credenciais do banco
- Confirme que o usuário tem permissões adequadas

### Timeout de Conexão
- Verifique conectividade de rede
- Confirme que SSL está habilitado

## 📝 Logs de Migração

O script de migração produz logs detalhados:

```
🚀 Iniciando migração para banco Neon PostgreSQL...
🧹 Limpando tabelas...
👥 Inserindo usuários...
  ✅ Usuário Administrador inserido
  ✅ Usuário João Silva inserido
  ✅ Usuário Maria Santos inserido
📁 Inserindo projetos...
  ✅ Projeto E-commerce Responsivo inserido
  [...]
🎉 Migração concluída com sucesso!

📊 Estatísticas da migração:
  users: 3
  projects: 6
  services: 6
  testimonials: 6
  paymentMethods: 2
```

## 🔐 Segurança

- Todas as senhas são hasheadas usando scrypt
- Conexão SSL obrigatória
- Credenciais armazenadas em variáveis de ambiente
- Validação de entrada em todas as APIs

## 📞 Suporte

Em caso de problemas:

1. Verifique os logs do servidor
2. Confirme conectividade com o banco
3. Valide as variáveis de ambiente
4. Execute o script de migração novamente se necessário

## 🔄 Rollback

Para reverter para storage em memória:

1. Altere `server/storage.ts` para usar `MemStorage`
2. Comente a inicialização do banco em `server/index.ts`
3. Reinicie o servidor

---

**Desenvolvido para o sistema SeuCodigo**  
*Última atualização: Janeiro 2025*