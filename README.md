# 🎡 Glücksrad

Ein interaktives Glücksrad-Tool zum Erstellen und Drehen mit beliebig vielen Einträgen.

## Features

✨ Beliebig viele Einträge hinzufügen und löschen
🎨 Farbiges Design mit verschiedenen Segmentfarben
🎯 Echte Zufälligkeit beim Drehen
⚡ Smooth Animationen mit Easing
📱 Responsive Design

## Installation

### Voraussetzungen

- **Node.js** (v14 oder höher) - [Hier downloaden](https://nodejs.org/)
- **npm** (kommt mit Node.js)

### Schritt-für-Schritt Installation

1. **Repository klonen** (oder herunterladen)
```bash
git clone https://github.com/0meppl/glücksrad.git
cd glücksrad
```

2. **Dependencies installieren**
```bash
npm install
```

3. **Projekt starten**
```bash
npm run dev
```

Die App öffnet sich automatisch im Browser unter `http://localhost:5173`

## Verwendung

1. Gib einen Text ins Eingabefeld ein
2. Klick "Hinzufügen" oder drück Enter
3. Wiederhol das für alle Einträge
4. Klick "Drehen!" um das Rad zu spinnen
5. Der Gewinner wird angezeigt!

Einträge löschen: Klick das X auf dem farbigen Tag.

## Projektstruktur

```
glücksrad/
├── README.md                  # Diese Datei
├── .gitignore               # Git ignore rules
├── package.json             # Dependencies und Scripts
├── vite.config.js           # Vite Konfiguration
├── index.html               # HTML Einstieg
│
├── public/                  # Statische Dateien
│   └── favicon.ico
│
└── src/
    ├── main.jsx             # React Entry Point
    ├── App.jsx              # Haupt-App Komponente
    ├── index.css            # Globale Styles
    │
    ├── components/
    │   └── Glücksrad.jsx    # Glücksrad Komponente
    │
    └── styles/
        └── glücksrad.css    # Glücksrad Styles (optional)
```

## Available Scripts

```bash
npm run dev       # Startet dev server (http://localhost:5173)
npm run build     # Erstellt optimierte Production Build
npm run preview   # Zeigt Production Build lokal
```

## Technologien

- **React 18** - UI Library
- **Vite** - Build Tool
- **Canvas API** - Für das Glücksrad Rendering

## Browser Support

- Chrome (neueste Versionen)
- Firefox (neueste Versionen)
- Safari (neueste Versionen)
- Edge (neueste Versionen)

## Anpassungen

### Farben ändern
Öffne `src/components/Glücksrad.jsx` und ändere das `colors` Array:
```javascript
const colors = [
  '#7F77DD',  // Lila
  '#1D9E75',  // Grün
  // ... weitere Farben
];
```

### Drehgeschwindigkeit ändern
In der `spin()` Funktion, ändere `duration`:
```javascript
const duration = 4000; // Millisekunden (4 Sekunden)
```

### Anzahl der Umdrehungen
Ändere den `spins` Wert:
```javascript
const spins = 5 + Math.random() * 5; // 5-10 Umdrehungen
```

## Troubleshooting

**"Node.js ist nicht installiert"**
→ Installiere Node.js von https://nodejs.org/

**"npm command not found"**
→ Node.js Installation überprüfen oder Terminal neu starten

**"Port 5173 ist bereits in Benutzung"**
→ Vite benutzt automatisch einen anderen Port, oder:
```bash
npm run dev -- --port 3000
```

**Änderungen werden nicht angezeigt**
→ Browser-Cache leeren (Strg+Shift+R oder Cmd+Shift+R)

## Deploy

### Mit Vercel
```bash
npm i -g vercel
vercel
```

### Mit Netlify
Verbinde dein GitHub-Repository mit Netlify und es wird automatisch deployed.

### Mit GitHub Pages
```bash
npm run build
# Inhalt von dist/ in gh-pages branch pushen
```

## Lizenz

MIT License - frei verwendbar

## Support

Probleme? Öffne ein Issue auf GitHub oder kontaktiere den Entwickler.

---

Made with ❤️
