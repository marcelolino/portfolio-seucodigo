import { hashPassword } from "./auth";
import { storage } from "./storage";

async function updateAdminPassword() {
  try {
    const newHashedPassword = await hashPassword('admin123');
    console.log('Nova senha hash gerada:', newHashedPassword);
    
    // Atualizar no banco via SQL direto seria mais simples
    console.log('Use este hash no SQL: UPDATE users SET password = \'' + newHashedPassword + '\' WHERE username = \'admin\';');
  } catch (error) {
    console.error('Erro ao gerar hash:', error);
  }
}

updateAdminPassword();