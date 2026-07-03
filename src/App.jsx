import { useState, useEffect } from "react";
import Glücksrad from "./components/Glücksrad";
import MagicBento from "./MagicBento";
import Grainient from "./Grainient";

const MODES = ["standard", "transparent", "neon", "minimal", "abgedeckt"];

export default function App() {
  const [currentMode, setCurrentMode] = useState("standard");
  const [copySource, setCopySource] = useState(null);
  const [copyTarget, setCopyTarget] = useState(null);
  const [showCopyUI, setShowCopyUI] = useState(false);
  const [winners, setWinners] = useState({});

  // SEPARATE STATE FÜR JEDES RAD
  const [entries, setEntries] = useState(() => {
    const stored = {};
    MODES.forEach(mode => {
      try {
        const key = `glücksrad-entries-${mode}`;
        const data = localStorage.getItem(key);
        stored[mode] = data ? JSON.parse(data) : [];
      } catch {
        stored[mode] = [];
      }
    });
    return stored;
  });

  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  // Speichere Einträge für aktuelles Rad
  useEffect(() => {
    try {
      const key = `glücksrad-entries-${currentMode}`;
      localStorage.setItem(key, JSON.stringify(entries[currentMode] || []));
    } catch {}
  }, [entries, currentMode]);

  const currentEntries = entries[currentMode] || [];

  const addEntry = () => {
    const value = input.trim();
    if (!value) return;
    setEntries(prev => ({
      ...prev,
      [currentMode]: [...(prev[currentMode] || []), { id: Date.now(), text: value }]
    }));
    setInput("");
  };

  const editEntry = (id, newText) => {
    if (!newText.trim()) return;
    setEntries(prev => ({
      ...prev,
      [currentMode]: prev[currentMode].map(e => e.id === id ? { ...e, text: newText } : e)
    }));
    setEditingId(null);
  };

  const removeEntry = (id) => {
    setEntries(prev => ({
      ...prev,
      [currentMode]: prev[currentMode].filter(e => e.id !== id)
    }));
  };

  const copyEntries = () => {
    if (!copySource || !copyTarget) return;
    setEntries(prev => ({
      ...prev,
      [copyTarget]: [...prev[copyTarget], ...prev[copySource]]
    }));
    setCopySource(null);
    setCopyTarget(null);
    setShowCopyUI(false);
  };

  const updateWinner = (winner) => {
    setWinners(prev => ({ ...prev, [currentMode]: winner }));
  };

  return (
    <div className="app">
      <div className="bg">
        <Grainient
          color1="#FF9FFC"
          color2="#5227FF"
          color3="#B497CF"
          timeSpeed={0.25}
          warpStrength={1}
          warpFrequency={5}
          warpSpeed={2}
          warpAmplitude={50}
          grainAmount={0.1}
          contrast={1.5}
        />
      </div>

      <div className="container">
        <MagicBento
          enableSpotlight
          enableBorderGlow
          spotlightRadius={400}
          glowColor="132, 0, 255"
        >
          <div className="title">Glücksrad</div>
          <div className="subtitle">Einträge hinzufügen & drehen</div>
        </MagicBento>

        {/* MODE SWITCHER */}
        <div className="modeButtons">
          {MODES.map(mode => (
            <button 
              key={mode}
              className={`modeBtn ${currentMode === mode ? "active" : ""}`}
              onClick={() => setCurrentMode(mode)}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>

        <div className="mainLayout">
          {/* LEFT - ENTRIES MANAGEMENT */}
          <div className="leftPanel">
            <div className="panelCard">
              <div className="panelHeader">
                <h3>📝 Einträge ({currentMode})</h3>
              </div>

              {/* INPUT */}
              <div className="inputRow">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addEntry()}
                  placeholder="Neuer Eintrag..."
                  className="entryInput"
                />
                <button onClick={addEntry} className="btnAdd">+</button>
              </div>

              {/* ENTRIES LIST */}
              {currentEntries.length === 0 ? (
                <div className="emptyState">Noch keine Einträge vorhanden</div>
              ) : (
                <ul className="entriesList">
                  {currentEntries.map((entry, idx) => (
                    <li key={entry.id} className="entryItem">
                      {editingId === entry.id ? (
                        <div className="editRow">
                          <input
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") editEntry(entry.id, editingText);
                              if (e.key === "Escape") setEditingId(null);
                            }}
                            autoFocus
                          />
                          <button onClick={() => editEntry(entry.id, editingText)} className="btnSmall">✓</button>
                          <button onClick={() => setEditingId(null)} className="btnSmall cancel">✕</button>
                        </div>
                      ) : (
                        <>
                          <span className="dotColor" style={{background: getColorForMode(currentMode)[idx % 6]}} />
                          <span className="entryText">{entry.text}</span>
                          <button 
                            onClick={() => { setEditingId(entry.id); setEditingText(entry.text); }}
                            className="btnSmall"
                          >✎</button>
                          <button 
                            onClick={() => removeEntry(entry.id)}
                            className="btnSmall delete"
                          >×</button>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              )}

              {/* COPY BUTTON */}
              <button 
                onClick={() => setShowCopyUI(!showCopyUI)}
                className="btnCopy"
              >
                📋 Einträge kopieren
              </button>
            </div>

            {/* COPY UI */}
            {showCopyUI && (
              <div className="copyPanel">
                <div className="copyStep">
                  <label>Von Rad:</label>
                  <select 
                    value={copySource || ""}
                    onChange={(e) => setCopySource(e.target.value || null)}
                    className="selectBox"
                  >
                    <option value="">-- Wählen --</option>
                    {MODES.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div className="copyStep">
                  <label>Zu Rad:</label>
                  <select 
                    value={copyTarget || ""}
                    onChange={(e) => setCopyTarget(e.target.value || null)}
                    className="selectBox"
                  >
                    <option value="">-- Wählen --</option>
                    {MODES.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <button 
                  onClick={copyEntries}
                  disabled={!copySource || !copyTarget || copySource === copyTarget}
                  className="btnCopyExecute"
                >
                  Jetzt kopieren
                </button>
              </div>
            )}
          </div>

          {/* CENTER - WHEEL */}
          <div className="centerPanel">
            <Glücksrad 
              mode={currentMode} 
              entries={currentEntries}
              onWinner={updateWinner}
            />
          </div>

          {/* RIGHT - WINNERS */}
          {Object.keys(winners).length > 0 && (
            <div className="rightPanel">
              <div className="panelCard winnersCard">
                <div className="panelHeader">
                  <h3>🏆 Gewinner</h3>
                </div>
                <div className="winnersList">
                  {MODES.map(mode => winners[mode] && (
                    <div key={mode} className="winnerItem">
                      <span className="winnerMode">{mode}</span>
                      <span className="winnerValue">{winners[mode]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getColorForMode(mode) {
  const colors = {
    standard: ["#5227ff","#7c3aed","#a855f7","#d946ef","#ec4899","#fb7185"],
    transparent: ["rgba(82,39,255,0.4)","rgba(124,58,237,0.4)","rgba(168,85,247,0.4)","rgba(217,70,239,0.4)","rgba(236,72,153,0.4)","rgba(251,113,133,0.4)"],
    neon: ["#00ff88","#00ccff","#ff00ff","#ffff00","#ff6600","#ff0066"],
    minimal: ["#222","#333","#444","#555","#666","#777"],
    abgedeckt: ["#1a1a2e","#1a1a2e","#1a1a2e","#1a1a2e","#1a1a2e","#1a1a2e"]
  };
  return colors[mode] || colors.standard;
}