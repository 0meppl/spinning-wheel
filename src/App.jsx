import { useState, useEffect } from "react";
import Glücksrad from "./components/Glücksrad";
import Dashboard from "./components/Dashboard";
import Particles from "./components/Particles";

const MODES = [
  { id: "standard",    label: "Standard"    },
  { id: "transparent", label: "Transparent" },
  { id: "neon",        label: "Neon"        },
  { id: "minimal",     label: "Minimal"     },
  { id: "abgedeckt",   label: "Abgedeckt"   },
];

const DOT_COLORS = {
  standard:    ["#4f46e5","#7c3aed","#9333ea","#c026d3","#db2777","#e11d48"],
  transparent: ["#4f46e5","#7c3aed","#9333ea","#c026d3","#db2777","#e11d48"],
  neon:        ["#22d3ee","#818cf8","#a78bfa","#f472b6","#fb923c","#4ade80"],
  minimal:     ["#3c3c5e","#464670","#505082","#5a5a94","#6464a6","#6e6eb8"],
  abgedeckt:   ["#444","#444","#444","#444","#444","#444"],
};

function load(k)       { try { return JSON.parse(localStorage.getItem(k) ?? "[]"); } catch { return []; } }
function save(k, data) { try { localStorage.setItem(k, JSON.stringify(data)); }       catch {} }

