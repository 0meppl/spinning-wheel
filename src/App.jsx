import Glücksrad from "./components/Glücksrad";
import MagicBento from "./MagicBento";
import Grainient from "./Grainient";
import { useState } from "react";

export default function App() {
  const [mode, setMode] = useState("standard");
  const [winners, setWinners] = useState({});
  const modes = ["standard", "transparent", "neon", "minimal", "abgedeckt"];

  const updateWinner = (winner) => {
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

      {/* CONTENT */}
      <div className="container">
        {/* TITLE */}
        <MagicBento
          enableSpotlight
          enableBorderGlow
          spotlightRadius={400}
          glowColor="132, 0, 255"
        >
          <div className="title">Glücksrad</div>
          <div className="subtitle">Einträge hinzufügen & drehen</div>
        </MagicBento>

        {/* MODE BUTTONS */}
        <div className="modeButtons">
          {modes.map((m) => (
            <button
              key={m}
              className={`modeBtn ${mode === m ? "active" : ""}`}
              onClick={() => setMode(m)}
            >
              {m}
            </button>
          ))}
        </div>

        {/* MAIN LAYOUT */}
        <div className="mainLayout">
          {/* LEFT - ENTRIES */}
          <div className="leftPanel">
            <Glücksrad 
              mode={mode}
              onWinner={updateWinner}
            />
          </div>

          {/* RIGHT - WINNERS */}
          {Object.keys(winners).length > 0 && (
            <div className="rightPanel">
              <div className="winnersSection">
                <h3>🎯 Gewinner</h3>
                <div className="winnersList">
                  {modes.map((m) => winners[m] && (
                    <div key={m} className="winnerCard">
                      <span className="modeTag">{m}</span>
                      <span className="winnerText">{winners[m]}</span>
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