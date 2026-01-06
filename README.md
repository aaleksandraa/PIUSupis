# PIUS Academy - Sistem za registraciju studenata

Kompletan sistem za registraciju studenata na online kurseve sa digitalnim potpisivanjem ugovora, upravljanjem fakturama i plaćanjima.

## Struktura projekta

```
PIUSupis/
├── backend/                # Laravel aplikacija (PHP)
│   ├── app/
│   ├── config/
│   ├── database/
│   ├── routes/
│   ├── storage/
│   ├── public/
│   ├── .env
│   ├── composer.json
│   └── README.md
├── frontend/               # React aplikacija (TypeScript)
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── README.md
├── .github/
│   ├── workflows/          # CI/CD pipeline
│   └── CONTRIBUTING.md     # Uputstvo za saradnike
├── README.md               # Ovaj fajl
├── QUICK_START.md          # Brzi početak
├── DEPLOYMENT.md           # Instrukcije za server
├── ARCHITECTURE.md         # Arhitektura projekta
└── SETUP_CHECKLIST.md      # Checklist za postavljanje
```

## Brzi početak

### Development

```bash
# Backend
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed --class=ContractTemplateSeeder
php artisan serve

# Frontend (u novom terminalu)
cd frontend
npm install
npm run dev
```

- Backend: http://localhost:8000
- Frontend: http://localhost:5173

### Production

Detaljne instrukcije su u `DEPLOYMENT.md` fajlu.

## Tehnologije

- **Backend:** Laravel 12 (PHP 8.2+)
- **Frontend:** React 18 + TypeScript + Vite
- **Baza:** PostgreSQL (preporučeno) ili MySQL
- **Auth:** Laravel Sanctum
- **PDF:** DomPDF
- **Styling:** TailwindCSS

## Dokumentacija

- **README.md** - Detaljne instrukcije
- **QUICK_START.md** - Brzi početak
- **DEPLOYMENT.md** - Server instrukcije
- **ARCHITECTURE.md** - Arhitektura i struktura
- **SETUP_CHECKLIST.md** - Checklist za postavljanje
- **.github/CONTRIBUTING.md** - Uputstvo za saradnike

## Admin pristup

- URL: `http://localhost:5173/?admin=true` (development)
- Email: `info@pius-academy.com`
- Password: `aleksandra2025!`

## Paketi

- **PIUS PLUS:** 1.800€ (60 dana edukacije)
- **PIUS PRO:** 2.500€ (60 dana + startni paket)

## Podrška

Za pitanja ili probleme, kontaktirajte: info@pius-academy.com

## Licenca

Privatni projekat - Sva prava zadržana