export default function App() {
  // Dashboard via URL-Hash: /#dashboard
  const [showDash, setShowDash] = useState(() => location.hash === "#dashboard");

  useEffect(() => {
    const onHash = () => setShowDash(location.hash === "#dashboard");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const openDash = () => { location.hash = "#dashboard"; setShowDash(true); };
  const exitDash = () => { location.hash = "";           setShowDash(false); };

  if (showDash) return <Dashboard onExit={exitDash} />;

  return <MainApp onOpenDash={openDash} />;
}

function MainApp({ onOpenDash }) {
  const [mode, setMode]         = useState("standard");
  const [all, setAll]           = useState(() => {
    const obj = {};
    MODES.forEach(m => { obj[m.id] = load(`rad-${m.id}`); });
    return obj;
  });
  const [input, setInput]       = useState("");
  const [dupWarning, setDupWarn] = useState(false);
  const [winners, setWinners]   = useState({});
  const [showCopy, setShowCopy] = useState(false);
  const [copyFrom, setCopyFrom] = useState("");
  const [editingId, setEditingId]     = useState(null);
  const [editingText, setEditingText] = useState("");
  const [copied, setCopied]           = useState(false);
  const [showImport, setShowImport]   = useState(false);
  const [importText, setImportText]   = useState("");

  const entries = all[mode] ?? [];

  // Geteilter Link beim Laden auswerten
  useEffect(() => {
    const p = new URLSearchParams(location.search);
    const sm = p.get("m"), se = p.get("e");
    if (sm && se && MODES.find(m => m.id === sm)) {
      const parsed = se.split(",").map(t => t.trim()).filter(Boolean)
        .map(text => ({ id: Date.now() + Math.random(), text }));
      setMode(sm);
      setAll(prev => ({ ...prev, [sm]: parsed }));
      history.replaceState({}, "", location.pathname);
    }
  }, []);

  useEffect(() => { save(`rad-${mode}`, all[mode] ?? []); }, [all, mode]);

  const addEntry = () => {
    const v = input.trim();
    if (!v) return;
    if (!dupWarning && (all[mode] ?? []).some(e => e.text.toLowerCase() === v.toLowerCase())) {
      setDupWarn(true); return;
    }
    setAll(p => ({ ...p, [mode]: [...(p[mode] ?? []), { id: Date.now(), text: v }] }));
    setInput(""); setDupWarn(false);
  };

  const removeEntry = (id) => setAll(p => ({ ...p, [mode]: p[mode].filter(e => e.id !== id) }));
  const clearAll    = ()   => { if (confirm(`Alle ${entries.length} Einträge für „${mode}" löschen?`)) setAll(p => ({ ...p, [mode]: [] })); };

  const commitEdit = (id) => {
    const v = editingText.trim();
    if (v) setAll(p => ({ ...p, [mode]: p[mode].map(e => e.id === id ? { ...e, text: v } : e) }));
    setEditingId(null);
  };

  const handleWinner = (won) => setWinners(p => ({ ...p, [mode]: won }));
  const handleRemove = (id)  => removeEntry(id);

  const copyEntries = () => {
    if (!copyFrom || copyFrom === mode) return;
    const cloned = (all[copyFrom] ?? []).map(e => ({ ...e, id: Date.now() + Math.random() }));
    setAll(p => ({ ...p, [mode]: [...(p[mode] ?? []), ...cloned] }));
    setShowCopy(false); setCopyFrom("");
  };

  const shareUrl = () => {
    const url = `${location.origin}${location.pathname}?m=${mode}&e=${encodeURIComponent(entries.map(e => e.text).join(","))}`;
    navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2200); });
  };

  const importEntries = () => {
    const items = importText.split(/[\n,]/).map(l => l.trim()).filter(Boolean)
      .map(text => ({ id: Date.now() + Math.random(), text }));
    setAll(p => ({ ...p, [mode]: [...(p[mode] ?? []), ...items] }));
    setImportText(""); setShowImport(false);
  };

  return (
    <div className="app">
      <div className="bg">
        <Particles quantity={100} color="#6366f1" staticity={55} ease={65} size={0.75} />
      </div>

      {/* Versteckter Dashboard-Link oben rechts */}
      <button className="dashLink" onClick={onOpenDash} title="Dashboard öffnen">⊞</button>

      <div className="container">
        <header className="header">
          <h1 className="title">Glücksrad</h1>
          <p className="subtitle">Leertaste oder Rad anklicken zum Drehen</p>
        </header>

        <nav className="modeBar">
          {MODES.map(m => {
            const count = (all[m.id] ?? []).length;
            return (
              <button key={m.id} className={`modeBtn${mode === m.id ? " active" : ""}`} onClick={() => setMode(m.id)}>
                {m.label}
                {count > 0 && <span className="modeCount">{count}</span>}
              </button>
            );
          })}
        </nav>

        <div className="mainLayout">
          {/* Links */}
          <aside className="leftPanel">
            <div className="card">
              <div className="cardHeader">
                <span className="cardLabel">Einträge</span>
                {entries.length > 0 && <button className="clearBtn" onClick={clearAll}>Alle löschen</button>}
              </div>

              <div className="inputRow">
                <input
                  value={input}
                  onChange={e => { setInput(e.target.value); setDupWarn(false); }}
                  onKeyDown={e => e.key === "Enter" && addEntry()}
                  placeholder="Neuer Eintrag"
                  className={dupWarning ? "warnBorder" : ""}
                />
                <button onClick={addEntry}>+</button>
              </div>

              {dupWarning && <p className="dupWarn">Bereits vorhanden – nochmals Enter zum Hinzufügen.</p>}

              <div className="rowActions">
                <button className="textBtn" onClick={() => { setShowImport(p => !p); setShowCopy(false); }}>
                  {showImport ? "Abbrechen" : "Text importieren"}
                </button>
                {entries.length > 0 && (
                  <button className="textBtn" onClick={shareUrl}>
                    {copied ? "✓ Kopiert" : "Link teilen"}
                  </button>
                )}
              </div>

              {showImport && (
                <div className="importBox">
                  <textarea
                    value={importText}
                    onChange={e => setImportText(e.target.value)}
                    placeholder={"Komma- oder zeilengetrennt:\nPizza, Pasta\nSalat"}
                    rows={4}
                  />
                  <button onClick={importEntries} disabled={!importText.trim()}>Importieren</button>
                </div>
              )}

              {entries.length === 0 && !showImport
                ? <p className="empty">Noch keine Einträge.</p>
                : (
                  <ul className="list">
                    {entries.map((e, i) => (
                      <li key={e.id} className="item">
                        <span className="dot" style={{ background: (DOT_COLORS[mode] ?? DOT_COLORS.standard)[i % 6] }} />
                        {editingId === e.id
                          ? (
                            <input
                              className="editInput"
                              value={editingText}
                              onChange={ev => setEditingText(ev.target.value)}
                              onKeyDown={ev => { if (ev.key === "Enter") commitEdit(e.id); if (ev.key === "Escape") setEditingId(null); }}
                              onBlur={() => commitEdit(e.id)}
                              autoFocus
                            />
                          ) : (
                            <span
                              className="itemText editable"
                              onClick={() => { setEditingId(e.id); setEditingText(e.text); }}
                              title="Klicken zum Bearbeiten"
                            >
                              {e.text}
                            </span>
                          )
                        }
                        <button className="removeBtn" onClick={() => removeEntry(e.id)}>×</button>
                      </li>
                    ))}
                  </ul>
                )
              }

              <button className="copyToggle" onClick={() => { setShowCopy(p => !p); setShowImport(false); }}>
                {showCopy ? "Abbrechen" : "Von anderem Rad kopieren"}
              </button>

              {showCopy && (
                <div className="copyRow">
                  <select value={copyFrom} onChange={e => setCopyFrom(e.target.value)}>
                    <option value="">Rad wählen</option>
                    {MODES.filter(m2 => m2.id !== mode).map(m2 => (
                      <option key={m2.id} value={m2.id}>{m2.label} ({(all[m2.id] ?? []).length})</option>
                    ))}
                  </select>
                  <button onClick={copyEntries} disabled={!copyFrom}>Übernehmen</button>
                </div>
              )}
            </div>
          </aside>

          {/* Mitte */}
          <main className="centerPanel">
            <Glücksrad key={mode} mode={mode} entries={entries} onWinner={handleWinner} onRemoveWinner={handleRemove} />
          </main>

          {/* Rechts */}
          <aside className="rightPanel">
            <div className="card">
              <span className="cardLabel">Letzte Gewinner</span>
              {Object.keys(winners).length === 0
                ? <p className="empty">Noch kein Gewinner.</p>
                : (
                  <ul className="winnerList">
                    {MODES.map(m => winners[m.id] && (
                      <li key={m.id} className="winnerItem">
                        <span className="winnerMode">{m.label}</span>
                        <span className="winnerValue">{winners[m.id]}</span>
                      </li>
                    ))}
                  </ul>
                )
              }
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}