import { Express } from "express";
import { db } from "./db";
import { sql } from "drizzle-orm";

export function setupSettingsRoutes(app: Express) {
  // Buscar configurações
  app.get("/api/settings", async (req, res) => {
    try {
      const result = await db.execute(sql`SELECT * FROM site_settings LIMIT 1`);
      
      if (result.rows.length > 0) {
        res.json(result.rows[0]);
      } else {
        // Retornar configurações padrão se não existir
        const defaultSettings = {
          siteName: 'SeuCodigo',
          siteTitle: 'Desenvolvedor Full Stack',
          contactEmail: 'contato@seucodigo.com',
          contactPhone: '(11) 9999-8888',
          address: 'São Paulo, SP - Brasil',
          logo: '',
          github: '',
          linkedin: '',
          twitter: '',
          instagram: '',
          whatsapp: ''
        };
        res.json(defaultSettings);
      }
    } catch (error) {
      console.error("Erro ao buscar configurações:", error);
      // Sempre retornar algo mesmo em caso de erro
      res.json({
        siteName: 'SeuCodigo',
        siteTitle: 'Desenvolvedor Full Stack',
        contactEmail: 'contato@seucodigo.com',
        contactPhone: '(11) 9999-8888',
        address: 'São Paulo, SP - Brasil',
        logo: '',
        github: '',
        linkedin: '',
        twitter: '',
        instagram: '',
        whatsapp: ''
      });
    }
  });

  // Atualizar configurações
  app.put("/api/settings", async (req, res) => {
    try {
      const settings = req.body;
      
      // Verificar se já existe
      const existing = await db.execute(sql`SELECT * FROM site_settings LIMIT 1`);
      
      if (existing.rows.length > 0) {
        // Atualizar
        await db.execute(sql`
          UPDATE site_settings 
          SET 
            site_name = ${settings.siteName || 'SeuCodigo'},
            site_title = ${settings.siteTitle || 'Desenvolvedor Full Stack'},
            contact_email = ${settings.contactEmail || 'contato@seucodigo.com'},
            contact_phone = ${settings.contactPhone || '(11) 9999-8888'},
            address = ${settings.address || 'São Paulo, SP - Brasil'},
            logo = ${settings.logo || ''},
            github = ${settings.github || ''},
            linkedin = ${settings.linkedin || ''},
            twitter = ${settings.twitter || ''},
            instagram = ${settings.instagram || ''},
            whatsapp = ${settings.whatsapp || ''}
          WHERE id = ${existing.rows[0].id}
        `);
      } else {
        // Criar novo
        await db.execute(sql`
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
        `);
      }
      
      // Retornar configurações atualizadas
      const updated = await db.execute(sql`SELECT * FROM site_settings LIMIT 1`);
      res.json(updated.rows[0]);
      
    } catch (error) {
      console.error("Erro ao atualizar configurações:", error);
      res.status(500).json({ 
        message: "Erro ao atualizar configurações", 
        error: error.message 
      });
    }
  });
}