import { useEffect, useRef, useState } from "react";
import { trackSpin } from "../utils/stats";
import "../styles/glücksrad.css";

const MODE_COLORS = {
  standard:    ["#4f46e5","#7c3aed","#9333ea","#c026d3","#db2777","#e11d48"],
  transparent: ["rgba(79,70,229,0.42)","rgba(124,58,237,0.42)","rgba(147,51,234,0.42)","rgba(192,38,211,0.42)","rgba(219,39,119,0.42)","rgba(225,29,72,0.42)"],
  neon:        ["#22d3ee","#818cf8","#a78bfa","#f472b6","#fb923c","#4ade80"],
  minimal:     ["#1e1e28","#28283a","#32324c","#3c3c5e","#464670","#505082"],
  abgedeckt:   ["#141420","#141420","#141420","#141420","#141420","#141420"],
};
const REVEAL_COLORS = ["#4f46e5","#7c3aed","#9333ea","#c026d3","#db2777","#e11d48"];

export default function Glücksrad({ mode = "standard", entries = [], onWinner, onRemoveWinner }) {
  const [rotation, setRotation]       = useState(0);
  const [spinning, setSpinning]       = useState(false);
  const [winner, setWinner]           = useState(null);
  const [winnerIndex, setWinnerIndex] = useState(null);
  const [modalOpen, setModalOpen]     = useState(false);
  const [revealed, setRevealed]       = useState(false);
  const [history, setHistory]         = useState([]);
  const [hubR, setHubR]               = useState(14);

  const canvasRef = useRef(null);
  const hubRRef   = useRef(14);
  const hubRafRef = useRef(null);

  const closeModal   = () => setModalOpen(false);
  const handleRemove = () => {
    if (onRemoveWinner && winnerIndex !== null) onRemoveWinner(entries[winnerIndex]?.id);
    setModalOpen(false); setWinner(null); setWinnerIndex(null);
  };

  const spin = () => {
    if (spinning || entries.length === 0) return;
    setSpinning(true); setWinner(null); setWinnerIndex(null);
    setModalOpen(false); setRevealed(false);

    const spins     = 5 + Math.random() * 4;
    const stop      = Math.random() * 360;
    const start     = rotation;
    const final     = start + spins * 360 + stop;
    const duration  = 4000;
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
      const won          = entries[index]?.text ?? entries[index];

      setWinner(won); setWinnerIndex(index); setRevealed(true); setSpinning(false);
      setHistory(prev => [won, ...prev].slice(0, 5));
      if (onWinner) onWinner(won);
      trackSpin(mode, won); // ← Stats tracken
      setTimeout(() => setModalOpen(true), 450);
    };
    requestAnimationFrame(animate);
  };

  // Leertaste → spin
  useEffect(() => {
    const onKey = (e) => {
      if (e.code === "Space" && !["INPUT","TEXTAREA","SELECT"].includes(document.activeElement?.tagName)) {
        e.preventDefault(); spin();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [spinning, entries, rotation]);

  // Hub-Radius animieren
  useEffect(() => {
    const target = winner && !spinning ? 52 : 14;
    if (hubRafRef.current) cancelAnimationFrame(hubRafRef.current);
    const animate = () => {
      const diff = target - hubRRef.current;
      if (Math.abs(diff) > 0.25) {
        hubRRef.current += diff * 0.2;
        setHubR(hubRRef.current);
        hubRafRef.current = requestAnimationFrame(animate);
      } else {
        hubRRef.current = target; setHubR(target);
      }
    };
    hubRafRef.current = requestAnimationFrame(animate);
    return () => { if (hubRafRef.current) cancelAnimationFrame(hubRafRef.current); };
  }, [winner, spinning]);

  // Canvas zeichnen
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const size = canvas.width, center = size / 2, radius = center - 8;

    const colors =
      mode === "abgedeckt" && !revealed ? MODE_COLORS.abgedeckt
      : mode === "abgedeckt" && revealed ? REVEAL_COLORS
      : MODE_COLORS[mode] ?? MODE_COLORS.standard;

    ctx.clearRect(0, 0, size, size);

    if (entries.length === 0) {
      ctx.beginPath(); ctx.arc(center, center, radius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.03)"; ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.07)"; ctx.lineWidth = 1; ctx.stroke();
      return;
    }

    const angle = (Math.PI * 2) / entries.length;

    entries.forEach((entry, i) => {
      const text  = entry?.text ?? entry;
      const start = i * angle + (rotation * Math.PI) / 180;
      const end   = start + angle;

      ctx.beginPath(); ctx.moveTo(center, center);
      ctx.arc(center, center, radius, start, end);
      ctx.fillStyle = colors[i % colors.length]; ctx.fill();
      ctx.strokeStyle = "rgba(5,6,10,0.5)"; ctx.lineWidth = 1.5; ctx.stroke();

      if (!(mode === "abgedeckt" && !revealed)) {
        const mid = start + angle / 2;
        const nm  = ((mid % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        const flip = nm > Math.PI / 2 && nm < (Math.PI * 3) / 2;
        ctx.save();
        ctx.translate(center, center);
        ctx.rotate(mid + (flip ? Math.PI : 0));
        ctx.fillStyle = mode === "neon" ? "rgba(0,0,0,0.85)" : "rgba(255,255,255,0.9)";
        ctx.font = "600 13px Inter, system-ui, sans-serif";
        ctx.textAlign = flip ? "left" : "right";
        const label = text.length > 14 ? text.slice(0, 14) + "…" : text;
        ctx.fillText(label, flip ? -(radius - 14) : radius - 14, 5);
        ctx.restore();
      }
    });

    ctx.beginPath(); ctx.arc(center, center, hubR, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(5,6,10,0.92)"; ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.1)"; ctx.lineWidth = 1; ctx.stroke();

    if (winner && !spinning && hubR > 30) {
      const a = Math.min(1, (hubR - 30) / 22);
      ctx.globalAlpha = a;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillStyle = "rgba(255,255,255,0.35)"; ctx.font = "500 8px Inter, sans-serif";
      ctx.fillText("ERGEBNIS", center, center - 14);
      ctx.fillStyle = "white";
      ctx.font = `700 ${winner.length > 8 ? "11" : "13"}px Inter, sans-serif`;
      ctx.fillText(winner.length > 10 ? winner.slice(0, 10) + "…" : winner, center, center + 4);
      ctx.globalAlpha = 1;
    }
  }, [entries, rotation, winner, spinning, revealed, mode, hubR]);

  return (
    <div className="wheelContainer">
      <div className="wheelPanel">
        <div className="wheelWrapper">
          <div className="pointer" />
          <canvas ref={canvasRef} width={360} height={360} onClick={spin} className={spinning ? "" : "clickable"} />
        </div>

        <button className="spin" onClick={spin} disabled={spinning || entries.length === 0}>
          {spinning ? "läuft" : "drehen"}
        </button>

        {history.length > 0 && (
          <div className="history">
            <span className="historyLabel">Verlauf</span>
            <div className="historyList">
              {history.map((h, i) => (
                <span key={i} className="historyItem" style={{ opacity: 1 - i * 0.17 }}>{h}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="modalOverlay" onClick={closeModal}>
          <div className="modalBox" onClick={e => e.stopPropagation()}>
            <span className="modalLabel">Ergebnis</span>
            <span className="modalWinner">{winner}</span>
            <div className="modalActions">
              <button className="modalRemove" onClick={handleRemove}>Aus Rad entfernen</button>
              <button className="modalOk" onClick={closeModal}>Ok</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}