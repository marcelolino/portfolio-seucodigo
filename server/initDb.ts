import { db } from './db';
import { sql } from 'drizzle-orm';

async function initializeDatabase() {
  try {
    console.log('Inicializando banco de dados...');
    
    // Criar tabelas se não existirem
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        technologies TEXT[],
        image TEXT NOT NULL,
        featured BOOLEAN DEFAULT false,
        "order" INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS services (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        icon TEXT,
        price TEXT,
        features TEXT[],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS testimonials (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        company TEXT NOT NULL,
        position TEXT,
        avatar TEXT NOT NULL,
        message TEXT NOT NULL,
        rating INTEGER NOT NULL,
        "order" INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        content TEXT NOT NULL,
        is_admin BOOLEAN DEFAULT false,
        read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS site_settings (
        id SERIAL PRIMARY KEY,
        site_name TEXT DEFAULT 'SeuCodigo',
        site_title TEXT DEFAULT 'Desenvolvedor Full Stack',
        contact_email TEXT DEFAULT 'contato@seucodigo.com',
        contact_phone TEXT DEFAULT '(62) 32028119',
        address TEXT DEFAULT 'Av. Paulista, 1000, Goiânia - SP',
        logo TEXT,
        github TEXT,
        linkedin TEXT,
        twitter TEXT,
        instagram TEXT,
        whatsapp TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Tabelas criadas com sucesso!');

    // Inserir configurações padrão se não existirem
    const existingSettings = await db.execute(sql`SELECT COUNT(*) as count FROM site_settings`);
    if (existingSettings.rows[0].count === '0') {
      await db.execute(sql`
        INSERT INTO site_settings (
          site_name, site_title, contact_email, contact_phone, address,
          github, linkedin, whatsapp
        ) VALUES (
          'SeuCodigo',
          'Desenvolvedor Full Stack',
          'contato@seucodigo.com',
          '(62) 32028119',
          'Av. Paulista, 1000, Goiânia - SP',
          'https://github.com/seucodigo',
          'https://linkedin.com/in/seucodigo',
          '5562999888777'
        );
      `);
      console.log('Configurações padrão inseridas!');
    }

    // Criar usuário admin padrão se não existir
    const existingAdmin = await db.execute(sql`SELECT COUNT(*) as count FROM users WHERE role = 'admin'`);
    if (existingAdmin.rows[0].count === '0') {
      // Hash da senha "admin123" (você deve usar bcrypt em produção)
      const hashedPassword = '$2b$10$K7L/lQrQl8LKaGX4qRV5..rJ1P.PX5qx3q5J/mB.EQ.zQ.x.M.9Se';
      await db.execute(sql`
        INSERT INTO users (name, email, username, password, role)
        VALUES ('Admin', 'admin@seucodigo.com', 'admin', ${hashedPassword}, 'admin');
      `);
      console.log('Usuário admin criado!');
    }

    console.log('Banco de dados inicializado com sucesso!');
  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error);
    throw error;
  }
}

export { initializeDatabase };