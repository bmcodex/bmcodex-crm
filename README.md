# 🚗 BMCODEX CRM — System Zarządzania Zleceniami i Klientami BMW

Profesjonalny system CRM dedykowany dla warsztatów specjalizujących się w tuningowaniu, diagnostyce i modyfikacjach pojazdów BMW. BMCODEX CRM to nowoczesna aplikacja webowa z interfejsem w stylu **Liquid Glass**, umożliwiająca pełne zarządzanie klientami, zleceniami, plikami ECU i statystykami.

---

## 📋 Spis treści

- [Cechy](#cechy)
- [Zrzut ekranu](#zrzut-ekranu-interfejsu)
- [Wymagania systemowe](#wymagania-systemowe)
- [Instalacja](#instalacja)
- [Konfiguracja](#konfiguracja)
- [Użytkowanie](#użytkowanie)
- [Struktura projektu](#struktura-projektu)
- [API (tRPC)](#api-trpc)
- [Baza danych](#baza-danych)
- [Bezpieczeństwo](#bezpieczeństwo)
- [Troubleshooting](#troubleshooting)
- [Licencja](#licencja)

---

## ✨ Cechy

### 🎯 Moduł Klienci
- ✅ Pełny CRUD (Create, Read, Update, Delete)
- ✅ Wyszukiwanie zaawansowane (po nazwisku, telefonie, VIN)
- ✅ Zarządzanie statusem lojalności (aktywny, okresowy, nieaktywny)
- ✅ Historia zmian dla każdego klienta
- ✅ Przechowywanie danych pojazdu (VIN, model, rok)

### 📋 Moduł Zlecenia
- ✅ Tworzenie i edycja zleceń
- ✅ Zarządzanie statusami (nowe, w trakcie, oczekujące, ukończone, anulowane)
- ✅ Śledzenie statusu płatności (oczekująca, zapłacona, przeterminowana)
- ✅ Automatyczny kalkulator kosztów (koszt bazowy + marża + VAT)
- ✅ Autozapis zmian
- ✅ Historia zmian i komentarze

### 📊 Dashboard i Statystyki
- ✅ Pulpit główny z kluczowymi wskaźnikami (KPI)
- ✅ Wykresy przychodów
- ✅ Top 5 klientów
- ✅ Ostatnie zlecenia
- ✅ Statystyki w czasie rzeczywistym

### 📁 Moduł Pliki
- ✅ Upload plików ECU (original, modified)
- ✅ Przechowywanie w chmurze (S3)
- ✅ Weryfikacja sum kontrolnych (SHA256)
- ✅ Pobieranie i zarządzanie plikami
- ✅ Historia zmian plików

### ⚙️ Ustawienia
- ✅ Konfiguracja danych warsztatu
- ✅ Ustawienia finansowe (domyślna marża, VAT)
- ✅ Zarządzanie kopią zapasową
- ✅ Tryb ciemny/jasny
- ✅ Preferencje użytkownika

### 🔐 Bezpieczeństwo
- ✅ Autentykacja OAuth (Manus)
- ✅ Kontrola dostępu oparta na rolach (RBAC)
- ✅ Szyfrowanie sesji
- ✅ Bezpieczne przechowywanie haseł
- ✅ Audyt działań użytkowników

---

## 🖼️ Zrzut ekranu interfejsu

### Dashboard - Pulpit główny z KPI i statystykami

![BMCODEX CRM Dashboard](./docs/dashboard-screenshot.png)

**Widoczne elementy:**
- **Sidebar nawigacyjny** z menu (Klienci, Zlecenia, Pliki, Statystyki, Ustawienia)
- **KPI Cards** - Razem zleceń, Ukończone, Oczekujące płatności, Przychód, Aktywni klienci
- **Top 5 Klientów** - Lista najważniejszych klientów
- **Ostatnie Zlecenia** - Tabela z ostatnimi zleceniami
- **Interfejs Liquid Glass** - Przezroczyste karty z efektami blur i gradientów
- **Ciemny motyw** - Nowoczesny, przyjazny dla oczu design

---

## 🖥️ Wymagania systemowe

### Minimum
- **Node.js**: 18.x lub wyżej
- **npm/pnpm**: 8.x lub wyżej
- **Baza danych**: MySQL 8.0+ lub TiDB
- **Pamięć RAM**: 2 GB
- **Przestrzeń dyskowa**: 500 MB

### Rekomendowane
- **Node.js**: 20.x LTS
- **Baza danych**: MySQL 8.0.32+
- **Pamięć RAM**: 4 GB
- **Przestrzeń dyskowa**: 2 GB
- **CPU**: 2 rdzenie

---

## 📦 Instalacja

### 1. Klonowanie repozytorium

```bash
git clone https://github.com/bmcodex/bmcodex-crm.git
cd bmcodex-crm
```

### 2. Instalacja zależności

```bash
pnpm install
# lub
npm install
```

### 3. Konfiguracja zmiennych środowiskowych

Utwórz plik `.env.local` w głównym katalogu projektu:

```env
# Baza danych
DATABASE_URL=mysql://user:password@localhost:3306/bmcodex_crm

# Autentykacja
JWT_SECRET=your-secret-key-here
VITE_APP_ID=your-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im

# Właściciel
OWNER_OPEN_ID=your-open-id
OWNER_NAME=Your Name

# Aplikacja
VITE_APP_TITLE=BMCODEX CRM
VITE_APP_LOGO=https://your-logo-url.png

# API
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=your-api-key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=your-frontend-key

# Analityka
VITE_ANALYTICS_ENDPOINT=https://analytics.manus.im
VITE_ANALYTICS_WEBSITE_ID=your-website-id
```

### 4. Migracja bazy danych

```bash
pnpm db:push
```

### 5. Uruchomienie aplikacji

```bash
# Tryb deweloperski
pnpm dev

# Produkcja
pnpm build
pnpm start
```

Aplikacja będzie dostępna pod adresem: **http://localhost:3000**

---

## ⚙️ Konfiguracja

### Zmienne środowiskowe

| Zmienna | Opis | Wymagana |
|---------|------|----------|
| `DATABASE_URL` | Połączenie do bazy danych | ✅ |
| `JWT_SECRET` | Klucz tajny dla sesji | ✅ |
| `VITE_APP_ID` | ID aplikacji OAuth | ✅ |
| `OWNER_OPEN_ID` | OpenID właściciela | ✅ |
| `VITE_APP_TITLE` | Nazwa aplikacji | ✅ |
| `VITE_APP_LOGO` | URL logo aplikacji | ❌ |

### Baza danych

Projekt używa **Drizzle ORM** z MySQL. Schemat bazy danych znajduje się w:

```
drizzle/schema.ts
```

Tabele:
- `users` — Użytkownicy i role
- `clients` — Klienci i dane pojazdów
- `orders` — Zlecenia i statusy
- `order_timeline` — Historia zmian zleceń
- `files` — Pliki ECU
- `payments` — Płatności

---

## 📖 Użytkowanie

### Logowanie

1. Otwórz aplikację: **http://localhost:3000**
2. Kliknij przycisk "Zaloguj się"
3. Uwierzytelnij się za pomocą konta Manus OAuth
4. Po zalogowaniu zostaniesz przekierowany do Dashboard

### Dodawanie klienta

1. Przejdź do **Klienci** → **Nowy klient**
2. Wypełnij formularz:
   - Imię i nazwisko (wymagane)
   - Telefon (wymagane)
   - Email (opcjonalnie)
   - VIN pojazdu (opcjonalnie)
   - Model pojazdu (opcjonalnie)
3. Kliknij **Dodaj klienta**

### Tworzenie zlecenia

1. Przejdź do **Zlecenia** → **Nowe zlecenie**
2. Wybierz klienta z listy
3. Wpisz tytuł i opis zlecenia
4. Ustaw koszt bazowy, marżę i VAT
5. System automatycznie obliczy koszt całkowity
6. Kliknij **Dodaj zlecenie**

### Zarządzanie plikami ECU

1. Otwórz zlecenie
2. Przejdź do sekcji **Pliki**
3. Kliknij **Dodaj plik** i wybierz typ (original/modified)
4. Plik zostanie wgrany do S3 i zweryfikowany
5. Możesz pobrać lub usunąć plik

### Śledzenie statystyk

1. Przejdź do **Dashboard**
2. Przeglądaj kluczowe wskaźniki:
   - Razem zleceń
   - Ukończone zlecenia
   - Oczekujące płatności
   - Przychód
   - Aktywni klienci

---

## 📁 Struktura projektu

```
bmcodex-crm/
├── client/                    # Frontend (React 19 + Tailwind 4)
│   ├── src/
│   │   ├── components/        # Komponenty React
│   │   │   ├── CRMLayout.tsx  # Layout główny
│   │   │   └── ...
│   │   ├── pages/             # Strony aplikacji
│   │   │   ├── Dashboard.tsx  # Pulpit główny
│   │   │   ├── Clients.tsx    # Zarządzanie klientami
│   │   │   ├── Orders.tsx     # Zarządzanie zleceniami
│   │   │   ├── Settings.tsx   # Ustawienia
│   │   │   └── ...
│   │   ├── lib/
│   │   │   └── trpc.ts        # Klient tRPC
│   │   ├── contexts/          # React Contexts
│   │   ├── App.tsx            # Routing główny
│   │   ├── main.tsx           # Entry point
│   │   └── index.css          # Style globalne (Liquid Glass)
│   └── public/                # Zasoby statyczne
│
├── server/                    # Backend (Express + tRPC)
│   ├── routers/               # Procedury tRPC
│   │   ├── clients.ts         # API klientów
│   │   ├── orders.ts          # API zleceń
│   │   ├── files.ts           # API plików
│   │   ├── dashboard.ts       # API statystyk
│   │   └── ...
│   ├── db.ts                  # Helpery bazy danych
│   ├── routers.ts             # Główny router tRPC
│   ├── storage.ts             # Integracja S3
│   └── _core/                 # Infrastruktura frameworku
│
├── drizzle/                   # ORM i migracje
│   ├── schema.ts              # Definicja tabel
│   └── migrations/            # Historia zmian
│
├── shared/                    # Kod wspólny
│   └── const.ts               # Stałe aplikacji
│
└── README.md                  # Dokumentacja
```

---

## 🔌 API (tRPC)

### Procedury dostępne

#### Klienci
```typescript
// Lista klientów
trpc.clients.list.useQuery({ search?: string, loyaltyStatus?: string })

// Szczegóły klienta
trpc.clients.getById.useQuery({ id: number })

// Dodaj klienta
trpc.clients.create.useMutation({ firstName, lastName, email, phone, ... })

// Aktualizuj klienta
trpc.clients.update.useMutation({ id, firstName, lastName, ... })
```

#### Zlecenia
```typescript
// Lista zleceń
trpc.orders.list.useQuery({ clientId?, status?, paymentStatus? })

// Szczegóły zlecenia
trpc.orders.getById.useQuery({ id: number })

// Dodaj zlecenie
trpc.orders.create.useMutation({ clientId, title, baseCost, margin, taxRate, ... })

// Aktualizuj zlecenie
trpc.orders.update.useMutation({ id, title, status, paymentStatus, ... })

// Dodaj zdarzenie w historii
trpc.orders.addTimelineEvent.useMutation({ orderId, eventType, comment })

// Historia zleceń
trpc.orders.getTimeline.useQuery({ orderId })
```

#### Dashboard
```typescript
// Statystyki główne
trpc.dashboard.stats.useQuery()

// Wykres przychodów
trpc.dashboard.revenueChart.useQuery({ days: 30 })

// Top klienci
trpc.dashboard.topClients.useQuery({ limit: 5 })

// Ostatnie zlecenia
trpc.dashboard.recentOrders.useQuery({ limit: 10 })
```

#### Pliki
```typescript
// Pliki zlecenia
trpc.files.getByOrderId.useQuery({ orderId })

// Szczegóły pliku
trpc.files.getById.useQuery({ id })

// Upload pliku
trpc.files.upload.useMutation({ orderId, fileName, fileType, fileData, fileSize })

// Usuń plik
trpc.files.delete.useMutation({ id })
```

---

## 💾 Baza danych

### Schemat

#### Tabela: `users`
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  openId VARCHAR(64) UNIQUE NOT NULL,
  name TEXT,
  email VARCHAR(320),
  loginMethod VARCHAR(64),
  role ENUM('user', 'admin') DEFAULT 'user',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  lastSignedIn TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Tabela: `clients`
```sql
CREATE TABLE clients (
  id INT PRIMARY KEY AUTO_INCREMENT,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  email VARCHAR(320),
  phone VARCHAR(20) NOT NULL,
  vin VARCHAR(17),
  vehicleModel VARCHAR(100),
  vehicleYear INT,
  loyaltyStatus ENUM('active', 'periodic', 'inactive') DEFAULT 'active',
  notes TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Tabela: `orders`
```sql
CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  clientId INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('new', 'in_progress', 'waiting', 'completed', 'cancelled') DEFAULT 'new',
  serviceType VARCHAR(100),
  baseCost VARCHAR(20),
  margin VARCHAR(20),
  taxRate VARCHAR(20),
  totalCost VARCHAR(20),
  paymentStatus ENUM('pending', 'paid', 'overdue') DEFAULT 'pending',
  startDate TIMESTAMP,
  completionDate TIMESTAMP,
  internalNotes TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (clientId) REFERENCES clients(id)
);
```

#### Tabela: `files`
```sql
CREATE TABLE files (
  id INT PRIMARY KEY AUTO_INCREMENT,
  orderId INT NOT NULL,
  fileName VARCHAR(255) NOT NULL,
  fileType ENUM('original', 'modified') NOT NULL,
  fileKey VARCHAR(500),
  fileUrl VARCHAR(500),
  fileSize INT,
  checksum VARCHAR(64),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (orderId) REFERENCES orders(id)
);
```

---

## 🔐 Bezpieczeństwo

### Autentykacja
- Aplikacja używa **OAuth 2.0** (Manus)
- Sesje przechowywane w **JWT**
- Ciasteczka sesji są **HttpOnly** i **Secure**

### Autoryzacja
- Kontrola dostępu oparta na rolach (RBAC)
- Dwie role: `user` i `admin`
- Procedury chronione za pomocą `protectedProcedure`

### Przechowywanie danych
- Hasła nie są przechowywane (OAuth)
- Dane wrażliwe szyfrowane
- Pliki przechowywane w S3 z kontrolą dostępu

### Best Practices
- Nigdy nie commituj `.env` plików
- Regularnie aktualizuj zależności
- Używaj HTTPS w produkcji
- Włącz 2FA dla kont administratora

---

## 🐛 Troubleshooting

### Problem: Błąd połączenia z bazą danych

**Rozwiązanie:**
```bash
# Sprawdź zmienną DATABASE_URL
echo $DATABASE_URL

# Testuj połączenie
mysql -h localhost -u user -p -D bmcodex_crm
```

### Problem: Błąd autentykacji OAuth

**Rozwiązanie:**
1. Sprawdź `VITE_APP_ID` i `OAUTH_SERVER_URL`
2. Upewnij się, że aplikacja jest zarejestrowana w Manus
3. Sprawdź logi w przeglądarce (F12)

### Problem: Aplikacja się nie ładuje

**Rozwiązanie:**
```bash
# Wyczyść cache
rm -rf node_modules .next dist
pnpm install

# Zrestartuj serwer
pnpm dev
```

### Problem: Pliki nie wgrywają się

**Rozwiązanie:**
1. Sprawdź `BUILT_IN_FORGE_API_KEY`
2. Upewnij się, że S3 jest dostępny
3. Sprawdź rozmiar pliku (max 100 MB)

---

## 📝 Licencja

Projekt BMCODEX CRM jest licencjonowany na warunkach **MIT License**.

```
Copyright (c) 2024 BMCODEX

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 🤝 Wsparcie

Jeśli masz pytania lub problemy:

1. **GitHub Issues**: https://github.com/bmcodex/bmcodex-crm/issues
2. **Email**: kontakt@bmcodex.pl
3. **Discord**: [Dołącz do serwera](https://discord.gg/bmcodex)

---

## 🎉 Dziękujemy!

Dziękujemy za korzystanie z BMCODEX CRM! Jeśli projekt Ci się podoba, daj nam ⭐ na GitHub.

**Wersja**: 1.0.0
**Data ostatniej aktualizacji**: 2025-11-11  
**Autor**: Michał — BMCODEX.pl
