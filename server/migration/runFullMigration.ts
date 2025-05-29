import { runCompleteMigration, resetAllTables, checkDataIntegrity } from "./runMigration";

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  try {
    switch (command) {
      case 'reset':
        console.log("🔄 Executando reset completo...");
        await resetAllTables();
        await runCompleteMigration();
        break;
        
      case 'check':
        console.log("🔍 Verificando integridade dos dados...");
        const isValid = await checkDataIntegrity();
        process.exit(isValid ? 0 : 1);
        break;
        
      case 'seed':
      default:
        console.log("🌱 Executando migração com seed...");
        await runCompleteMigration();
        break;
    }
    
    console.log("✅ Operação concluída com sucesso!");
    process.exit(0);
    
  } catch (error) {
    console.error("❌ Erro durante a operação:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}