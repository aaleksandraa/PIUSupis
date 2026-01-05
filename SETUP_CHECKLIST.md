# Checklist za postavljanje PIUS Academy

## Lokalni razvoj

- [ ] Kloniran repozitorijum
- [ ] Instaliran Composer
- [ ] Instaliran Node.js i npm
- [ ] Instalirana baza podataka (PostgreSQL ili MySQL)
- [ ] Pokrenuta `composer install`
- [ ] Kopiran `.env.example` u `.env`
- [ ] Generisan `APP_KEY` sa `php artisan key:generate`
- [ ] Konfigurirana baza u `.env`
- [ ] Pokrenute migracije sa `php artisan migrate`
- [ ] Pokrenuti seederi sa `php artisan db:seed`
- [ ] Instaliran frontend sa `cd frontend && npm install`
- [ ] Pokrenuta `php artisan serve`
- [ ] Pokrenuta `npm run dev` u frontend direktorijumu
- [ ] Pristupljeno http://localhost:5173
- [ ] Testirana registracija
- [ ] Testiran admin pristup sa `?admin=true`

## Pre nego što se ide na server

- [ ] Svi testovi prolaze
- [ ] Nema console grešaka
- [ ] Nema PHP warning-a
- [ ] Nema TypeScript grešaka
- [ ] Konfiguracija je sigurna (nema hardkodovanih lozinki)
- [ ] `.env` fajl je u `.gitignore`
- [ ] Svi commit-i su push-ovani na GitHub
- [ ] README.md je ažuriran
- [ ] DEPLOYMENT.md je pročitan

## Server - Priprema

- [ ] Registrovan domen
- [ ] Pronađen hosting provider
- [ ] SSH pristup je konfiguriran
- [ ] Firewall je konfiguriran
- [ ] Backup plan je napravljen

## Server - Instalacija

- [ ] Instaliran PHP 8.2+
- [ ] Instaliran Composer
- [ ] Instaliran Node.js i npm
- [ ] Instalirana PostgreSQL (ili MySQL)
- [ ] Instaliran Nginx
- [ ] Instaliran Certbot za SSL

## Server - Setup

- [ ] Kloniran repozitorijum u `/var/www/pius-academy`
- [ ] Pokrenuta `composer install --no-dev`
- [ ] Kopiran `.env.example` u `.env`
- [ ] Konfiguriran `.env` sa server vrednostima
- [ ] Generisan `APP_KEY`
- [ ] Kreirana baza podataka
- [ ] Pokrenute migracije sa `--force` flagom
- [ ] Pokrenuti seederi
- [ ] Pokrenuta `npm install --production` u frontend direktorijumu
- [ ] Pokrenuta `npm run build` u frontend direktorijumu
- [ ] Postavljene dozvole za fajlove (755 za app, 775 za storage)
- [ ] Konfiguriran Nginx
- [ ] Instaliran SSL certifikat
- [ ] Testiran HTTPS pristup

## Server - Email

- [ ] Registrovan Mailgun nalog (ili drugi SMTP provider)
- [ ] Konfiguriran MAIL_* u `.env`
- [ ] Testiran email sa `php artisan tinker`
- [ ] Testirana registracija sa email notifikacijom

## Server - Monitoring

- [ ] Postavljen cron job za Laravel scheduler
- [ ] Postavljen Supervisor za queue workers (ako se koristi)
- [ ] Konfiguriran log rotation
- [ ] Postavljen monitoring za disk space
- [ ] Postavljen monitoring za CPU/RAM

## Server - Sigurnost

- [ ] Promenjena admin lozinka
- [ ] Konfiguriran firewall
- [ ] Instaliran fail2ban
- [ ] Postavljen rate limiting
- [ ] Konfiguriran CORS
- [ ] Testirane CSRF zaštite
- [ ] Testirane SQL injection zaštite
- [ ] Testirane XSS zaštite

## Server - Backup

- [ ] Postavljena backup skripta
- [ ] Testiran backup proces
- [ ] Postavljen cron job za automatske backupe
- [ ] Testirano vraćanje iz backup-a

## Produkcija - Testiranje

- [ ] Testirana registracija
- [ ] Testiran login
- [ ] Testiran ugovor i potpisivanje
- [ ] Testirana faktura
- [ ] Testiran email
- [ ] Testiran PDF download
- [ ] Testiran admin panel
- [ ] Testirana mobilna verzija
- [ ] Testirana brzina učitavanja
- [ ] Testirana sigurnost

## Produkcija - Lansiranje

- [ ] Obavešten tim o lansiranju
- [ ] Obavešten klijent o lansiranju
- [ ] Postavljen monitoring
- [ ] Postavljen error tracking (Sentry)
- [ ] Postavljen analytics (Google Analytics)
- [ ] Postavljen uptime monitoring
- [ ] Dokumentovani admin kredencijali (sigurno)
- [ ] Dokumentovani server kredencijali (sigurno)

## Post-lansiranje

- [ ] Proveravani logovi za greške
- [ ] Proveravane performanse
- [ ] Proveravana sigurnost
- [ ] Proveravana dostupnost
- [ ] Proveravani email-i
- [ ] Proveravane fakture
- [ ] Proveravani ugovori
- [ ] Proveravani PDF-i

## Redovna održavanja

- [ ] Redovne backup-e
- [ ] Redovne sigurnosne ažuriranja
- [ ] Redovne ažuriracije zavisnosti
- [ ] Redovne proverke logova
- [ ] Redovne proverke performansi
- [ ] Redovne proverke sigurnosti

## Dokumentacija

- [ ] README.md je ažuriran
- [ ] DEPLOYMENT.md je ažuriran
- [ ] ARCHITECTURE.md je ažuriran
- [ ] API dokumentacija je dostupna
- [ ] Admin uputstvo je dostupno
- [ ] Troubleshooting guide je dostupan

## Kontakt i podrška

- [ ] Postavljen support email
- [ ] Postavljen support telefon
- [ ] Postavljen support chat (opciono)
- [ ] Postavljen FAQ
- [ ] Postavljen bug report proces

---

## Napomene

Popunite ovu listu dok postavljate projekat. Ako nešto nije jasno, pogledajte:
- `README.md` - Detaljne instrukcije
- `DEPLOYMENT.md` - Server instrukcije
- `QUICK_START.md` - Brzi početak
- `ARCHITECTURE.md` - Arhitektura projekta

## Kontakt

Za pitanja: info@pius-academy.com
