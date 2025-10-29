-- Migração SQL para PostgreSQL
-- Execute este script diretamente no banco PostgreSQL Neon
-- URL: postgresql://neondb_owner:npg_8SC0GMqKxEUy@ep-shiny-mode-a55x91xd.us-east-2.aws.neon.tech/neondb?sslmode=require

-- Limpar dados existentes
TRUNCATE TABLE IF EXISTS messages CASCADE;
TRUNCATE TABLE IF EXISTS contacts CASCADE;
TRUNCATE TABLE IF EXISTS orders CASCADE;
TRUNCATE TABLE IF EXISTS testimonials CASCADE;
TRUNCATE TABLE IF EXISTS services CASCADE;
TRUNCATE TABLE IF EXISTS projects CASCADE;
TRUNCATE TABLE IF EXISTS payment_methods CASCADE;
TRUNCATE TABLE IF EXISTS site_settings CASCADE;
TRUNCATE TABLE IF EXISTS users CASCADE;

-- Reiniciar sequências
ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE projects_id_seq RESTART WITH 1;
ALTER SEQUENCE services_id_seq RESTART WITH 1;
ALTER SEQUENCE testimonials_id_seq RESTART WITH 1;
ALTER SEQUENCE messages_id_seq RESTART WITH 1;
ALTER SEQUENCE contacts_id_seq RESTART WITH 1;
ALTER SEQUENCE orders_id_seq RESTART WITH 1;
ALTER SEQUENCE payment_methods_id_seq RESTART WITH 1;
ALTER SEQUENCE site_settings_id_seq RESTART WITH 1;

-- Inserir usuários
INSERT INTO users (username, password, name, email, avatar, role, created_at) VALUES
('admin', '$scrypt$N=16384,r=8,p=1$randomsalt$hashedpassword', 'Administrador', 'admin@seucodigo.com', NULL, 'admin', NOW()),
('cliente1', '$scrypt$N=16384,r=8,p=1$randomsalt$hashedpassword', 'João Silva', 'joao@email.com', NULL, 'user', NOW()),
('cliente2', '$scrypt$N=16384,r=8,p=1$randomsalt$hashedpassword', 'Maria Santos', 'maria@email.com', NULL, 'user', NOW());

