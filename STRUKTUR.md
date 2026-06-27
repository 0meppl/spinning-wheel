# 📁 Projektstruktur

## Vollständiger Dateibaum

```
glücksrad/
│
├── 📄 README.md                      # Dokumentation (Installationsanleitung)
├── 📄 package.json                   # Projekt-Metadaten & Dependencies
├── 📄 vite.config.js                 # Vite Build-Konfiguration
├── 📄 index.html                     # HTML-Einstiegspunkt
├── 📄 .gitignore                     # Git-Ignore Regeln
│
├── 📁 public/                        # Statische Assets
│   └── favicon.ico                   # Favicon (optional)
│
└── 📁 src/                           # Quellcode
    ├── 📄 main.jsx                   # React Entry Point
    ├── 📄 App.jsx                    # Haupt-App Wrapper
    ├── 📄 index.css                  # Globale Styles
    │
    ├── 📁 components/                # React Komponenten
    │   └── Glücksrad.jsx             # Glücksrad Komponente
    │
    └── 📁 styles/                    # Komponenten-spezifische Styles
        └── glücksrad.css             # Glücksrad CSS
```

## Datei-Beschreibungen

### Root-Level Dateien

| Datei | Zweck |
|-------|-------|
| `README.md` | Vollständige Dokumentation für das Projekt |
| `package.json` | Node.js Projekt-Konfiguration, Dependencies & Scripts |
| `vite.config.js` | Konfiguration für Vite (Build Tool) |
| `index.html` | Haupteinstiegspunkt - HTML Template |
| `.gitignore` | Dateien die Git ignorieren soll |

### src/ Verzeichnis

| Datei | Zweck |
|-------|-------|
| `main.jsx` | React App wird ins DOM gerendet |
| `App.jsx` | Haupt-Komponente mit Layout & Header |
| `index.css` | Globale Styles (Button, Input, etc.) |

### src/components/

| Datei | Zweck |
|-------|-------|
| `Glücksrad.jsx` | Hauptkomponente: State, Canvas, UI Logic |

### src/styles/

| Datei | Zweck |
|-------|-------|
| `glücksrad.css` | Spezifische Styles für Glücksrad |

## Setup-Schritt-für-Schritt

### 1. Repository erstellen und Dateien platzieren

```bash
# Neues Projekt-Verzeichnis erstellen
mkdir glücksrad
cd glücksrad

# Git initialisieren
git init

# Alle Dateien in die richtige Ordnerstruktur legen:
# - package.json, vite.config.js, index.html, .gitignore ins Wurzelverzeichnis
# - Alle src/* Dateien ins src Verzeichnis
# - Komponente ins src/components Verzeichnis
# - CSS ins src/styles Verzeichnis
```

### 2. Abhängigkeiten installieren

```bash
npm install
```

Dies erstellt:
- `node_modules/` - Installierte Pakete (nicht committen!)
- `package-lock.json` - Lock-Datei für exakte Versionen

### 3. Lokal entwickeln

```bash
npm run dev
```

Browser öffnet sich unter http://localhost:5173

### 4. Für Production bauen

```bash
npm run build
```

Erstellt optimierte `dist/` Verzeichnis zum Deployen

## Dependencies (aus package.json)

### Runtime Dependencies
- **react** (^18.2.0) - UI Library
- **react-dom** (^18.2.0) - React DOM Rendering

### Dev Dependencies
- **vite** (^5.0.8) - Build Tool & Dev Server
- **@vitejs/plugin-react** (^4.2.1) - React Support für Vite
- **@types/react** & **@types/react-dom** - TypeScript Types (optional)

## Commands (NPM Scripts)

```bash
npm run dev      # Startet Development Server
npm run build    # Erstellt Production Build in dist/
npm run preview  # Zeigt Production Build lokal
```

## Erste Änderungen machen

### Text/Header anpassen
Ändere in `src/App.jsx`:
```javascript
<h1>Dein neuer Titel</h1>
<p>Deine neue Beschreibung</p>
```

### Farben der Segmente ändern
In `src/components/Glücksrad.jsx`:
```javascript
const colors = [
  '#7F77DD',  // Lila
  '#1D9E75',  // Grün
  '#D85A30',  // Orange
  // ... mehr Farben hinzufügen/ändern
]
```

### Drehgeschwindigkeit anpassen
In `src/components/Glücksrad.jsx` in der `spin()` Funktion:
```javascript
const duration = 4000; // Millisekunden (4 Sekunden)
// Höher = langsamer, Niedriger = schneller
```

## Git Workflow

```bash
# Alle Dateien tracken
git add .

# Erstes Commit
git commit -m "Initial commit: Glücksrad App"

# Zu GitHub pushen (nachdem Remote hinzugefügt)
git remote add origin https://github.com/dein-username/glücksrad.git
git branch -M main
git push -u origin main
```

## Häufige Probleme

**Q: npm command not found**
A: Node.js nicht installiert. Downloade von https://nodejs.org/

**Q: Port 5173 wird bereits benutzt**
A: Änder den Port in vite.config.js oder nutze:
```bash
npm run dev -- --port 3000
```

**Q: Änderungen werden nicht angezeigt**
A: Browser-Cache leeren: Ctrl+Shift+Del (oder Cmd+Shift+Del auf Mac)

**Q: Cannot find module 'react'**
A: `npm install` nicht ausgeführt. Führe das zuerst aus.

## Deploy-Optionen

### Vercel (empfohlen)
```bash
npm install -g vercel
vercel
```

### Netlify
1. GitHub-Repo mit Netlify verbinden
2. Automatisches Deployment bei jedem Push

### GitHub Pages
```bash
npm run build
# dist/ Inhalt in gh-pages branch pushen
```

---

**Fertig!** Dein Glücksrad-Projekt ist bereit. 🎡
