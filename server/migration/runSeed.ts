import { runCompleteMigration, checkDataIntegrity } from "./runMigration";

async function main() {
  console.log("🌱 Iniciando seed de dados...");

  try {
    // Executar migração completa
    const result = await runCompleteMigration();

    if (result.success) {
      console.log("\n📊 Estatísticas finais:");
      console.log(`- Usuários: ${result.stats.users}`);
      console.log(`- Projetos: ${result.stats.projects}`);
      console.log(`- Serviços: ${result.stats.services}`);
      console.log(`- Depoimentos: ${result.stats.testimonials}`);
      console.log(`- Configurações: ${result.stats.settings}`);

      // Verificar integridade dos dados
      console.log("\n🔍 Verificando integridade dos dados...");
      const integrity = await checkDataIntegrity();

      if (integrity.success) {
        console.log(
          "\n🎉 Seed executado com sucesso! Todos os dados foram criados corretamente.",
        );
      } else {
        console.log(
          "\n⚠️ Seed concluído, mas foram encontrados problemas de integridade.",
        );
      }
    }
  } catch (error) {
    console.error("❌ Erro ao executar seed:", error);
    process.exit(1);
  }
}

// Executar se chamado diretamente
main().catch(console.error);

export default main;
