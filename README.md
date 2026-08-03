# My Workout — personal PWA

A black-and-white, Apple-style workout tracker. One user, no backend, no login.
All progress is saved in your browser (`localStorage`). Installable on iPhone.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Regenerate icons (optional)

```bash
npm run icons
```

## Build

```bash
npm run build
```

## Edit the program

Everything about the plan lives in [`data/program.ts`](data/program.ts).
If a "Watch" video link is broken, just fix the URL there.

## Deploy to Vercel

1. Push this folder to a new GitHub repo.
2. Go to vercel.com → **Add New… → Project** → import that repo.
3. Framework preset = **Next.js** (auto-detected). Click **Deploy**. Done.

## Install on iPhone

1. Open your Vercel URL in **Safari**.
2. Tap the **Share** button → **Add to Home Screen**.

It opens full-screen like a real app and works even with bad gym wifi.
