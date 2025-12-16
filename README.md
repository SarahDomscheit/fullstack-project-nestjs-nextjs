# Fullstack Project: NestJS + Next.js Shop

Ein modernes Fullstack-E-Commerce-Projekt mit NestJS (Backend) und Next.js (Frontend).

## 🎯 Überblick

Ein minimalistischer Online-Shop mit Benutzerauthentifizierung, Produktverwaltung und CRUD-Operationen. Benutzer können sich registrieren, einloggen und ihre eigenen Produkte verwalten.

## ✨ Features

### Authentifizierung

- ✅ Benutzerregistrierung mit Passwort-Hashing (bcrypt)
- ✅ Login mit JWT-Token
- ✅ Geschützte Routen mit Guards
- ✅ Persistente Sessions (localStorage)

### Produktverwaltung

- ✅ Produkte erstellen (nur eingeloggte Benutzer)
- ✅ Alle Produkte anzeigen (öffentlich)
- ✅ Eigene Produkte bearbeiten
- ✅ Eigene Produkte löschen
- ✅ Owner-basierte Zugriffskontrolle

### Benutzerverwaltung

- ✅ Profil anzeigen
- ✅ Profil bearbeiten (Name, Email, Passwort)
- ✅ Logout-Funktionalität

## 🛠 Tech Stack

### Backend (NestJS)

- **Framework:** NestJS 10.x
- **Datenbank:** PostgreSQL mit TypeORM
- **Authentifizierung:** Passport.js + JWT
- **Validierung:** class-validator, class-transformer
- **Password-Hashing:** bcrypt
- **Container:** Docker

### Frontend (Next.js)

- **Framework:** Next.js 15.x (App Router)
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **TypeScript:** Vollständig typisiert
- **Persistenz:** localStorage (zustand/persist)

## 📁 Projektstruktur

```
fullstack-project-nestjs-nextjs/
├── backend/                    # NestJS Backend
│   ├── src/
│   │   ├── auth/              # Authentifizierung (JWT, Guards, Strategies)
│   │   ├── customers/         # Benutzerverwaltung
│   │   ├── products/          # Produktverwaltung
│   │   ├── orders/            # Bestellungen (TODO)
│   │   └── main.ts            # Einstiegspunkt
│   ├── test/                  # E2E Tests
│   ├── Dockerfile
│   └── package.json
│
├── frontend/                   # Next.js Frontend
│   ├── app/
│   │   ├── components/        # Wiederverwendbare Komponenten
│   │   ├── lib/               # API-Helfer (apiFetch)
│   │   ├── stores/            # Zustand Stores
│   │   ├── customers/         # Profilseite
│   │   ├── login/             # Login-Seite
│   │   ├── register/          # Registrierungsseite
│   │   ├── products/          # Produktseiten
│   │   └── page.tsx           # Homepage
│   └── package.json
│
├── docker-compose.yml          # Docker Compose Konfiguration
└── README.md
```

## 📡 API-Endpunkte

### Authentifizierung

| Methode | Endpoint         | Beschreibung                | Auth |
| ------- | ---------------- | --------------------------- | ---- |
| POST    | `/auth/register` | Neuen Benutzer registrieren | ❌   |
| POST    | `/auth/login`    | Benutzer einloggen          | ❌   |

**Register Request:**

```json
{
  "name": "Max Mustermann",
  "email": "max@example.com",
  "password": "password123"
}
```

**Login Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "name": "Max Mustermann",
    "email": "max@example.com"
  }
}
```

### Produkte

| Methode | Endpoint        | Beschreibung                 | Auth |
| ------- | --------------- | ---------------------------- | ---- |
| GET     | `/products`     | Alle Produkte abrufen        | ❌   |
| GET     | `/products/:id` | Einzelnes Produkt abrufen    | ✅   |
| POST    | `/products`     | Neues Produkt erstellen      | ✅   |
| PATCH   | `/products/:id` | Produkt aktualisieren        | ✅   |
| DELETE  | `/products/:id` | Produkt löschen (nur eigene) | ✅   |

**Produkt erstellen:**

```json
{
  "name": "MacBook Pro",
  "description": "Apple Laptop",
  "price": 2499.99
}
```

### Benutzer

| Methode | Endpoint         | Beschreibung             | Auth |
| ------- | ---------------- | ------------------------ | ---- |
| GET     | `/customers`     | Alle Benutzer abrufen    | ✅   |
| GET     | `/customers/:id` | Benutzer-Details abrufen | ✅   |
| PATCH   | `/customers/:id` | Profil aktualisieren     | ✅   |
| DELETE  | `/customers/:id` | Benutzer löschen         | ✅   |

### Nur Backend

```bash
docker compose up backend db
```

## 🔐 Sicherheit

- **Passwörter:** Werden mit bcrypt gehashed (Salt rounds: 10)
- **JWT:** Tokens laufen nach 6 Stunden ab
- **Guards:** JwtAuthGuard schützt alle sensiblen Routen
- **Validation:** class-validator prüft alle Eingaben
- **CORS:** Aktiviert für Frontend-Zugriff
- **Owner-Check:** Benutzer können nur eigene Ressourcen ändern/löschen

## 📝 Verwendete Patterns

### Backend

- **Repository Pattern:** TypeORM Repositories
- **DTO Pattern:** Data Transfer Objects für Validierung
- **Guard Pattern:** JWT und Local Auth Guards
- **Strategy Pattern:** Passport Strategies (JWT, Local)
- **Service Layer:** Business-Logik in Services
- **Dependency Injection:** NestJS DI Container

### Frontend

- **Custom Hooks:** useAuthStore
- **Component Composition:** Wiederverwendbare Komponenten
- **API Wrapper:** apiFetch für authentifizierte Requests
- **State Management:** Zustand mit Persist Middleware

## 🐛 Bekannte Probleme

- [ ] Orders-Modul ist noch nicht implementiert
- [ ] Keine Paginierung bei Produktlisten
- [ ] Keine Bildupload-Funktionalität
- [ ] Keine Suche/Filter für Produkte
