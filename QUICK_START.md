# Brzi početak - PIUS Academy

## Za razvoj (Development)

### 1. Kloniranje

```bash
git clone https://github.com/aaleksandraa/PIUSupis.git
cd PIUSupis
```

### 2. Backend setup

```bash
cd backend

# Instalacija zavisnosti
composer install

# Kopiranje .env fajla
cp .env.example .env

# Generisanje APP_KEY
php artisan key:generate

# Migracije
php artisan migrate

# Seedovanje template-a
php artisan db:seed --class=ContractTemplateSeeder

cd ..
```

### 3. Frontend setup

```bash
cd frontend

# Instalacija zavisnosti
npm install

cd ..
```

### 4. Pokretanje

**Terminal 1 - Backend:**
```bash
cd backend
php artisan serve
# http://localhost:8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# http://localhost:5173
```

## Za produkciju (Server)

Detaljne instrukcije su u `DEPLOYMENT.md` fajlu.

### Brzi pregled:

1. **Kloniranje na server:**
   ```bash
   cd /var/www
   git clone https://github.com/aaleksandraa/PIUSupis.git pius-academy
   cd pius-academy
   ```

2. **Backend:**
   ```bash
   cd backend
   composer install --no-dev --optimize-autoloader
   cp .env.example .env
   php artisan key:generate
   # Uredite .env sa vašim podacima
   php artisan migrate --force
   php artisan db:seed --class=ContractTemplateSeeder --force
   cd ..
   ```

3. **Frontend:**
   ```bash
   cd frontend
   npm install --production
   npm run build
   cd ..
   ```

4. **Nginx konfiguracija** - vidi `DEPLOYMENT.md`

5. **SSL certifikat:**
   ```bash
   sudo certbot certonly --nginx -d your-domain.com
   ```

## Admin pristup

- URL: `http://localhost:5173/?admin=true` (development)
- Email: `info@pius-academy.com`
- Password: `aleksandra2025!`

## Struktura projekta

```
PIUSupis/
├── backend/                # Laravel aplikacija
│   ├── app/
│   ├── config/
│   ├── database/
│   ├── routes/
│   ├── storage/
│   ├── .env
│   ├── composer.json
│   └── README.md
├── frontend/               # React aplikacija
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── README.md
├── README.md               # Detaljne instrukcije
├── DEPLOYMENT.md           # Instrukcije za server
└── QUICK_START.md          # Ovaj fajl
```

## Česti problemi

### "Database connection error"
- Proverite `backend/.env` konfiguraciju
- Proverite da li je baza dostupna
- Za PostgreSQL: `psql -h 127.0.0.1 -U postgres`

### "Frontend ne učitava"
- Proverite da li je `npm run dev` pokrenuta u `frontend/` direktorijumu
- Proverite `FRONTEND_URL` u `backend/.env`
- Očistite cache: `npm run build`

### "500 Internal Server Error"
- Proverite log: `tail -f backend/storage/logs/laravel.log`
- Regenerirajte cache: `php artisan config:cache` (iz `backend/` direktorijuma)

## Korisni komandi

```bash
# Backend (iz backend/ direktorijuma)
cd backend
php artisan tinker                    # PHP shell
php artisan migrate:fresh --seed      # Reset baze
php artisan cache:clear               # Očisti cache
php artisan config:cache              # Cache konfiguraciju

# Frontend (iz frontend/ direktorijuma)
cd frontend
npm run build                          # Build za produkciju
npm run preview                        # Pregled build-a
npm run dev                            # Development server
```

## Podrška

Za pitanja ili probleme, kontaktirajte: info@pius-academy.com

## Sledeći koraci

1. Pročitajte `README.md` za detaljne informacije
2. Pročitajte `DEPLOYMENT.md` ako postavljate na server
3. Konfigurujte email u `.env` (Mailgun)
4. Promenite admin lozinku nakon prvog logovanja
5. Testirajte registraciju i potpisivanje ugovora
