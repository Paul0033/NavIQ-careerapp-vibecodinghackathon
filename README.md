# NavIQ (Client Only)

This is the client-only React/Vite app for NavIQ. It runs fully on the browser (no backend).

## Quick Start
```bash
npm install
npm run dev
# open the localhost URL that Vite prints
```

## Build for Vercel (static)
```bash
npm run build
# Deploy the generated dist/ folder to Vercel
```

## Push to GitHub
```bash
git init
git add -A
git commit -m "Initial import: NavIQ client"
git branch -M main
gh repo create NavIQ --public --source=. --remote=origin --push
# or manually:
# git remote add origin https://github.com/<your-username>/NavIQ.git
# git push -u origin main
```
