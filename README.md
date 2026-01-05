# PIUS Academy - Laravel Backend

Sistem za registraciju studenata na online kurseve sa digitalnim potpisivanjem ugovora.

## Tehnologije

- **Backend:** Laravel 12
- **Frontend:** React 18 + Vite + TailwindCSS
- **Baza:** PostgreSQL (preporučeno) ili MySQL
- **Auth:** Laravel Sanctum
- **PDF:** DomPDF

## Instalacija

### 1. Backend (Laravel)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

### 2. Konfiguracija baze

Uredite `.env` fajl:

```env
# PostgreSQL (preporučeno)
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=pius_academy
DB_USERNAME=postgres
DB_PASSWORD=your_password

# Ili MySQL
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=pius_academy
DB_USERNAME=root
DB_PASSWORD=your_password
```

### 3. Migracije

```bash
php artisan migrate
```

### 4. Frontend

```bash
cd frontend
npm install
```

## Pokretanje

### Development

```bash
# Terminal 1 - Backend
cd backend
php artisan serve

# Terminal 2 - Frontend
cd backend/frontend
npm run dev
```

- Backend: http://localhost:8000
- Frontend: http://localhost:5173

### Admin pristup

- URL: http://localhost:5173/?admin=true
- Email: info@pius-academy.com
- Password: aleksandra2025!

## API Endpoints

### Javni (bez autentifikacije)

- `POST /api/auth/login` - Admin prijava
- `POST /api/students` - Registracija studenta
- `POST /api/contracts` - Potpisivanje ugovora
- `POST /api/contracts/preview` - Pregled ugovora

### Zaštićeni (admin)

- `GET /api/dashboard/stats` - Statistike
- `GET /api/students` - Lista studenata
- `GET /api/contracts` - Lista ugovora
- `GET /api/contracts/{id}/pdf` - Download PDF
- `GET /api/contract-templates` - Template ugovora
- `PUT /api/contract-templates/{id}` - Ažuriranje template-a

## Struktura baze

- `admin_users` - Administratori
- `students` - Studenti
- `contracts` - Potpisani ugovori
- `contract_templates` - Šabloni ugovora (4 kombinacije)

## Paketi

- **PIUS PLUS:** 1.800€ (400€ + 500€ + 900€)
- **PIUS PRO:** 2.500€ (500€ + 1.000€ + 1.000€) + oprema
