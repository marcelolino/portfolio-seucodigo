import { db } from './db';
import { sql } from 'drizzle-orm';

export async function fixSettings() {
  try {
    // Criar uma função simples para buscar configurações
    const getSettings = async () => {
      try {
        const result = await db.execute(sql`SELECT * FROM site_settings LIMIT 1`);
        return result.rows[0];
      } catch (error) {
        console.log("Erro ao buscar configurações:", error);
        return null;
      }
    };

    // Criar função para atualizar configurações
    const updateSettings = async (settings: any) => {
      try {
        const existing = await getSettings();
        
        if (existing) {
          // Atualizar existente
          const result = await db.execute(sql`
            UPDATE site_settings 
            SET 
              site_name = ${settings.siteName || existing.site_name},
              site_title = ${settings.siteTitle || existing.site_title},
              contact_email = ${settings.contactEmail || existing.contact_email},
              contact_phone = ${settings.contactPhone || existing.contact_phone},
              address = ${settings.address || existing.address},
              logo = ${settings.logo || existing.logo || ''},
              github = ${settings.github || existing.github || ''},
              linkedin = ${settings.linkedin || existing.linkedin || ''},
              twitter = ${settings.twitter || existing.twitter || ''},
              instagram = ${settings.instagram || existing.instagram || ''},
              whatsapp = ${settings.whatsapp || existing.whatsapp || ''}
            WHERE id = ${existing.id}
            RETURNING *
          `);
          return result.rows[0];
        } else {
          // Criar novo
          const result = await db.execute(sql`
            INSERT INTO site_settings (
              site_name, site_title, contact_email, contact_phone, address,
              logo, github, linkedin, twitter, instagram, whatsapp
            ) VALUES (
              ${settings.siteName || 'SeuCodigo'},
              ${settings.siteTitle || 'Desenvolvedor Full Stack'},
              ${settings.contactEmail || 'contato@seucodigo.com'},
              ${settings.contactPhone || '(11) 9999-8888'},
              ${settings.address || 'São Paulo, SP - Brasil'},
              ${settings.logo || ''},
              ${settings.github || ''},
              ${settings.linkedin || ''},
              ${settings.twitter || ''},
              ${settings.instagram || ''},
              ${settings.whatsapp || ''}
            )
            RETURNING *
          `);
          return result.rows[0];
        }
      } catch (error) {
        console.error("Erro ao atualizar:", error);
        throw error;
      }
    };

    return { getSettings, updateSettings };
  } catch (error) {
    console.error("Erro na configuração:", error);
    throw error;
  }
}