# Ardor Football Hub

Dashboard interna per lo staff tecnico di Ardor: rosa, allenamenti, partite,
statistiche, esercizi e tattiche, stagione per stagione.

Costruita con [Next.js](https://nextjs.org) (App Router), TypeScript,
Tailwind CSS e [Supabase](https://supabase.com) (database + autenticazione).

## Stack

- **Next.js 16** (App Router, React 19, TypeScript, Tailwind CSS v4)
- **Supabase**: Postgres + Row Level Security per i dati, Auth per il login
- **recharts** per i grafici, **lucide-react** per le icone

## Setup locale

1. Installa le dipendenze:

   ```bash
   npm install
   ```

2. Copia il file di esempio delle variabili d'ambiente:

   ```bash
   cp .env.local.example .env.local
   ```

3. Apri `.env.local` e inserisci le credenziali del progetto Supabase:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://<il-tuo-progetto>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<la-tua-anon-key>
   ```

   Le trovi nella dashboard Supabase, sotto **Project Settings → API**.

4. Avvia il server di sviluppo:

   ```bash
   npm run dev
   ```

   L'app è disponibile su [http://localhost:3000](http://localhost:3000).

## Accesso e utenti

L'app **non ha registrazione self-service**: non esistono pagine di sign up,
reset password o magic link. Tutti gli utenti vengono creati manualmente da
Daniele tramite la dashboard Supabase, sotto **Authentication → Users → Add
user** (email + password).

Le autorizzazioni di accesso ai dati (RLS) e ai contenuti riservati sono
gestite lato Supabase:

- Le policy RLS sulle tabelle determinano quali stagioni/giocatori/dati
  ciascun utente può leggere.
- L'accesso alla sezione **Tattiche** (`/tactics`), che è globale e non
  filtrata per stagione, richiede che l'utente abbia il flag
  `global_tactics_access: true` nel campo `app_metadata`. Questo campo può
  essere impostato solo lato server, ad esempio dalla dashboard Supabase
  (**Authentication → Users → seleziona utente → Edit → Raw App Meta Data**)
  o via SQL editor:

  ```sql
  update auth.users
  set raw_app_meta_data = raw_app_meta_data || '{"global_tactics_access": true}'::jsonb
  where email = 'utente@esempio.it';
  ```

## Deploy su Vercel

1. Crea un nuovo progetto su [Vercel](https://vercel.com/new) collegando
   questo repository.
2. In **Settings → Environment Variables** aggiungi:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Esegui il deploy. Build command e output sono quelli standard di Next.js
   (`next build`), nessuna configurazione aggiuntiva richiesta.

## Struttura del progetto

```
app/
  login/                 Pagina di login (no sidebar)
  (dashboard)/            Layout autenticato con sidebar
    page.tsx              Dashboard
    players/               Rosa
    sessions/              Allenamenti
    matches/               Partite
    stats/                 Statistiche
    exercises/             Esercizi (catalogo globale)
    tactics/               Tattiche (globale, accesso riservato)
components/              Componenti UI, tabelle, grafici
lib/
  supabase/              Client Supabase (browser, server, proxy/middleware)
  types.ts               Tipi TypeScript per lo schema del database
  season.ts              Risoluzione della stagione selezionata
  format.ts              Helper di formattazione
proxy.ts                  Proxy (ex middleware) per auth e protezione route
```
