import Glücksrad from "./components/Glücksrad";
import MagicBento from "./MagicBento";
import Grainient from "./Grainient";
import { useState } from "react";

export default function App() {
  const [entries, setEntries] = useState(["Gewinnen", "Verlieren", "Nochmal"]);
  const [winners, setWinners] = useState({});
  const modes = ["standard", "transparent", "neon", "minimal", "abgedeckt"];

  const updateWinner = (mode, winner) => {
    setWinners((prev) => ({
      ...prev,
      [mode]: winner,
    }));
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

      {/* CONTENT GRID */}
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

          {/* ENTRIES PANEL */}
          <div className="entriesPanel">
            <span className="panelLabel">Einträge (für alle Räder)</span>

            <div className="inputRow">
              <input
                id="entryInput"
                placeholder="Neuer Eintrag"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const value = e.target.value.trim();
                    if (value) {
                      setEntries((prev) => [...prev, value]);
                      e.target.value = "";
                    }
                  }
                }}
              />
              <button onClick={() => {
                const input = document.getElementById("entryInput");
                const value = input.value.trim();
                if (value) {
                  setEntries((prev) => [...prev, value]);
                  input.value = "";
                }
              }}>Hinzufügen</button>
            </div>

            {entries.length === 0 ? (
              <div className="empty">Noch keine Einträge vorhanden.</div>
            ) : (
              <ul className="list">
                {entries.map((entry, i) => (
                  <li className="item" key={`${entry}-${i}`}>
                    <span className="itemText">{entry}</span>
                    <button 
                      className="removeBtn"
                      onClick={() => setEntries((prev) => prev.filter((_, idx) => idx !== i))}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

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
                entries={entries}
                onWinner={(winner) => updateWinner(mode, winner)}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}