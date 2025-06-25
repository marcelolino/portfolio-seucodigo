#!/bin/bash

# Script para criar um arquivo ZIP limpo do projeto SeuCodigo
echo "📦 Criando arquivo de download do projeto SeuCodigo..."

# Criar diretório temporário
mkdir -p /tmp/seucodigo-download

# Copiar arquivos essenciais
echo "📁 Copiando arquivos essenciais..."

# Estrutura principal
cp -r client /tmp/seucodigo-download/
cp -r server /tmp/seucodigo-download/
cp -r shared /tmp/seucodigo-download/

# Arquivos de configuração
cp package.json /tmp/seucodigo-download/
cp package-lock.json /tmp/seucodigo-download/
cp tsconfig.json /tmp/seucodigo-download/
cp vite.config.ts /tmp/seucodigo-download/
cp tailwind.config.ts /tmp/seucodigo-download/
cp postcss.config.js /tmp/seucodigo-download/
cp drizzle.config.ts /tmp/seucodigo-download/
cp components.json /tmp/seucodigo-download/

# Documentação
cp README.md /tmp/seucodigo-download/
cp replit.md /tmp/seucodigo-download/
cp MIGRATION_GUIDE.md /tmp/seucodigo-download/
cp .gitignore /tmp/seucodigo-download/
cp .dockerignore /tmp/seucodigo-download/
cp package-info.json /tmp/seucodigo-download/

# Criar arquivo TAR.GZ
cd /tmp
echo "🗜️ Compactando arquivos..."
tar -czf seucodigo-portfolio.tar.gz --exclude="*.log" --exclude="*.tmp" --exclude=".DS_Store" seucodigo-download/

# Mover para diretório do projeto
mv seucodigo-portfolio.tar.gz /home/runner/workspace/

# Limpar temporários
rm -rf /tmp/seucodigo-download

echo "✅ Arquivo criado: seucodigo-portfolio.tar.gz"
echo "📊 Tamanho do arquivo:"
ls -lh /home/runner/workspace/seucodigo-portfolio.tar.gz
echo ""
echo "🎉 Projeto pronto para download!"
echo ""
echo "📋 Conteúdo do arquivo:"
echo "- Código fonte completo (frontend + backend)"
echo "- Configurações de build e deploy"
echo "- Documentação completa"
echo "- Schema do banco de dados"
echo "- Scripts de migração"
echo ""
echo "🚀 Para usar o projeto:"
echo "1. Extrair o arquivo: tar -xzf seucodigo-portfolio.tar.gz"
echo "2. npm install"
echo "3. Configurar DATABASE_URL"
echo "4. npm run db:push"
echo "5. npm run dev"