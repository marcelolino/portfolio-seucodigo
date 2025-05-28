
import { runUpdatedMigration } from "./updateMigration";
import { runCompleteMigration, checkDataIntegrity } from "./runMigration";

async function main() {
  console.log("🚀 Iniciando migração completa do sistema...");

  try {
    // 1. Executar migração atualizada das tabelas
    console.log("\n📋 Etapa 1: Atualizando estrutura das tabelas...");
    await runUpdatedMigration();

    // 2. Executar migração de dados (seed)
    console.log("\n🌱 Etapa 2: Inserindo dados iniciais...");
    const result = await runCompleteMigration();

    if (result.success) {
      console.log("\n📊 Estatísticas finais:");
      console.log(`- Usuários: ${result.stats.users}`);
      console.log(`- Projetos: ${result.stats.projects}`);
      console.log(`- Serviços: ${result.stats.services}`);
      console.log(`- Depoimentos: ${result.stats.testimonials}`);
      console.log(`- Configurações: ${result.stats.settings}`);

      // 3. Verificar integridade dos dados
      console.log("\n🔍 Etapa 3: Verificando integridade dos dados...");
      const integrity = await checkDataIntegrity();

      if (integrity.success) {
        console.log("\n🎉 Migração completa executada com sucesso!");
        console.log("✅ Todas as tabelas foram criadas e populadas corretamente.");
      } else {
        console.log("\n⚠️ Migração concluída, mas foram encontrados problemas de integridade:");
        integrity.checks.forEach(check => {
          const status = check.passed ? "✅" : "❌";
          console.log(`   ${status} ${check.check}: ${check.value}`);
        });
      }
    }

    return { success: true };

  } catch (error) {
    console.error("❌ Erro durante a migração completa:", error);
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main().catch(console.error);
}

export { main as runFullMigration };
