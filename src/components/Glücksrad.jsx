import { useEffect, useRef, useState } from "react";
import "../styles/glücksrad.css";

const MODE_COLORS = {
  standard:    ["#5227ff","#7c3aed","#a855f7","#d946ef","#ec4899","#fb7185"],
  transparent: ["rgba(82,39,255,0.38)","rgba(124,58,237,0.38)","rgba(168,85,247,0.38)","rgba(217,70,239,0.38)","rgba(236,72,153,0.38)","rgba(251,113,133,0.38)"],
  neon:        ["#00e676","#00b0ff","#e040fb","#ffea00","#ff6d00","#ff1744"],
  minimal:     ["#2a2a38","#34344a","#3e3e5a","#48486a","#52527a","#5c5c8a"],
  abgedeckt:   ["#14141e","#14141e","#14141e","#14141e","#14141e","#14141e"],
};
const REVEAL_COLORS = ["#5227ff","#7c3aed","#a855f7","#d946ef","#ec4899","#fb7185"];

export default function Glücksrad({ mode = "standard", entries = [], onWinner, onRemoveWinner }) {
  const [rotation, setRotation]       = useState(0);
  const [spinning, setSpinning]       = useState(false);
  const [winner, setWinner]           = useState(null);
  const [winnerIndex, setWinnerIndex] = useState(null);
  const [modalOpen, setModalOpen]     = useState(false);
  const [revealed, setRevealed]       = useState(false);
  const [history, setHistory]         = useState([]);

  const canvasRef = useRef(null);

  const closeModal = () => setModalOpen(false);

  const handleRemove = () => {
    if (onRemoveWinner && winnerIndex !== null) {
      onRemoveWinner(entries[winnerIndex]?.id);
    }
    setModalOpen(false);
    setWinner(null);
    setWinnerIndex(null);
  };

  const spin = () => {
    if (spinning || entries.length === 0) return;
    setSpinning(true);
    setWinner(null);
    setWinnerIndex(null);
    setModalOpen(false);
    setRevealed(false);

    const spins     = 5 + Math.random() * 4;
    const stop      = Math.random() * 360;
    const start     = rotation;
    const final     = start + spins * 360 + stop; // immer vorwärts
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

      setWinner(won);
      setWinnerIndex(index);
      setRevealed(true);
      setSpinning(false);
      setHistory(prev => [won, ...prev].slice(0, 5));
      if (onWinner) onWinner(won);
      setTimeout(() => setModalOpen(true), 500);
    };

    requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx    = canvas.getContext("2d");
    const size   = canvas.width;
    const center = size / 2;
    const radius = center - 8;

    const colors =
      mode === "abgedeckt" && !revealed ? MODE_COLORS.abgedeckt
      : mode === "abgedeckt" && revealed ? REVEAL_COLORS
      : MODE_COLORS[mode] ?? MODE_COLORS.standard;

    ctx.clearRect(0, 0, size, size);

    if (entries.length === 0) {
      ctx.beginPath();
      ctx.arc(center, center, radius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.03)";
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.07)";
      ctx.lineWidth = 1;
      ctx.stroke();
      return;
    }

    const angle = (Math.PI * 2) / entries.length;

    entries.forEach((entry, i) => {
      const text  = entry?.text ?? entry;
      const start = i * angle + (rotation * Math.PI) / 180;
      const end   = start + angle;

      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, start, end);
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();
      ctx.strokeStyle = "rgba(5,6,10,0.5)";
      ctx.lineWidth   = 1.5;
      ctx.stroke();

      if (!(mode === "abgedeckt" && !revealed)) {
        const mid           = start + angle / 2;
        const normalizedMid = ((mid % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        const flip          = normalizedMid > Math.PI / 2 && normalizedMid < (Math.PI * 3) / 2;

        ctx.save();
        ctx.translate(center, center);
        ctx.rotate(mid + (flip ? Math.PI : 0));
        ctx.fillStyle = mode === "neon" ? "rgba(0,0,0,0.85)" : "rgba(255,255,255,0.92)";
        ctx.font      = "600 13px Inter, system-ui, sans-serif";
        ctx.textAlign = flip ? "left" : "right";
        const label   = text.length > 14 ? text.slice(0, 14) + "…" : text;
        ctx.fillText(label, flip ? -(radius - 14) : radius - 14, 5);
        ctx.restore();
      }
    });

    // Hub
    const hubR = winner && !spinning ? 52 : 14;
    ctx.beginPath();
    ctx.arc(center, center, hubR, 0, Math.PI * 2);
    ctx.fillStyle   = "rgba(5,6,10,0.92)";
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.1)";
    ctx.lineWidth   = 1;
    ctx.stroke();

    if (winner && !spinning) {
      ctx.textAlign    = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle    = "rgba(255,255,255,0.35)";
      ctx.font         = "500 8px Inter, sans-serif";
      ctx.fillText("ERGEBNIS", center, center - 14);
      ctx.fillStyle = "white";
      ctx.font      = `700 ${winner.length > 8 ? "11" : "13"}px Inter, sans-serif`;
      ctx.fillText(winner.length > 10 ? winner.slice(0, 10) + "…" : winner, center, center + 4);
    }
  }, [entries, rotation, winner, spinning, revealed, mode]);

  return (
    <div className="wheelContainer">
      <div className="wheelPanel">
        <div className="wheelWrapper">
          <div className="pointer" />
          <canvas
            ref={canvasRef}
            width={360}
            height={360}
            onClick={spin}
            className={spinning ? "" : "clickable"}
          />
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