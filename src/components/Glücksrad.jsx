import { useEffect, useRef, useState } from "react";
import "../styles/glücksrad.css";

const MODE_COLORS = {
  standard:    ["#5227ff","#7c3aed","#a855f7","#d946ef","#ec4899","#fb7185"],
  transparent: ["rgba(82,39,255,0.4)","rgba(124,58,237,0.4)","rgba(168,85,247,0.4)","rgba(217,70,239,0.4)","rgba(236,72,153,0.4)","rgba(251,113,133,0.4)"],
  neon:        ["#00ff88","#00ccff","#ff00ff","#ffff00","#ff6600","#ff0066"],
  minimal:     ["#222","#333","#444","#555","#666","#777"],
  abgedeckt:   ["#1a1a2e","#1a1a2e","#1a1a2e","#1a1a2e","#1a1a2e","#1a1a2e"],
};
const REVEAL_COLORS = ["#5227ff","#7c3aed","#a855f7","#d946ef","#ec4899","#fb7185"];

export default function Glücksrad({ mode = "standard", sharedEntries = false, globalEntries = [], onWinner }) {
  const storageKey = `gluecksrad-${mode}`;
  
  const [localEntries, setLocalEntries] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Nutze globalEntries wenn geteilt, sonst lokalentries
  const entries = sharedEntries ? globalEntries : localEntries;

  // Speichere lokale Einträge
  useEffect(() => {
    if (!sharedEntries) {
      try { localStorage.setItem(storageKey, JSON.stringify(localEntries)); } catch {}
    }
  }, [localEntries, sharedEntries, storageKey]);

  const [rotation, setRotation]   = useState(0);
  const [spinning, setSpinning]   = useState(false);
  const [winner, setWinner]       = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [revealed, setRevealed]   = useState(false);

  const canvasRef = useRef(null);

  const closeModal  = () => setModalOpen(false);

  const spin = () => {
    if (spinning || entries.length === 0) return;
    setSpinning(true);
    setWinner(null);
    setModalOpen(false);
    setRevealed(false);

    const spins    = 5 + Math.random() * 4;
    const stop     = Math.random() * 360;
    const start    = rotation;
    const final    = start + spins * 360 + stop;
    const duration = 4000;
    const startTime = Date.now();

    const animate = () => {
      const t    = Math.min((Date.now() - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setRotation(start + (final - start) * ease);

      if (t < 1) { requestAnimationFrame(animate); return; }

      const normalized   = ((final % 360) + 360) % 360;
      const segment      = 360 / entries.length;
      const pointerAngle = ((270 - normalized) % 360 + 360) % 360;
      const index        = Math.floor(pointerAngle / segment) % entries.length;
      const won          = entries[index];

      setWinner(won);
      setRevealed(true);
      setSpinning(false);
      if (onWinner) onWinner(won);
      setTimeout(() => setModalOpen(true), 500);
    };

    requestAnimationFrame(animate);
  };

  // ---- draw ----
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx    = canvas.getContext("2d");
    const size   = canvas.width;
    const center = size / 2;
    const radius = center - 8;

    const colors =
      mode === "abgedeckt" && !revealed
        ? MODE_COLORS.abgedeckt
        : mode === "abgedeckt" && revealed
        ? REVEAL_COLORS
        : MODE_COLORS[mode] ?? MODE_COLORS.standard;

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
      const end   = start + angle;

      if (mode === "neon") { ctx.shadowBlur = 14; ctx.shadowColor = colors[i % colors.length]; }
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, start, end);
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.strokeStyle = "rgba(5,6,10,0.55)";
      ctx.lineWidth   = 1.5;
      ctx.stroke();

      // Text (hidden in "abgedeckt" while spinning)
      if (!(mode === "abgedeckt" && !revealed)) {
        const mid           = start + angle / 2;
        const normalizedMid = ((mid % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        const flip          = normalizedMid > Math.PI / 2 && normalizedMid < (Math.PI * 3) / 2;

        ctx.save();
        ctx.translate(center, center);
        ctx.rotate(mid + (flip ? Math.PI : 0));
        ctx.fillStyle  = mode === "neon" ? "#000" : "rgba(255,255,255,0.92)";
        ctx.font       = "600 13px Inter, system-ui, sans-serif";
        ctx.textAlign  = flip ? "left" : "right";
        const text     = entry.length > 14 ? entry.slice(0, 14) + "…" : entry;
        ctx.fillText(text, flip ? -(radius - 14) : radius - 14, 5);
        ctx.restore();
      }
    });

    // Hub – größer wenn Gewinner angezeigt wird
    const hubR = winner && !spinning ? 52 : 14;
    ctx.beginPath();
    ctx.arc(center, center, hubR, 0, Math.PI * 2);
    ctx.fillStyle   = "rgba(5,6,10,0.9)";
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.lineWidth   = 1.5;
    ctx.stroke();

    // Gewinner-Text im Mittelpunkt
    if (winner && !spinning) {
      ctx.textAlign    = "center";
      ctx.textBaseline = "middle";

      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.font      = "500 8px Inter, sans-serif";
      ctx.fillText("ERGEBNIS", center, center - 14);

      ctx.fillStyle = "white";
      ctx.font      = `700 ${winner.length > 8 ? "11" : "13"}px Inter, sans-serif`;
      ctx.fillText(
        winner.length > 10 ? winner.slice(0, 10) + "…" : winner,
        center,
        center + 4
      );
    }
  }, [entries, rotation, winner, spinning, revealed, mode]);

  const dotColors = MODE_COLORS[mode] ?? MODE_COLORS.standard;

  return (
    <div className="wheelContainer">
      <div className="modeLabel">{mode}</div>
      
      <div className="wheelPanel">
        <div className="wheelWrapper">
          <div className="pointer" />
          <canvas
            ref={canvasRef}
            width={280}
            height={280}
            onClick={spin}
            className={spinning ? "" : "clickable"}
          />
        </div>

        <button
          className="spin"
          onClick={spin}
          disabled={spinning || entries.length === 0}
        >
          {spinning ? "läuft" : "drehen"}
        </button>
      </div>

      {modalOpen && (
        <div className="modalOverlay" onClick={closeModal}>
          <div className="modalBox" onClick={(e) => e.stopPropagation()}>
            <span className="modalLabel">Ergebnis</span>
            <span className="modalWinner">{winner}</span>
            <button className="modalOk" onClick={closeModal}>Ok</button>
          </div>
        </div>
      )}
    </div>
  );
}