-- Inserir projetos
INSERT INTO projects (title, description, image, technologies, price, category, status, created_at) VALUES
('E-commerce Responsivo', 'Loja virtual completa com carrinho de compras, sistema de pagamento e painel administrativo. Desenvolvida com React e Node.js.', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop', ARRAY['React', 'Node.js', 'PostgreSQL', 'Stripe'], '2500.00', 'E-commerce', 'completed', NOW()),
('Aplicativo de Gestão Financeira', 'App mobile para controle de finanças pessoais com gráficos, relatórios e sincronização em nuvem.', 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop', ARRAY['React Native', 'Firebase', 'Chart.js'], '3000.00', 'Mobile', 'completed', NOW()),
('Portal Institucional', 'Website corporativo moderno com CMS integrado, blog e sistema de contato.', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop', ARRAY['Next.js', 'Tailwind CSS', 'Strapi'], '1800.00', 'Website', 'completed', NOW()),
('Sistema de Reservas Online', 'Plataforma para agendamento de serviços com calendario integrado e notificações automáticas.', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop', ARRAY['Vue.js', 'Express', 'MongoDB'], '2200.00', 'Sistema', 'in-progress', NOW()),
('App de Delivery', 'Aplicativo completo para delivery com rastreamento em tempo real e sistema de pagamento.', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop', ARRAY['Flutter', 'Firebase', 'Google Maps'], '4000.00', 'Mobile', 'planning', NOW()),
('Dashboard Analytics', 'Painel de controle com métricas em tempo real, relatórios customizáveis e integração com APIs.', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop', ARRAY['React', 'D3.js', 'Python', 'FastAPI'], '3500.00', 'Dashboard', 'completed', NOW());

-- Inserir serviços
INSERT INTO services (title, description, price, category, technologies, created_at) VALUES
('Desenvolvimento Web Full-Stack', 'Criação de aplicações web completas, desde o frontend até o backend, com tecnologias modernas e escaláveis.', '150.00', 'Web Development', ARRAY['React', 'Node.js', 'PostgreSQL'], NOW()),
('Aplicativos Mobile Nativos', 'Desenvolvimento de apps para iOS e Android com performance nativa e experiência de usuário excepcional.', '200.00', 'Mobile Development', ARRAY['React Native', 'Flutter'], NOW()),
('E-commerce Personalizado', 'Lojas virtuais sob medida com carrinho, pagamentos, estoque e painel administrativo completo.', '250.00', 'E-commerce', ARRAY['React', 'Stripe', 'PostgreSQL'], NOW()),
('Consultoria em Tecnologia', 'Análise técnica, arquitetura de sistemas e consultoria estratégica para projetos digitais.', '120.00', 'Consultoria', ARRAY['Architecture', 'DevOps'], NOW()),
('Manutenção e Suporte', 'Suporte técnico contínuo, atualizações de segurança e melhorias em sistemas existentes.', '80.00', 'Suporte', ARRAY['Monitoring', 'Security'], NOW()),
('Integração de APIs', 'Conexão entre sistemas diferentes através de APIs REST, GraphQL e webhooks.', '100.00', 'Integração', ARRAY['REST', 'GraphQL', 'Webhooks'], NOW());

-- Inserir depoimentos
INSERT INTO testimonials (name, avatar, company, position, message, rating, created_at) VALUES
('Carlos Eduardo', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face', 'TechStart', 'CEO', 'O trabalho realizado superou todas as expectativas. A equipe demonstrou excelência técnica e comprometimento total com o projeto.', 5, NOW()),
('Ana Paula Rodrigues', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face', 'InovaCorp', 'Diretora', 'Profissionalismo e qualidade excepcionais. O projeto foi entregue no prazo e funcionou perfeitamente desde o primeiro dia.', 5, NOW()),
('Roberto Silva', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', 'DigitalBiz', 'Fundador', 'Impressionante atenção aos detalhes e capacidade de entender exatamente o que precisávamos. Recomendo sem hesitação.', 5, NOW()),
('Fernanda Costa', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face', 'ModernaTech', 'Gerente de TI', 'A solução desenvolvida transformou nossos processos internos. A qualidade do código é excepcional e a documentação impecável.', 5, NOW()),
('Marcos Oliveira', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face', 'StartupX', 'CTO', 'Parceria estratégica que resultou em um produto incrível. A comunicação foi clara e o suporte pós-entrega é exemplar.', 5, NOW()),
('Juliana Mendes', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face', 'EcommercePlus', 'Proprietária', 'Minha loja online nunca funcionou tão bem! As vendas aumentaram 300% após o novo sistema. Investimento que valeu cada centavo.', 5, NOW());

-- Inserir configurações do site
INSERT INTO site_settings (site_name, site_title, site_description, contact_email, contact_phone, address, social_media, theme, primary_color, secondary_color, created_at) VALUES
('SeuCodigo', 'SeuCodigo - Desenvolvimento Web e Mobile', 'Criamos soluções digitais inovadoras e personalizadas para seu negócio. Desenvolvimento web, mobile e consultoria em tecnologia.', 'contato@seucodigo.com', '(11) 99999-9999', 'São Paulo, SP - Brasil', '{"instagram": "https://instagram.com/seucodigo", "linkedin": "https://linkedin.com/company/seucodigo", "github": "https://github.com/seucodigo"}', 'dark', '#00ff88', '#0066cc', NOW());

-- Inserir métodos de pagamento
INSERT INTO payment_methods (provider, name, is_active, config, created_at) VALUES
('stripe', 'Stripe', true, '{"publicKey": "pk_test_...", "currency": "BRL"}', NOW()),
('pix', 'PIX', true, '{"pixKey": "contato@seucodigo.com", "bankName": "Banco do Brasil"}', NOW());

-- Verificar inserções
SELECT 'Usuários:' as tabela, COUNT(*) as total FROM users
UNION ALL
SELECT 'Projetos:', COUNT(*) FROM projects
UNION ALL
SELECT 'Serviços:', COUNT(*) FROM services
UNION ALL
SELECT 'Depoimentos:', COUNT(*) FROM testimonials
UNION ALL
SELECT 'Configurações:', COUNT(*) FROM site_settings
UNION ALL
SELECT 'Métodos Pagamento:', COUNT(*) FROM payment_methods;