# Deployment Guide for AAPanel

## Fixed Production Build Issues

The original error was caused by the server trying to import Vite in production mode. This has been fixed by:

1. Conditional Vite imports only in development
2. Direct static file serving in production
3. Proper environment variable handling

## Pre-deployment Setup

### 1. Install Dependencies on Server
```bash
# Navigate to your project directory
cd /www/wwwroot/seucodigo

# Install production dependencies
npm install --only=production
```

### 2. Build the Application
```bash
# Build frontend and backend
npm run build
```

### 3. Environment Variables
Create a `.env` file in your project root:
```bash
NODE_ENV=production
DATABASE_URL=postgresql://username:password@localhost:5432/seucodigo
SESSION_SECRET=your-super-secret-session-key-here
```

## Database Setup

### 1. Create PostgreSQL Database
```sql
-- Connect to PostgreSQL as superuser
CREATE DATABASE seucodigo;
CREATE USER seucodigo_user WITH PASSWORD 'your-password';
GRANT ALL PRIVILEGES ON DATABASE seucodigo TO seucodigo_user;
```

### 2. Run Database Migration
```bash
# Push schema to database
npm run db:push
```

### 3. Seed Initial Data (Optional)
```bash
# Run the real data seed script
npx tsx run-seed-real-data.ts
```

## AAPanel Configuration

### 1. Create Node.js Site
1. Go to AAPanel > Website > Node Project
2. Create new Node.js project:
   - Domain: your-domain.com
   - Path: /www/wwwroot/seucodigo
   - Version: Node.js 18+
   - Startup File: dist/index.js

### 2. Environment Configuration
In AAPanel Node.js project settings:
- Set Environment: `production`
- Add environment variables from your .env file

### 3. Process Management
```bash
# Start the application
NODE_ENV=production node dist/index.js
```

## PM2 Configuration (Recommended)

### 1. Install PM2
```bash
npm install -g pm2
```

### 2. Create PM2 Configuration
Create `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'seucodigo',
    script: 'dist/index.js',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
}
```

### 3. Start with PM2
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Nginx Configuration

Create `/etc/nginx/sites-available/seucodigo`:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket support for chat
    location /ws {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Troubleshooting

### Common Issues

1. **Module Not Found Errors**
   - Ensure all dependencies are installed: `npm install`
   - Check NODE_ENV is set to "production"

2. **Database Connection Issues**
   - Verify DATABASE_URL is correct
   - Check PostgreSQL is running and accessible

3. **Permission Issues**
   - Set correct file permissions: `chmod -R 755 /www/wwwroot/seucodigo`
   - Ensure user has access to database

4. **Port Already in Use**
   - Check what's running on port 5000: `lsof -i :5000`
   - Stop conflicting processes or change port

### Logs
Check application logs:
```bash
# PM2 logs
pm2 logs seucodigo

# Direct logs
tail -f /www/wwwroot/seucodigo/logs/error.log
```

## Maintenance

### Updates
```bash
# Pull latest code
git pull origin main

# Install dependencies
npm install

# Build application
npm run build

# Restart application
pm2 restart seucodigo
```

### Database Backup
```bash
# Backup database
pg_dump seucodigo > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore database
psql seucodigo < backup_file.sql
```

## Security Checklist

- [ ] Set strong SESSION_SECRET
- [ ] Configure PostgreSQL with restricted user permissions
- [ ] Enable SSL/HTTPS in production
- [ ] Set up firewall rules
- [ ] Regular security updates
- [ ] Monitor application logs
- [ ] Backup database regularly

## Production Optimizations

1. **Enable Gzip Compression** in Nginx
2. **Set up CDN** for static assets
3. **Configure Caching** headers
4. **Monitor Performance** with tools like New Relic
5. **Set up Log Rotation** for application logs