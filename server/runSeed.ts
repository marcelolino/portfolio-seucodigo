import { seed } from './seed';

async function main() {
  try {
    await seed();
    console.log('✅ Dados iniciais inseridos com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao inserir dados iniciais:', error);
    process.exit(1);
  }
}

main();