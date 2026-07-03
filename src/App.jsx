import Glücksrad from "./components/Glücksrad";
import MagicBento from "./MagicBento";
import Grainient from "./Grainient";
import { useState } from "react";

export default function App() {
  const [mode, setMode] = useState("standard");
  const modes = ["standard", "transparent", "neon", "minimal", "abgedeckt"];

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

        {/* LEFT */}
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

          {/* MODE SWITCHER */}
          <div className="modeSwitcher">
            <span className="modeLabel">Design:</span>
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
          </div>

          <div className="wheelBox">
            <Glücksrad mode={mode} />
          </div>

          {/* CHANGELOG */}
          <div className="changelog">
            <h3>✨ Was ist neu</h3>
            <div className="changelogEntry">
              <strong>v1.1.0</strong>
              <ul>
                <li>5 Design-Modi: Standard, Neon, Minimal, Transparent, Abgedeckt</li>
                <li>Historie der letzten 5 gezogenen Gewinner</li>
                <li>Einträge speichern automatisch im Browser (localStorage)</li>
                <li>Gewinner wird im Rad angezeigt</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}