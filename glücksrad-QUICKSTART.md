# 🚀 Quick Start - Glücksrad in 5 Minuten

## Was du brauchst

✅ **Node.js & npm** - [Hier downloaden](https://nodejs.org/)

Das war's! Alles andere wird automatisch installiert.

---

## Installation & Start (Copy-Paste)

### Windows (PowerShell oder CMD)
```bash
# 1. In das Projekt-Verzeichnis gehen
cd glücksrad

# 2. Dependencies installieren
npm install

# 3. App starten
npm run dev
```

### Mac & Linux (Terminal)
```bash
# 1. In das Projekt-Verzeichnis gehen
cd glücksrad

# 2. Dependencies installieren
npm install

# 3. App starten
npm run dev
```

**Das wars!** Der Browser öffnet sich automatisch unter:
```
http://localhost:5173
```

---

## Was danach passiert

1. ✅ Terminal zeigt: `VITE v5.0.8 ready in XXX ms`
2. ✅ Browser öffnet sich automatisch
3. ✅ Du siehst dein Glücksrad
4. ✅ Jede Änderung aktualisiert sich live!

---

## Erste Tests

1. Gib "Pizza" ins Feld ein → Klick "Hinzufügen"
2. Gib "Eistüte" ein → Klick "Hinzufügen"
3. Klick "DREHEN!" → Rad spinnt und zeigt den Gewinner

---

## Änderungen machen

### Farben ändern
Öffne: `src/components/Glücksrad.jsx`

Finde diese Zeile (ca. Zeile 16):
```javascript
const colors = [
  '#7F77DD',  // Lila
  '#1D9E75',  // Grün
  '#D85A30',  // Orange
  '#E24B4A',  // Rot
  '#185FA5',  // Blau
  '#639922',  // Hellgrün
  '#BA7517',  // Braun
  '#4B1528'   // Dunkelrot
]
```

Änder einfach die Hex-Codes. Beispiele:
- `#FF0000` = Rot
- `#00FF00` = Grün
- `#0000FF` = Blau
- `#FFFF00` = Gelb
- `#FF00FF` = Magenta

Speichern (Ctrl+S) → Der Browser aktualisiert sich automatisch! ✨

### Titel ändern
Öffne: `src/App.jsx`

Finde (ca. Zeile 13):
```javascript
<h1>🎡 Glücksrad</h1>
```

Ändere zu:
```javascript
<h1>🎲 Mein super Rad</h1>
```

### Drehgeschwindigkeit
Öffne: `src/components/Glücksrad.jsx`

Finde (ca. Zeile 33):
```javascript
const duration = 4000; // 4 Sekunden
```

Änderungen:
- `2000` = 2 Sekunden (schnell)
- `6000` = 6 Sekunden (langsam)
- `10000` = 10 Sekunden (sehr langsam)

---

## Build für Produktion

Wenn du fertig bist und es online stellen willst:

```bash
npm run build
```

Das erstellt einen optimierten `dist/` Ordner zum Deployen.

---

## Troubleshooting

### Problem: "npm: command not found"
**Lösung:** Node.js ist nicht installiert. Download: https://nodejs.org/

### Problem: "ENOENT: no such file or directory"
**Lösung:** Sicher stellen, dass du im richtigen Verzeichnis bist:
```bash
cd glücksrad
ls  # oder: dir (auf Windows)
```
Sollte `package.json`, `src/`, etc. zeigen.

### Problem: Browser öffnet sich nicht
**Lösung:** Öffne manuell:
```
http://localhost:5173
```

### Problem: "Port 5173 is already in use"
**Lösung:** Anderer Port:
```bash
npm run dev -- --port 3000
```

### Problem: Änderungen werden nicht angezeigt
**Lösung:** Browser-Cache leeren:
- **Chrome/Edge:** Ctrl+Shift+Delete
- **Firefox:** Ctrl+Shift+Delete
- **Safari:** Cmd+Option+E

---

## Terminal-Befehle erklärt

| Befehl | Was es macht |
|--------|--------------|
| `npm install` | Installiert alle Abhängigkeiten aus package.json |
| `npm run dev` | Startet den Entwicklungs-Server |
| `npm run build` | Erstellt einen optimierten Build für Production |
| `npm run preview` | Zeigt den Production Build lokal |

---

## Nächste Schritte

1. ✅ Projekt startet mit `npm run dev`
2. 🎨 Spiel mit den Farben rum
3. 📝 Ändere Titel und Beschreibung
4. 🔧 Erkunde andere Dateien in `src/`
5. 🚀 Deploye es online (siehe README.md für Optionen)

---

## Dateien zum Bearbeiten

**Anfänger:**
- `src/App.jsx` - Header & Styling
- `src/components/Glücksrad.jsx` - Colors Array

**Fortgeschrittene:**
- `src/styles/glücksrad.css` - Detailliertes Styling
- `src/index.css` - Globale Styles

---

**Das wars! Viel Spaß mit deinem Glücksrad! 🎡** 

Bei Fragen → Schau in README.md oder STRUKTUR.md
