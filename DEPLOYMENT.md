# Uputstvo za postavljanje na server

## Brzi pregled

Ovaj projekat se sastoji od:
- **Backend:** Laravel 12 aplikacija (PHP) - u `backend/` direktorijumu
- **Frontend:** React aplikacija (Node.js) - u `frontend/` direktorijumu
- **Baza:** PostgreSQL ili MySQL

## Korak 1: Priprema servera

### Instalacija potrebnih paketa

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y php8.2 php8.2-fpm php8.2-cli php8.2-pgsql php8.2-mysql \
  php8.2-mbstring php8.2-xml php8.2-curl php8.2-zip php8.2-gd \
  composer nodejs npm nginx postgresql postgresql-contrib certbot python3-certbot-nginx
```

### Kreiranje baze podataka

```bash
# Prijavite se kao postgres korisnik
sudo -u postgres psql

# U psql:
CREATE DATABASE pius_academy;
CREATE USER pius_user WITH PASSWORD 'secure_password_here';
ALTER ROLE pius_user SET client_encoding TO 'utf8mb4';
ALTER ROLE pius_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE pius_user SET default_transaction_deferrable TO on;
ALTER ROLE pius_user SET default_time_zone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE pius_academy TO pius_user;
\q
```

## Korak 2: Kloniranje i setup

```bash
# Kloniranje repozitorijuma
cd /var/www
sudo git clone https://github.com/aaleksandraa/PIUSupis.git pius-academy
cd pius-academy

# Dozvole
sudo chown -R $USER:$USER .
```

## Korak 3: Backend setup

```bash
cd backend

# Instalacija zavisnosti
composer install --no-dev --optimize-autoloader

# Kopiranje .env fajla
cp .env.example .env

# Generisanje APP_KEY
php artisan key:generate

# Uredite .env sa vašim podacima
nano .env
```

### Važne .env vrednosti za produkciju:

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com

# Baza
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=pius_academy
DB_USERNAME=pius_user
DB_PASSWORD=secure_password_here

# Frontend
FRONTEND_URL=https://your-domain.com

# Email (Mailgun primer)
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailgun.org
MAIL_PORT=587
MAIL_USERNAME=postmaster@your-domain.com
MAIL_PASSWORD=your-mailgun-password
MAIL_FROM_ADDRESS=info@pius-academy.com
MAIL_FROM_NAME="PIUS Academy"
```

### Pokretanje migracija

```bash
php artisan migrate --force
php artisan db:seed --class=ContractTemplateSeeder --force

cd ..
```

## Korak 4: Frontend build

```bash
cd frontend

# Instalacija zavisnosti
npm install --production

# Build za produkciju
npm run build

# Rezultat je u frontend/dist/

cd ..
```

## Korak 5: Nginx konfiguracija

### Kreirajte konfiguraciju

```bash
sudo nano /etc/nginx/sites-available/pius-academy
```

### Dodajte sledeću konfiguraciju:

```nginx
# HTTP -> HTTPS redirect
server {
    listen 80;
    listen [::]:80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL certifikati
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # SSL konfiguracija
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Root direktorijum
    root /var/www/pius-academy/backend/public;
    index index.php index.html;

    # Logging
    access_log /var/log/nginx/pius-academy-access.log;
    error_log /var/log/nginx/pius-academy-error.log;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Gzip kompresija
    gzip on;
    gzip_vary on;
    gzip_min_length 1000;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss;

    # Laravel routing
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    # PHP-FPM
    location ~ \.php$ {
        fastcgi_pass unix:/run/php/php8.2-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_param HTTPS on;
    }

    # Frontend assets - cache 1 godinu
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Zabrana pristupa skrivenim fajlovima
    location ~ /\. {
        deny all;
    }

    # Zabrana pristupa Laravel fajlovima
    location ~ /\.env {
        deny all;
    }
}
```

### Aktivirajte konfiguraciju

```bash
sudo ln -s /etc/nginx/sites-available/pius-academy /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

## Korak 6: SSL certifikat

```bash
# Generisanje certifikata
sudo certbot certonly --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

## Korak 7: Dozvole za fajlove

```bash
# Promenite vlasnika
sudo chown -R www-data:www-data /var/www/pius-academy

# Dozvole
sudo chmod -R 755 /var/www/pius-academy
sudo chmod -R 775 /var/www/pius-academy/backend/storage
sudo chmod -R 775 /var/www/pius-academy/backend/bootstrap/cache
```

## Korak 8: PHP-FPM konfiguracija

