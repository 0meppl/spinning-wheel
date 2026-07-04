import { useState, useEffect } from "react";
import Glücksrad from "./components/Glücksrad";
import MagicBento from "./MagicBento";
import Grainient from "./Grainient";

const MODES = [
  { id: "standard",    label: "Standard" },
  { id: "transparent", label: "Transparent" },
  { id: "neon",        label: "Neon" },
  { id: "minimal",     label: "Minimal" },
  { id: "abgedeckt",   label: "Abgedeckt" },
];

const DOT_COLORS = {
  standard:    ["#4f46e5","#7c3aed","#9333ea","#c026d3","#db2777","#e11d48"],
  transparent: ["#4f46e5","#7c3aed","#9333ea","#c026d3","#db2777","#e11d48"],
  neon:        ["#22d3ee","#818cf8","#a78bfa","#f472b6","#fb923c","#4ade80"],
  minimal:     ["#3c3c5e","#464670","#505082","#5a5a94","#6464a6","#6e6eb8"],
  abgedeckt:   ["#333","#333","#333","#333","#333","#333"],
};

function load(mode) {
  try { return JSON.parse(localStorage.getItem(`rad-${mode}`) ?? "[]"); }
  catch { return []; }
}
function save(mode, data) {
  try { localStorage.setItem(`rad-${mode}`, JSON.stringify(data)); } catch {}
}

export default function App() {
  const [mode, setMode]   = useState("standard");
  const [all, setAll]     = useState(() => {
    const obj = {};
    MODES.forEach(m => { obj[m.id] = load(m.id); });
    return obj;
  });
  const [input, setInput]           = useState("");
  const [winners, setWinners]       = useState({});
  const [showCopy, setShowCopy]     = useState(false);
  const [copyFrom, setCopyFrom]     = useState("");

  const entries = all[mode] ?? [];

  useEffect(() => { save(mode, all[mode] ?? []); }, [all, mode]);

  const addEntry = () => {
    const v = input.trim();
    if (!v) return;
    setAll(p => ({ ...p, [mode]: [...(p[mode] ?? []), { id: Date.now(), text: v }] }));
    setInput("");
  };

  const removeEntry = (id) =>
    setAll(p => ({ ...p, [mode]: p[mode].filter(e => e.id !== id) }));

  const handleWinner     = (won) => setWinners(p => ({ ...p, [mode]: won }));
  const handleRemoveWinner = (id) => removeEntry(id);

  const copyEntries = () => {
    if (!copyFrom || copyFrom === mode) return;
    const cloned = (all[copyFrom] ?? []).map(e => ({ ...e, id: Date.now() + Math.random() }));
    setAll(p => ({ ...p, [mode]: [...(p[mode] ?? []), ...cloned] }));
    setShowCopy(false);
    setCopyFrom("");
  };

  return (
    <div className="app">
      <div className="bg">
        <Grainient
          color1="#FF9FFC" color2="#5227FF" color3="#B497CF"
          timeSpeed={0.25} warpStrength={1} warpFrequency={5}
          warpSpeed={2} warpAmplitude={50} grainAmount={0.1} contrast={1.5}
        />
      </div>

      <div className="container">
        <MagicBento enableSpotlight enableBorderGlow spotlightRadius={400} glowColor="132, 0, 255">
          <div className="title">Glücksrad</div>
          <div className="subtitle">Einträge hinzufügen & drehen</div>
        </MagicBento>

        <div className="modeBar">
          {MODES.map(m => (
            <button key={m.id} className={`modeBtn${mode === m.id ? " active" : ""}`} onClick={() => setMode(m.id)}>
              {m.label}
            </button>
          ))}
        </div>

        <div className="mainLayout">
          {/* LEFT – Einträge */}
          <div className="leftPanel">
            <div className="card">
              <span className="cardLabel">Einträge — {mode}</span>

              <div className="inputRow">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && addEntry()}
                  placeholder="Neuer Eintrag"
                />
                <button onClick={addEntry}>Hinzufügen</button>
              </div>

              {entries.length === 0 ? (
                <div className="empty">Noch keine Einträge.</div>
              ) : (
                <ul className="list">
                  {entries.map((e, i) => (
                    <li key={e.id} className="item">
                      <span className="dot" style={{ background: (DOT_COLORS[mode] ?? DOT_COLORS.standard)[i % 6] }} />
                      <span className="itemText">{e.text}</span>
                      <button className="removeBtn" onClick={() => removeEntry(e.id)}>×</button>
                    </li>
                  ))}
                </ul>
              )}

              <button className="copyToggle" onClick={() => setShowCopy(p => !p)}>
                {showCopy ? "Abbrechen" : "Einträge kopieren von …"}
              </button>

              {showCopy && (
                <div className="copyRow">
                  <select value={copyFrom} onChange={e => setCopyFrom(e.target.value)}>
                    <option value="">Rad wählen</option>
                    {MODES.filter(m2 => m2.id !== mode).map(m2 => (
                      <option key={m2.id} value={m2.id}>{m2.label}</option>
                    ))}
                  </select>
                  <button onClick={copyEntries} disabled={!copyFrom}>Übernehmen</button>
                </div>
              )}
            </div>
          </div>

          {/* CENTER – Rad */}
          <div className="centerPanel">
            <Glücksrad
              key={mode}
              mode={mode}
              entries={entries}
              onWinner={handleWinner}
              onRemoveWinner={handleRemoveWinner}
            />
          </div>

          {/* RIGHT – Gewinner */}
          <div className="rightPanel">
            <div className="card">
              <span className="cardLabel">Letzte Gewinner</span>
              {Object.keys(winners).length === 0 ? (
                <div className="empty">Noch kein Gewinner.</div>
              ) : (
                <ul className="winnerList">
                  {MODES.map(m => winners[m.id] && (
                    <li key={m.id} className="winnerItem">
                      <span className="winnerMode">{m.label}</span>
                      <span className="winnerValue">{winners[m.id]}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}