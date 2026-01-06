# Arhitektura PIUS Academy

## Pregled

PIUS Academy je full-stack aplikacija sa:
- **Backend:** Laravel 12 (PHP)
- **Frontend:** React 18 + TypeScript
- **Baza:** PostgreSQL
- **Autentifikacija:** Laravel Sanctum

## Struktura projekta

```
PIUSupis/
├── backend/                        # Laravel aplikacija
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/Api/    # API kontroleri
│   │   │   │   ├── AuthController.php
│   │   │   │   ├── StudentController.php
│   │   │   │   ├── ContractController.php
│   │   │   │   ├── InvoiceController.php
│   │   │   │   └── ...
│   │   │   └── Requests/           # Form validacija
│   │   │       └── StoreStudentRequest.php
│   │   ├── Models/                 # Eloquent modeli
│   │   │   ├── Student.php
│   │   │   ├── Contract.php
│   │   │   ├── Invoice.php
│   │   │   ├── Payment.php
│   │   │   └── ...
│   │   ├── Mail/                   # Email klase
│   │   └── Providers/              # Service provideri
│   ├── config/                     # Konfiguracija
│   ├── database/
│   │   ├── migrations/             # Migracije
│   │   ├── seeders/                # Seederi
│   │   └── factories/              # Factories za testiranje
│   ├── routes/
│   │   ├── api.php                 # API rute
│   │   └── web.php                 # Web rute
│   ├── storage/                    # Fajlovi i logovi
│   ├── public/                     # Public folder
│   ├── resources/
│   │   └── views/
│   │       └── pdf/                # PDF template-i
│   ├── tests/                      # Testovi
│   ├── .env.example                # Primer .env
│   ├── composer.json               # PHP zavisnosti
│   └── README.md
├── frontend/                       # React aplikacija
│   ├── src/
│   │   ├── components/             # React komponente
│   │   ├── pages/                  # Stranice
│   │   │   ├── RegistrationPage.tsx
│   │   │   ├── ContractPage.tsx
│   │   │   ├── admin/              # Admin stranice
│   │   │   └── ...
│   │   ├── lib/
│   │   │   ├── api.ts              # API klijent
│   │   │   └── pdfGenerator.ts     # PDF generisanje
│   │   ├── types/                  # TypeScript tipovi
│   │   └── App.tsx
│   ├── public/                     # Statički fajlovi
│   ├── package.json                # Node zavisnosti
│   └── README.md
├── README.md                       # Root README
├── DEPLOYMENT.md                   # Instrukcije za server
├── QUICK_START.md                  # Brzi početak
└── ARCHITECTURE.md                 # Ovaj fajl
```

## Tok podataka

### Registracija studenta

```
Frontend (RegistrationPage)
    ↓
    POST /api/students
    ↓
Backend (StudentController@store)
    ↓
    Validacija (StoreStudentRequest)
    ↓
    Kreiranje Student modela
    ↓
    Vraćanje JSON odgovora
    ↓
Frontend (Preusmeri na ContractPage)
```

### Potpisivanje ugovora

```
Frontend (ContractPage)
    ↓
    GET /api/contracts/preview
    ↓
Backend (ContractController@preview)
    ↓
    Učitavanje ContractTemplate
    ↓
    Generisanje sadržaja sa student podacima
    ↓
    Vraćanje template-a
    ↓
Frontend (Prikazuje ugovor, čeka potpis)
    ↓
    POST /api/contracts (sa signature_data)
    ↓
Backend (ContractController@store)
    ↓
    Kreiranje Contract modela
    ↓
    Slanje email-a
    ↓
    Vraćanje JSON odgovora
    ↓
Frontend (Preusmeri na ThankYouPage)
```

## Baza podataka

### Tabele

#### students
```sql
- id (UUID)
- first_name
- last_name
- address
- postal_code
- city
- country
- phone
- email
- id_document_number
- entity_type (individual|company)
- payment_method (full|installments)
- package_type (pius-plus|pius-pro)
- company_name (nullable)
- vat_number (nullable)
- company_address (nullable)
- company_postal_code (nullable)
- company_city (nullable)
- company_country (nullable)
- company_registration (nullable)
- status (enrolled|contract_signed|completed)
- enrolled_at
- timestamps
```

#### contracts
```sql
- id (UUID)
- student_id (FK)
- contract_number
- contract_type (individual|company)
- contract_content (TEXT)
- signature_data (LONGTEXT - base64)
- signed_at
- ip_address
- user_agent
- timestamps
```

#### invoices
```sql
- id (UUID)
- student_id (FK)
- invoice_number
- invoice_date
- payment_date (nullable)
- description
- net_amount
- vat_rate
- vat_amount
- total_amount
- installment_number (nullable)
- status (pending|paid|cancelled)
- notes (nullable)
- timestamps
```

#### payments
```sql
- id (UUID)
- student_id (FK)
- invoice_id (FK, nullable)
- installment_number
- amount
- paid_at (nullable)
- status (pending|paid)
- notes (nullable)
```

