# Configuração da Vercel

## Variáveis de Ambiente Necessárias

Configure as seguintes variáveis de ambiente no painel da Vercel:

### Obrigatórias:
- `DATABASE_URL` - URL de conexão do PostgreSQL (Neon ou outro provider)
- `SESSION_SECRET` - String secreta para sessões (ex: gere com `openssl rand -base64 32`)

### Opcionais:
- `STRIPE_SECRET_KEY` - Chave secreta do Stripe (se usar pagamentos)
- `NODE_ENV` - Defina como `production`

## Configuração do Build

O arquivo `vercel.json` já está configurado corretamente com:
- Build command que compila frontend e backend
- Configuração de rotas para API e SPA
- Função serverless para o backend

## Passo a Passo para Deploy

1. **Conecte o repositório GitHub à Vercel**
   - Acesse https://vercel.com
   - Importe o projeto do GitHub

2. **Configure as variáveis de ambiente**
   - No painel da Vercel, vá em Settings > Environment Variables
   - Adicione todas as variáveis listadas acima

3. **Configure o Database (se usar Neon)**
   - Crie um projeto no Neon (https://neon.tech)
   - Copie a connection string
   - Cole em `DATABASE_URL` na Vercel

4. **Deploy**
   - Faça push para o GitHub
   - A Vercel fará o deploy automaticamente

## Verificação Pós-Deploy

Após o deploy, verifique:
- [ ] Frontend carrega corretamente
- [ ] API responde em `/api/user` (deve retornar 401 se não autenticado)
- [ ] API responde em `/api/projects` (deve retornar lista de projetos)
- [ ] Login funciona corretamente

## Troubleshooting

Se houver erro 500:
- Verifique os logs da Vercel (Functions > Logs)
- Confirme que `DATABASE_URL` está configurado
- Confirme que o banco de dados tem as tabelas criadas

Se houver erro 404 nas APIs:
- Verifique se o build completou com sucesso
- Confirme que o arquivo `api/index.js` foi gerado
