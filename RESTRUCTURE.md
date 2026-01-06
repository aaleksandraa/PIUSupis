# Razdvajanje Frontend i Backend foldera

## Trenutna struktura

```
PIUSupis/
├── app/                    # Laravel kod
├── config/                 # Laravel konfiguracija
├── database/               # Migracije
├── frontend/               # React aplikacija (ugniježđena)
├── routes/                 # API rute
├── storage/                # Fajlovi
├── .env
├── composer.json
└── README.md
```

## Nova struktura

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
├── README.md               # Root README
└── SETUP.md                # Instrukcije za setup
```

## Koraci za razdvajanje

### 1. Kreirajte backend folder i prebacite Laravel fajlove

```bash
# Kreirajte backend folder
mkdir backend

# Prebacite Laravel fajlove
mv app backend/
mv bootstrap backend/
mv config backend/
mv database backend/
mv public backend/
mv resources backend/
mv routes backend/
mv storage backend/
mv tests backend/
mv vendor backend/
mv .env backend/
mv .env.example backend/
mv .env.production.example backend/
mv .editorconfig backend/
mv artisan backend/
mv composer.json backend/
mv composer.lock backend/
mv phpunit.xml backend/
mv vite.config.js backend/
mv package.json backend/
```

### 2. Prebacite frontend folder

```bash
# Frontend je već u backend/frontend, trebate ga prebaciti na root
mv backend/frontend ./
```

### 3. Kreirajte root README

Kreirajte novi README.md na root nivou koji objašnjava strukturu.

### 4. Ažurirajte .gitignore

Ažurirajte .gitignore fajlove u svakom direktorijumu.

### 5. Ažurirajte dokumentaciju

- Ažurirajte DEPLOYMENT.md
- Ažurirajte QUICK_START.md
- Ažurirajte ARCHITECTURE.md

### 6. Git commit

```bash
git add .
git commit -m "Refactor: Separate backend and frontend into distinct folders"
git push origin main
```

## Alternativa: Korišćenje Git filter-branch

Ako želite da čuvate Git istoriju, možete koristiti `git filter-branch`:

```bash
# Kreirajte backend granu sa samo Laravel fajlovima
git filter-branch --subdirectory-filter . -- --all

# Kreirajte frontend granu sa samo React fajlovima
git filter-branch --subdirectory-filter frontend -- --all
```

## Napomena

Preporuka je da prvo kreirate novu granu za ovo:

```bash
git checkout -b refactor/separate-frontend-backend
# Uradite razdvajanje
git push origin refactor/separate-frontend-backend
# Kreirajte Pull Request na GitHub-u
```

Nakon što je Pull Request merge-ovan, možete obrisati granu.