```bash
# Uredite PHP-FPM konfiguraciju
sudo nano /etc/php/8.2/fpm/pool.d/www.conf

# Proverite da li su ove vrednosti postavljene:
# user = www-data
# group = www-data
# listen = /run/php/php8.2-fpm.sock

# Restartujte PHP-FPM
sudo systemctl restart php8.2-fpm
```

## Korak 9: Cron job

```bash
# Otvorite crontab
sudo crontab -e

# Dodajte sledeću liniju:
* * * * * cd /var/www/pius-academy/backend && php artisan schedule:run >> /dev/null 2>&1
```

## Korak 10: Monitoring i logovanje

```bash
# Proverite log fajlove
tail -f /var/www/pius-academy/backend/storage/logs/laravel.log
tail -f /var/log/nginx/pius-academy-error.log
tail -f /var/log/php8.2-fpm.log

# Proverite status servisa
sudo systemctl status nginx
sudo systemctl status php8.2-fpm
sudo systemctl status postgresql
```

## Korak 11: Backup

### Kreirajte backup skriptu

```bash
sudo nano /usr/local/bin/backup-pius-academy.sh
```

```bash
#!/bin/bash

BACKUP_DIR="/backups/pius-academy"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup baze
sudo -u postgres pg_dump pius_academy | gzip > $BACKUP_DIR/database_$DATE.sql.gz

# Backup fajlova
tar -czf $BACKUP_DIR/files_$DATE.tar.gz /var/www/pius-academy

# Obriši stare backupe (starije od 30 dana)
find $BACKUP_DIR -type f -mtime +30 -delete

echo "Backup completed: $DATE"
```

```bash
# Dozvole
sudo chmod +x /usr/local/bin/backup-pius-academy.sh

# Dodajte u crontab (dnevno u 2:00 AM)
sudo crontab -e
# 0 2 * * * /usr/local/bin/backup-pius-academy.sh
```

## Troubleshooting

### 502 Bad Gateway

```bash
# Proverite PHP-FPM status
sudo systemctl status php8.2-fpm

# Restartujte
sudo systemctl restart php8.2-fpm

# Proverite log
tail -f /var/log/php8.2-fpm.log
```

### 500 Internal Server Error

```bash
# Proverite Laravel log
tail -f /var/www/pius-academy/backend/storage/logs/laravel.log

# Regenerirajte cache
cd /var/www/pius-academy/backend
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Database connection error

```bash
# Proverite PostgreSQL status
sudo systemctl status postgresql

# Testirajte konekciju
psql -h 127.0.0.1 -U pius_user -d pius_academy

# Proverite .env
cat /var/www/pius-academy/backend/.env | grep DB_
```

### Frontend ne učitava

```bash
# Proverite da li je build napravljen
ls -la /var/www/pius-academy/frontend/dist/

# Ako ne postoji, pokrenite build
cd /var/www/pius-academy/frontend
npm run build

# Proverite Nginx log
tail -f /var/log/nginx/pius-academy-error.log
```

## Automatizovani deploy sa GitHub Actions

### Postavite GitHub Secrets

1. Idite na GitHub repozitorijum
2. Settings → Secrets and variables → Actions
3. Dodajte sledeće:
   - `SERVER_HOST` - IP adresa servera
   - `SERVER_USER` - SSH korisnik (npr. ubuntu)
   - `SERVER_SSH_KEY` - Privatni SSH ključ

### Generiši SSH ključ

```bash
# Na lokalnoj mašini
ssh-keygen -t rsa -b 4096 -f ~/.ssh/pius-academy

# Kopirajte javni ključ na server
ssh-copy-id -i ~/.ssh/pius-academy.pub user@server-ip

# Kopirajte privatni ključ kao GitHub Secret
cat ~/.ssh/pius-academy
```

## Čeklistu za produkciju

- [ ] Baza podataka je kreirana i konfigurirana
- [ ] .env je pravilno konfiguriran
- [ ] SSL certifikat je instaliran
- [ ] Nginx je konfiguriran
- [ ] PHP-FPM je pokrenuta
- [ ] Dozvole za fajlove su postavljene
- [ ] Migracije su pokrenute
- [ ] Frontend je build-ovan
- [ ] Cron job je postavljen
- [ ] Backup skripte su postavljene
- [ ] Email je konfiguriran
- [ ] Admin korisnik je kreiran
- [ ] Testiranje je obavljeno

## Podrška

Za pitanja ili probleme, kontaktirajte: info@pius-academy.com
