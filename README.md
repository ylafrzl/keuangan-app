# Keuangan - Personal Finance Recorder

A modern personal finance management application built with **Next.js**, **React**, and **Electron**. Track your expenses, income, and financial summaries with a clean, intuitive interface.

## Features

- 📊 **Financial Dashboard** - View summary cards for income, expenses, and balance
- 💰 **Entry Management** - Record and track financial transactions
- 📁 **Categories** - Organize transactions by category
- 👤 **Multi-User Support** - Manage different user accounts
- 📝 **Remarks** - Add notes and remarks to your financial records
- 🖥️ **Desktop & Web** - Run as a web app or standalone Electron desktop application
- 📁 **Local Database** - SQLite-based storage with no server required
- 🎨 **Modern UI** - Tailwind CSS for responsive, beautiful design

## Tech Stack

- **Frontend**: React 18, Next.js 14
- **Desktop**: Electron 30
- **Database**: SQLite (better-sqlite3)
- **Styling**: Tailwind CSS
- **Build**: Next.js Build System, Electron Builder

## Prerequisites

- **Node.js** v18 or higher → [Download](https://nodejs.org)
- **npm** (included with Node.js)
- **Xcode Command Line Tools** (macOS only) → `xcode-select --install`

## Installation

1. Clone the repository:
```bash
cd keuangan-app
```

2. Install dependencies:
```bash
npm install
```

> **Note**: `better-sqlite3` requires native compilation. Ensure Xcode Command Line Tools are installed before this step.

## Development

### Run as Web App
Start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Run as Desktop App (Electron)
With hot-reload:
```bash
npm run electron:dev
```

This will open the Electron app while running the Next.js dev server.

## Building

### Build for Production
```bash
npm run build
```

### Desktop Distribution

#### macOS (Apple Silicon - M1/M2/M3):
```bash
npm run dist:mac
```
Output: `dist/Keuangan-1.0.0-arm64.dmg`

#### macOS (Intel):
```bash
npm run build
npx electron-builder --mac --x64
```
Output: `dist/Keuangan-1.0.0.dmg`

#### macOS (Universal - Intel & Apple Silicon):
```bash
npm run dist:mac:universal
```

## Project Structure

```
keuangan-fixed/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── layout.jsx       # Root layout
│   │   ├── page.jsx         # Home page
│   │   └── api/             # API routes
│   │       ├── entries/     # Transaction endpoints
│   │       ├── export/      # Export functionality
│   │       ├── remarks/     # Remarks endpoints
│   │       └── users/       # User management
│   ├── components/          # Reusable React components
│   │   ├── CategorySection.jsx
│   │   ├── MonthlyRemark.jsx
│   │   ├── SummaryCards.jsx
│   │   ├── UserAuth.jsx
│   │   └── ...
│   └── lib/                 # Utility functions & hooks
│       ├── constants.js
│       ├── db.js            # Database utilities
│       ├── useFinance.js    # Finance hooks
│       └── useUsers.js      # User hooks
├── electron/                # Electron main process
│   └── main.js
├── public/                  # Static assets
├── build/                   # Build resources (icons, etc.)
├── next.config.js           # Next.js configuration
├── tailwind.config.js       # Tailwind CSS config
└── package.json
```

## API Endpoints

- `POST /api/entries` - Create a new transaction
- `GET /api/entries` - Fetch all entries
- `DELETE /api/entries/[id]` - Delete a transaction
- `POST /api/users` - Create user
- `POST /api/users/auth` - User authentication
- `GET /api/remarks` - Fetch remarks
- `POST /api/export` - Export financial data

## Configuration

- **Environment**: Check `jsconfig.json` for path aliases
- **Styling**: Customize `tailwind.config.js` for Tailwind CSS
- **PostCSS**: See `postcss.config.js` for CSS processing
- **Build Icons**: Place app icons in `build/icons/` directory

## Docker

A Dockerfile is included for containerized deployment:
```bash
docker build -t keuangan .
docker run -p 3000:3000 keuangan
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js development server |
| `npm start` | Start production server |
| `npm run build` | Build Next.js for production |
| `npm run electron` | Run Electron app (production build) |
| `npm run electron:dev` | Run Electron with dev server (hot-reload) |
| `npm run electron:build` | Build and create Electron app |
| `npm run electron:dist` | Build distributable Electron app |
| `npm run dist:mac` | Build macOS .dmg for current architecture |
| `npm run dist:mac:universal` | Build macOS universal binary |

## License

This project is private.

## Support

For detailed build instructions, see [BUILD_GUIDE.md](BUILD_GUIDE.md).
