# PIUS Academy - Sistem za registraciju studenata

Kompletan sistem za registraciju studenata na online kurseve sa digitalnim potpisivanjem ugovora, upravljanjem fakturama i plaćanjima.

## Tehnologije

- **Backend:** Laravel 12 (PHP 8.2+)
- **Frontend:** React 18 + Vite + TailwindCSS
- **Baza:** PostgreSQL (preporučeno) ili MySQL
- **Auth:** Laravel Sanctum
- **PDF:** DomPDF
- **Email:** Mailgun/SMTP

## Struktura projekta

```
PIUSupis/
├── backend/                 # Laravel aplikacija (glavni folder)
│   ├── app/
│   ├── config/
│   ├── database/
│   ├── frontend/           # React aplikacija (ugniježđena)
│   │   ├── src/
│   │   ├── public/
│   │   └── package.json
│   ├── routes/
│   ├── storage/
│   ├── vendor/
│   ├── .env
│   ├── .env.example
│   ├── composer.json
│   └── artisan
└── README.md
```

## Instalacija - Lokalno

### 1. Kloniranje repozitorijuma

```bash
git clone https://github.com/aaleksandraa/PIUSupis.git
cd PIUSupis
```

### 2. Backend setup

```bash
# Instalacija PHP zavisnosti
composer install

# Kopiranje .env fajla
cp .env.example .env

# Generisanje APP_KEY
php artisan key:generate

# Konfiguracija baze (vidi ispod)
# Uredite .env fajl sa vašim podacima
```

### 3. Konfiguracija baze podataka

Uredite `.env` fajl:

```env
# PostgreSQL (preporučeno za produkciju)
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=pius_academy
DB_USERNAME=postgres
DB_PASSWORD=your_secure_password

# Ili MySQL
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=pius_academy
DB_USERNAME=root
DB_PASSWORD=your_password
```

### 4. Migracije i seederi

```bash
# Pokretanje migracija
php artisan migrate

# Seedovanje template-a ugovora
php artisan db:seed --class=ContractTemplateSeeder

# Seedovanje admin korisnika (opciono)
php artisan db:seed --class=AdminUserSeeder
```

### 5. Frontend setup

```bash
cd frontend
npm install
```

## Pokretanje - Development

### Terminal 1 - Backend

```bash
php artisan serve
# Backend dostupan na: http://localhost:8000
```

### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
# Frontend dostupan na: http://localhost:5173
```

## Postavljanje na server

### Preduslov

- PHP 8.2+
- Composer
- Node.js 18+
- PostgreSQL ili MySQL
- Nginx ili Apache
- SSL certifikat (Let's Encrypt)

### 1. Kloniranje na server

```bash
cd /var/www
git clone https://github.com/aaleksandraa/PIUSupis.git pius-academy
cd pius-academy
```

### 2. Backend setup na serveru

```bash
# Instalacija zavisnosti
composer install --no-dev --optimize-autoloader

# Kopiranje .env fajla
cp .env.example .env

# Generisanje APP_KEY
php artisan key:generate

# Konfiguracija .env za produkciju
# Uredite sledeće vrednosti:
# APP_ENV=production
# APP_DEBUG=false
# APP_URL=https://your-domain.com
# DB_HOST, DB_DATABASE, DB_USERNAME, DB_PASSWORD
# MAIL_* konfiguracija
# FRONTEND_URL=https://your-domain.com
```

### 3. Migracije na serveru

```bash
php artisan migrate --force
php artisan db:seed --class=ContractTemplateSeeder --force
```

### 4. Frontend build

```bash
cd frontend
npm install --production
npm run build
# Generiše dist/ folder
```

### 5. Nginx konfiguracija

Kreirajte `/etc/nginx/sites-available/pius-academy`:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name your-domain.com www.your-domain.com;
    
    # Redirect HTTP na HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL certifikati (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    root /var/www/pius-academy/public;
    index index.php index.html;

    # Logging
    access_log /var/log/nginx/pius-academy-access.log;
    error_log /var/log/nginx/pius-academy-error.log;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

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
    }

    # Frontend assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Deny access to sensitive files
    location ~ /\. {
        deny all;
    }
}
```

Aktivirajte konfiguraciju:

