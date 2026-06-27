import { useEffect, useRef, useState } from "react";
import "../styles/glücksrad.css";

const COLORS = [
  "#5227ff",
  "#7c3aed",
  "#a855f7",
  "#d946ef",
  "#ec4899",
  "#fb7185",
];

export default function Glücksrad() {
  const [entries, setEntries] = useState(["Gewinnen", "Verlieren", "Nochmal"]);
  const [input, setInput] = useState("");
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState(null);

  const canvasRef = useRef(null);

  const addEntry = () => {
    const value = input.trim();
    if (!value) return;
    setEntries((prev) => [...prev, value]);
    setInput("");
  };

  const removeEntry = (index) => {
    setEntries((prev) => prev.filter((_, i) => i !== index));
  };

  const removeAllInstances = (name) => {
    setEntries((prev) => prev.filter((e) => e !== name));
  };

  const spin = () => {
    if (spinning || entries.length === 0) return;

    setSpinning(true);
    setWinner(null);

    const spins = 5 + Math.random() * 4;
    const stop = Math.random() * 360;
    const final = spins * 360 + stop;

    const start = rotation;
    const duration = 4000;
    const startTime = Date.now();

    const animate = () => {
      const t = Math.min((Date.now() - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      const current = start + (final - start) * ease;
      setRotation(current);

      if (t < 1) {
        requestAnimationFrame(animate);
        return;
      }

      const normalized = final % 360;
      const segment = 360 / entries.length;
      const index = Math.floor((360 - normalized) / segment) % entries.length;

      setWinner(entries[index]);
      setSpinning(false);
    };

    requestAnimationFrame(animate);
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const size = canvas.width;
    const center = size / 2;
    const radius = center - 8;

    ctx.clearRect(0, 0, size, size);

    if (entries.length === 0) {
      ctx.beginPath();
      ctx.arc(center, center, radius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.04)";
      ctx.fill();
      return;
    }

    const angle = (Math.PI * 2) / entries.length;

    entries.forEach((entry, i) => {
      const start = i * angle + (rotation * Math.PI) / 180;
      const end = start + angle;

      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, start, end);
      ctx.fillStyle = COLORS[i % COLORS.length];
      ctx.fill();

      ctx.strokeStyle = "rgba(5,6,10,0.6)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(start + angle / 2);

      ctx.fillStyle = "rgba(255,255,255,0.92)";
      ctx.font = "600 13px Inter, system-ui, sans-serif";
      ctx.textAlign = "right";

      const text = entry.length > 14 ? entry.slice(0, 14) + "…" : entry;
      ctx.fillText(text, radius - 14, 5);

      ctx.restore();
    });

    ctx.beginPath();
    ctx.arc(center, center, 14, 0, Math.PI * 2);
    ctx.fillStyle = "#05060a";
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  };

  useEffect(() => {
    draw();
  }, [entries, rotation]);

  return (
    <div className="rad">
      <div className="panel">
        <span className="panelLabel">Einträge</span>

        <div className="inputRow">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addEntry()}
            placeholder="Neuer Eintrag"
          />
          <button onClick={addEntry}>Hinzufügen</button>
        </div>

        {entries.length === 0 ? (
          <div className="empty">Noch keine Einträge vorhanden.</div>
        ) : (
          <ul className="list">
            {entries.map((entry, i) => (
              <li className="item" key={`${entry}-${i}`}>
                <span
                  className="dot"
                  style={{ background: COLORS[i % COLORS.length] }}
                />
                <span className="itemText">{entry}</span>

                <div className="actions">
                  <button onClick={() => removeEntry(i)} aria-label="Entfernen">
                    ×
                  </button>
                  <button onClick={() => removeAllInstances(entry)}>
                    alle entfernen
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="wheelPanel">
        <div className="wheelWrapper">
          <div className="pointer" />
          <canvas ref={canvasRef} width={340} height={340} />
        </div>

        <button
          className="spin"
          onClick={spin}
          disabled={spinning || entries.length === 0}
        >
          {spinning ? "läuft" : "drehen"}
        </button>

        <div className={`winner ${winner ? "visible" : ""}`}>
          <span className="winnerLabel">Ergebnis</span>
          <span className="winnerName">{winner ?? "—"}</span>
        </div>
      </div>
    </div>
  );
}