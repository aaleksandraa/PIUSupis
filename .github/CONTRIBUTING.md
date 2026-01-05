# Uputstvo za saradnike

Hvala što ste zainteresovani da doprinesete PIUS Academy projektu!

## Kako početi

1. **Fork** repozitorijum
2. **Clone** vaš fork
3. **Kreirajte granu** za vašu funkcionalnost: `git checkout -b feature/nova-funkcionalnost`
4. **Commit** vaše izmene: `git commit -m "Add nova funkcionalnost"`
5. **Push** na vašu granu: `git push origin feature/nova-funkcionalnost`
6. **Kreirajte Pull Request** na GitHub-u

## Pravila za kod

### Backend (PHP/Laravel)

- Koristite PSR-12 standard
- Dodajte type hints gde je moguće
- Napišite testove za nove funkcionalnosti
- Koristite meaningful nazive za varijable i funkcije

```php
// Dobro
public function getUserById(int $id): ?User
{
    return User::find($id);
}

// Loše
public function getUser($id)
{
    return User::find($id);
}
```

### Frontend (React/TypeScript)

- Koristite TypeScript za type safety
- Komponente trebaju biti functional components sa hooks
- Koristite meaningful nazive
- Dodajte JSDoc komentare za kompleksne funkcije

```typescript
// Dobro
interface StudentFormProps {
  onSubmit: (data: FormData) => Promise<void>;
  isLoading?: boolean;
}

const StudentForm: React.FC<StudentFormProps> = ({ onSubmit, isLoading }) => {
  // ...
};

// Loše
const StudentForm = ({ onSubmit, isLoading }) => {
  // ...
};
```

## Commit poruke

Koristite jasne i deskriptivne commit poruke:

```
# Dobro
git commit -m "Add postal code field to student registration"
git commit -m "Fix: Resolve database connection timeout issue"
git commit -m "Refactor: Simplify contract template generation"

# Loše
git commit -m "Update"
git commit -m "Fix bug"
git commit -m "Changes"
```

## Pull Request proces

1. **Ažurirajte main granu** pre nego što kreirate PR
2. **Testirajte** vašu funkcionalnost lokalno
3. **Napišite dobar opis** PR-a sa:
   - Šta se menja
   - Zašto se menja
   - Kako testirati
4. **Linkujte relevantne issue-e** ako postoje
5. **Čekajte review** od maintainer-a

## Testiranje

### Backend

```bash
# Pokrenite testove
php artisan test

# Sa coverage
php artisan test --coverage
```

### Frontend

```bash
# Pokrenite testove (ako postoje)
npm run test

# Sa coverage
npm run test:coverage
```

## Dokumentacija

- Ažurirajte `README.md` ako dodajete nove funkcionalnosti
- Dodajte komentare za kompleksnu logiku
- Ažurirajte `DEPLOYMENT.md` ako se menja deployment proces

## Sigurnost

- **Nikada** ne commit-ujte `.env` fajlove
- Koristite environment varijable za sensitive podatke
- Validujte sve user input-e
- Koristite prepared statements za SQL upite
- Dodajte CSRF zaštitu gde je potrebna

## Performanse

- Optimizujte database upite (koristite eager loading)
- Minimizujte frontend bundle size
- Koristite caching gde je moguće
- Testirajte sa realističnim podacima

## Stil koda

### PHP

```php
// Indentacija - 4 razmaka
public function example()
{
    if ($condition) {
        // kod
    }
}

// Naming convention
$variableName = 'value';
const CONSTANT_NAME = 'value';
public function methodName() {}
class ClassName {}
```

### TypeScript/React

```typescript
// Indentacija - 2 razmaka
const example = () => {
  if (condition) {
    // kod
  }
};

// Naming convention
const variableName = 'value';
const CONSTANT_NAME = 'value';
const functionName = () => {};
interface InterfaceName {}
type TypeName = {};
```

## Problemi i sugestije

- Koristite GitHub Issues za bug reports
- Koristite Discussions za sugestije i pitanja
- Budite ljubazni i konstruktivni u komunikaciji

## Licenca

Doprinošenjem ovom projektu, slažete se da će vaš kod biti pod istom licencom kao i projekat.

## Kontakt

Za pitanja, kontaktirajte: info@pius-academy.com

Hvala na vašoj saradnji! 🎉
