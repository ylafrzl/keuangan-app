# Cara Build Keuangan ke macOS App

## Prasyarat

Pastikan sudah install:
- **Node.js** v18+ → https://nodejs.org
- **Xcode Command Line Tools** → `xcode-select --install`
- **npm** (sudah include dengan Node.js)

---

## 1. Install Dependencies

```bash
cd keuangan-fixed
npm install
```

> `better-sqlite3` butuh native compilation. Pastikan Xcode CLT sudah ter-install sebelum langkah ini.

---

## 2. Jalankan sebagai Dev (test dulu sebelum build)

**Web biasa (browser):**
```bash
npm run dev
# Buka http://localhost:3000
```

**Desktop Electron (dengan hot-reload):**
```bash
npm run electron:dev
```

---

## 3. Build macOS .dmg Installer

### Untuk Mac Apple Silicon (M1/M2/M3):
```bash
npm run dist:mac
# Output: dist/Keuangan-1.0.0-arm64.dmg
```

### Untuk Mac Intel:
```bash
npm run build
npx electron-builder --mac --x64
# Output: dist/Keuangan-1.0.0.dmg
```

### Universal (Intel + Apple Silicon, file lebih besar):
```bash
npm run dist:mac:universal
# Output: dist/Keuangan-1.0.0-universal.dmg
```

---

## 4. Buka DMG & Install

1. Double-click file `.dmg` di folder `dist/`
2. Drag **Keuangan.app** ke folder **Applications**
3. Buka dari Launchpad atau Spotlight

### ⚠️ "App cannot be opened because it is from unidentified developer"

Karena app tidak di-sign dengan Apple Developer ID ($99/tahun), macOS akan memblok.
Ada dua cara:

**Cara A — Klik kanan:**
```
Klik kanan Keuangan.app → Open → Open (konfirmasi)
```

**Cara B — Terminal:**
```bash
xattr -rd com.apple.quarantine /Applications/Keuangan.app
```

---

## 5. Data Tersimpan Di Mana?

Setelah install, SQLite database tersimpan di:
```
~/Library/Application Support/Keuangan/data/keuangan.db
```

Folder ini otomatis dibuat saat pertama kali app dibuka.

---

## Struktur Build

```
dist/
├── Keuangan-1.0.0-arm64.dmg          ← Installer (drag & drop)
├── Keuangan-1.0.0-arm64.dmg.blockmap
├── builder-debug.yml
└── mac-arm64/
    └── Keuangan.app/                  ← App bundle
```

---

## Troubleshooting

**Error: `better-sqlite3` native module mismatch**
```bash
npm run build
cd node_modules/better-sqlite3
npx node-pre-gyp install --fallback-to-build --runtime=electron --target=30.0.0 --target_arch=arm64 --dist-url=https://electronjs.org/headers
```

**Error: `spawn next ENOENT` di production**
Pastikan `next build` sudah dijalankan sebelum `electron-builder` dan output ada di `.next/standalone/`.

**Window kosong / blank screen**
Cek di DevTools (`Cmd+Option+I`):
- Apakah Next.js server berhasil start?
- Cek error di Console
