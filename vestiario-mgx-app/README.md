# Gestionale Vestiario (Supabase + Vite/React)

App front-end pronta per il deploy gratuito su **Vercel**. Database e API su **Supabase**.

## Requisiti
- Account Supabase con tabelle: articoli, personale, assegnazioni, vista vw_stat_assegnazioni
- Project URL e anon key da Settings → API

## Configurazione ENV (Vercel)
Aggiungi queste variabili in Project Settings → Environment Variables:
- `VITE_SUPABASE_URL` = https://<tuo-progetto>.supabase.co
- `VITE_SUPABASE_ANON_KEY` = <anon key>

## Deploy rapido (senza terminale locale)
1. Crea un nuovo progetto su Vercel e importa questo repo/cartella (o trascina lo zip).
2. Imposta le ENV sopra.
3. Deploy.
4. Apri l'URL pubblico generato.

## Comandi locali (opzionale)
```bash
npm install
npm run dev
npm run build
npm run preview
```

## Struttura
- `src/lib/supabase.js` : client Supabase
- `src/components/*` : schermate
- `src/App.jsx` : menu principale

Buon lavoro!
