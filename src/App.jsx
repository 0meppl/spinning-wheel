import Glücksrad from "./components/Glücksrad";
import MagicBento from "./MagicBento";
import Grainient from "./Grainient";

export default function App() {
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

          <div className="wheelBox">
            <Glücksrad />
          </div>
        </div>

      </div>
    </div>
  );
}