```bash
sudo ln -s /etc/nginx/sites-available/pius-academy /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 6. SSL certifikat (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d your-domain.com -d www.your-domain.com
```

### 7. Dozvole za fajlove

```bash
sudo chown -R www-data:www-data /var/www/pius-academy
sudo chmod -R 755 /var/www/pius-academy
sudo chmod -R 775 /var/www/pius-academy/storage
sudo chmod -R 775 /var/www/pius-academy/bootstrap/cache
```

### 8. Cron job za Laravel

```bash
sudo crontab -e
# Dodajte:
* * * * * cd /var/www/pius-academy && php artisan schedule:run >> /dev/null 2>&1
```

### 9. Supervisor za queue (opciono)

Kreirajte `/etc/supervisor/conf.d/pius-academy.conf`:

```ini
[program:pius-academy-queue]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/pius-academy/artisan queue:work --sleep=3 --tries=3
autostart=true
autorestart=true
numprocs=1
redirect_stderr=true
stdout_logfile=/var/log/pius-academy-queue.log
```

Pokrenite:

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start pius-academy-queue:*
```

## Git workflow

### Inicijalni push

```bash
git add .
git commit -m "Initial commit: PIUS Academy project setup"
git push -u origin main
```

### Redovni commits

```bash
# Proverite status
git status

# Dodajte izmene
git add .

# Commit sa opisom
git commit -m "Feature: Add postal code to student registration"

# Push na GitHub
git push origin main
```

### Grane za razvoj

```bash
# Kreirajte granu za novu funkcionalnost
git checkout -b feature/new-feature

# Radite na grani
# ... izmene ...

# Commit i push
git add .
git commit -m "Add new feature"
git push origin feature/new-feature

# Na GitHub-u kreirajte Pull Request
# Nakon review-a, merge u main
```

## Konfiguracija email-a

Uredite `.env`:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailgun.org
MAIL_PORT=587
MAIL_USERNAME=your-mailgun-username
MAIL_PASSWORD=your-mailgun-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="info@pius-academy.com"
MAIL_FROM_NAME="PIUS Academy"
```

## Admin pristup

- URL: `https://your-domain.com/?admin=true`
- Email: `info@pius-academy.com`
- Password: `aleksandra2025!` (promenite nakon prvog logovanja!)

## API Endpoints

### Javni (bez autentifikacije)

- `POST /api/auth/login` - Admin prijava
- `POST /api/students` - Registracija studenta
- `POST /api/contracts` - Potpisivanje ugovora
- `GET /api/contracts/preview` - Pregled ugovora
- `GET /api/landing-pages/slug/{slug}` - Landing page

### Zaštićeni (admin)

- `GET /api/dashboard/stats` - Statistike
- `GET /api/students` - Lista studenata
- `GET /api/invoices` - Lista faktura
- `GET /api/contracts` - Lista ugovora
- `GET /api/contracts/{id}/pdf` - Download PDF
- `GET /api/contract-templates` - Template ugovora
- `PUT /api/contract-templates/{id}` - Ažuriranje template-a

## Troubleshooting

### 500 Internal Server Error

```bash
# Proverite log fajlove
tail -f storage/logs/laravel.log

# Proverite dozvole
sudo chmod -R 775 storage bootstrap/cache

# Regenerirajte cache
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Database connection error

```bash
# Proverite .env konfiguraciju
# Proverite da li je baza dostupna
php artisan tinker
# U tinker-u: DB::connection()->getPdo();
```

### Frontend ne učitava

```bash
# Proverite da li je build napravljen
ls -la frontend/dist/

# Ako ne postoji, pokrenite build
cd frontend && npm run build

# Proverite FRONTEND_URL u .env
```

## Paketi

- **PIUS PLUS:** 1.800€
  - 60 dana edukacije
  - Video materijali
  - WhatsApp grupa
  - Sedmični pozivi
  - Digitalni sertifikat

- **PIUS PRO:** 2.500€
  - Sve kao PIUS PLUS +
  - Startni paket za rad (mašina, igle, boje, itd.)

## Podrška

Za pitanja ili probleme, kontaktirajte: info@pius-academy.com

## Licenca

Privatni projekat - Sva prava zadržana