#### contract_templates
```sql
- id (UUID)
- template_type (individual|company)
- package_type (pius-plus|pius-pro)
- content (LONGTEXT)
- timestamps
```

## API Endpoints

### Javni (bez autentifikacije)

#### Registracija
```
POST /api/students
Body: {
  first_name, last_name, address, postal_code, city, country,
  phone, email, id_document_number,
  entity_type, payment_method, package_type,
  company_name?, vat_number?, company_address?,
  company_postal_code?, company_city?, company_country?,
  company_registration?
}
Response: { id, ... }
```

#### Pregled ugovora
```
GET /api/contracts/preview?student_id=...
Response: { content: "..." }
```

#### Potpisivanje ugovora
```
POST /api/contracts
Body: {
  student_id,
  signature_data (base64)
}
Response: { id, contract_number, ... }
```

### Zaštićeni (admin)

#### Login
```
POST /api/auth/login
Body: { email, password }
Response: { token, user }
```

#### Studenti
```
GET /api/students
GET /api/students/{id}
PUT /api/students/{id}
DELETE /api/students/{id}
```

#### Ugovori
```
GET /api/contracts
GET /api/contracts/{id}
GET /api/contracts/{id}/pdf
```

#### Fakture
```
GET /api/invoices
POST /api/invoices
PUT /api/invoices/{id}
```

## Frontend komponente

### Javne stranice

- **LandingPage** - Početna stranica
- **RegistrationPage** - Registracija sa 4 koraka
- **ContractPage** - Potpisivanje ugovora
- **ThankYouPage** - Zahvala nakon registracije

### Admin stranice

- **AdminLogin** - Admin prijava
- **AdminDashboard** - Pregled statistike
- **AdminStudents** - Upravljanje studentima
- **AdminContracts** - Upravljanje ugovorima
- **AdminInvoices** - Upravljanje fakturama
- **AdminTemplates** - Upravljanje template-ima
- **AdminPackages** - Upravljanje paketima

## Autentifikacija

### Frontend
- Koristi localStorage za čuvanje tokena
- Automatski dodaje token u Authorization header
- Preusmeri na login ako je token istekao

### Backend
- Koristi Laravel Sanctum
- Generiše API tokene za admin korisnike
- Validira tokene na svakom zaštićenom endpoint-u

## PDF generisanje

### Frontend (jsPDF)
- Koristi se za pregled PDF-a pre nego što se pošalje na server
- Generiše PDF sa student podacima

### Backend (DomPDF)
- Koristi se za finalne PDF-e
- Generiše PDF iz Blade template-a
- Koristi se za fakture i ugovore

## Email

### Korišćeni email-i

1. **ContractSignedNotification** - Obaveštenje adminu kada je ugovor potpisan
2. **ContractToStudent** - Slanje PDF-a studenta nakon potpisivanja
3. **PaymentReminder** - Podsetnik za plaćanje (opciono)

### Konfiguracija

- Koristi Mailgun SMTP
- Konfiguracija u `.env` fajlu
- Koristi Laravel Mail facade

## Sigurnost

### CORS
- Konfigurisan za frontend URL
- Dozvoljava samo specifične domene

### CSRF
- Koristi Laravel CSRF zaštitu
- Automatski se primenjuje na sve POST zahteve

### Validacija
- Backend validacija na svim endpoint-ima
- Frontend validacija sa Yup schema-om
- Type checking sa TypeScript-om

### Autentifikacija
- Sanctum tokeni sa expiration vremenom
- Heširanje lozinki sa bcrypt-om
- Rate limiting na login endpoint-u

## Performanse

### Backend
- Eager loading sa Eloquent
- Database indexing na često korišćenim poljima
- Caching sa Redis (opciono)
- Query optimization

### Frontend
- Code splitting sa Vite
- Lazy loading komponenti
- Memoization sa React.memo
- Optimizacija slika

## Monitoring i logovanje

### Backend
- Laravel log fajlovi u `storage/logs/`
- Različiti log nivoi (debug, info, warning, error)
- Strukturirani logovi sa kontekstom

### Frontend
- Console logovanje u development modu
- Error tracking sa Sentry (opciono)
- Performance monitoring

## Deployment

### Development
- `php artisan serve` za backend
- `npm run dev` za frontend
- Hot reload za oba

### Production
- Nginx kao reverse proxy
- PHP-FPM za backend
- Frontend build sa `npm run build`
- SSL sa Let's Encrypt
- Supervisor za queue workers (opciono)

## Testiranje

### Backend
- PHPUnit za unit testove
- Feature testove za API endpoint-e
- Database testove sa transactions

### Frontend
- Vitest za unit testove
- React Testing Library za komponente
- E2E testove sa Cypress (opciono)

## Budućnost

Mogućnosti za proširenje:
- Integracija sa payment gateway-ima (Stripe, PayPal)
- SMS notifikacije
- Video streaming za kurseve
- Mobilna aplikacija
- Advanced analytics
- Multi-language podrška
