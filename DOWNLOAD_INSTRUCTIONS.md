# 📥 Como Fazer Download do Projeto SeuCodigo

## Problema: Rate Limit Exceeded

Se você está enfrentando erro de "Rate limit exceeded" no download do Replit, aqui estão as soluções:

## ✅ Soluções Alternativas

### 1. Arquivo Compactado Otimizado
- **Arquivo**: `seucodigo-minimal.tar.gz` (muito menor)
- **Localização**: Na raiz do projeto
- **Tamanho**: ~200KB
- **Conteúdo**: Apenas código fonte essencial

### 2. Download por Partes
Se o download completo não funcionar, baixe as pastas individualmente:

```
📁 client/          (Interface React)
📁 server/          (Backend Node.js)  
📁 shared/          (Código compartilhado)
📄 package.json     (Dependências)
📄 README.md        (Documentação)
```

### 3. Via Terminal (se disponível)
```bash
# No terminal do Replit
tar -czf meu-projeto.tar.gz client/ server/ shared/ package.json *.config.ts *.md
```

### 4. Git Clone (se conectado)
```bash
git clone [URL_DO_REPOSITORIO]
```

## 🚀 Configuração Após Download

1. **Extrair arquivo**:
   ```bash
   tar -xzf seucodigo-minimal.tar.gz
   cd seucodigo-clean
   ```

2. **Instalar dependências**:
   ```bash
   npm install
   ```

3. **Configurar banco de dados**:
   ```bash
   # Criar arquivo .env
   DATABASE_URL="postgresql://usuario:senha@host:porta/database"
   SESSION_SECRET="sua_chave_secreta_aqui"
   ```

4. **Executar migrações**:
   ```bash
   npm run db:push
   ```

5. **Iniciar projeto**:
   ```bash
   npm run dev
   ```

## 🔑 Credenciais de Acesso

- **Admin**: username: `admin` / password: `admin123`
- **Cliente**: username: `cliente1` / password: `cliente123`

## 📞 Suporte

Se ainda tiver problemas, tente:
- Aguardar alguns minutos e tentar novamente
- Baixar arquivos individuais
- Usar o arquivo `.tar.gz` menor que criamos

## 📊 Conteúdo Incluído

✅ Frontend React completo
✅ Backend Node.js/Express  
✅ Schema PostgreSQL
✅ Configurações de build
✅ Documentação completa
✅ Sistema de autenticação
✅ E-commerce funcional
✅ Design responsivo