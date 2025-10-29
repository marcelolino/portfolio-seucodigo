import { runCompleteMigration } from "./runMigration";

async function main() {
  try {
    console.log("🚀 Iniciando processo de seed do banco de dados...");
    await runCompleteMigration();
    console.log("✅ Seed concluído com sucesso!");
  } catch (error) {
    console.error("❌ Erro durante o seed:", error);
    process.exit(1);
  }
}

main();