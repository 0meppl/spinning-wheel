import Glücksrad from "./components/Glücksrad";
import MagicBento from "./MagicBento";
import Grainient from "./Grainient";
import { useState } from "react";

export default function App() {
  const [sharedEntries, setSharedEntries] = useState(false);
  const [winners, setWinners] = useState({});
  const [input, setInput] = useState("");
  const [globalEntries, setGlobalEntries] = useState([]);
  const modes = ["standard", "transparent", "neon", "minimal", "abgedeckt"];

  const updateWinner = (mode, winner) => {
    setWinners((prev) => ({
      ...prev,
      [mode]: winner,
    }));
  };

  const addEntry = () => {
    const value = input.trim();
    if (!value) return;
    setGlobalEntries((prev) => [...prev, value]);
    setInput("");
  };

  const removeEntry = (index) => {
    setGlobalEntries((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="app">

      {/* BACKGROUND */}
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

      {/* CONTENT */}
      <div className="layout">

        {/* LEFT - CONTROLS */}
        <div className="left">
          <MagicBento
            enableSpotlight
            enableBorderGlow
            spotlightRadius={400}
            glowColor="132, 0, 255"
          >
            <div className="title">Glücksrad</div>
            <div className="subtitle">Einträge hinzufügen & drehen</div>
          </MagicBento>

          {/* SHARE TOGGLE */}
          <button 
            className={`shareToggle ${sharedEntries ? "active" : ""}`}
            onClick={() => setSharedEntries(!sharedEntries)}
          >
            {sharedEntries ? "🔗 Einträge geteilt" : "📋 Separate Einträge"}
          </button>

          {/* ENTRIES PANEL */}
          {sharedEntries && (
            <div className="entriesPanel">
              <span className="panelLabel">Einträge (für alle Räder)</span>

              <div className="inputRow">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addEntry()}
                  placeholder="Neuer Eintrag"
                />
                <button onClick={addEntry}>+</button>
              </div>

              {globalEntries.length === 0 ? (
                <div className="empty">Noch keine Einträge vorhanden.</div>
              ) : (
                <ul className="list">
                  {globalEntries.map((entry, i) => (
                    <li className="item" key={`${entry}-${i}`}>
                      <span className="itemText">{entry}</span>
                      <button 
                        className="removeBtn"
                        onClick={() => removeEntry(i)}
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* WINNERS */}
          {Object.keys(winners).length > 0 && (
            <div className="winnersPanel">
              <span className="panelLabel">🎯 Gewinner</span>
              <div className="winnersList">
                {modes.map((mode) => winners[mode] && (
                  <div key={mode} className="winnerItem">
                    <span className="modeTag">{mode}</span>
                    <span className="winnerText">{winners[mode]}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT - WHEELS */}
        <div className="right">
          <div className="wheelsGrid">
            {modes.map((mode) => (
              <Glücksrad 
                key={mode}
                mode={mode}
                sharedEntries={sharedEntries}
                globalEntries={globalEntries}
                onWinner={(winner) => updateWinner(mode, winner)}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}