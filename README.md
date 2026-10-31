# Shami Shoe Zone – Premium E-Commerce Footwear Store

Official web application for **Shami Shoe Zone** located at Shami General Store, Kala Pul, Abbottabad, Pakistan.

## 👟 Features
- **Abbottabad Delivery & Cash on Delivery (COD)**: Supports all Abbottabad neighborhoods (Mandian, Kala Pul, Cantt, Supply, PMA Road, Jinnahabad, etc.).
- **Direct WhatsApp Orders**: Instant formatted order message generation sent directly to the store WhatsApp number.
- **Bilingual Interface**: Seamless English and Urdu toggle with full RTL layout support.
- **Customer Authentication**: Google Sign-in, Email/Password, and Pakistani Mobile OTP sign-in.
- **Admin Dashboard (`/admin`)**: Pre-configured for store owner `awan11118@gmail.com`. Includes live revenue statistics, order status management, product CRUD, and customer records.
- **Netlify & PWA Ready**: Fully configured with `netlify.toml` and `public/_redirects` for zero-configuration Single Page Application (SPA) deployment.

---

## 🚀 How to Publish to GitHub (`MrHamza787/Shami-shoe-zone`)

### Method 1: Using GitHub Personal Access Token (PAT)
In your terminal, run:
```bash
git remote set-url origin https://<YOUR_GITHUB_TOKEN>@github.com/MrHamza787/Shami-shoe-zone.git
git push -u origin main --force
```

### Method 2: Using GitHub CLI (`gh`)
```bash
gh auth login
git push -u origin main
```

### Method 3: Using SSH Key
```bash
git remote set-url origin git@github.com:MrHamza787/Shami-shoe-zone.git
git push -u origin main
```

---

## 🌐 How to Deploy on Netlify

### Option A: Import from GitHub (Recommended)
1. Log in to [Netlify](https://app.netlify.com).
2. Click **"Add new site"** → **"Import an existing project"**.
3. Select **GitHub** and authorize access.
4. Choose repository: **`MrHamza787/Shami-shoe-zone`**.
5. Build settings are auto-detected via `netlify.toml`:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Click **"Deploy site"**!

### Option B: Deploy via Netlify CLI
```bash
npm run build
npx netlify deploy --prod --dir=dist
```

---

## 🛠️ Tech Stack
- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Database & Auth**: Firebase Firestore & Firebase Authentication
- **Icons**: Lucide React
- **Hosting**: Netlify
