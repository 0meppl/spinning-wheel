export default function MagicBento({ children }) {
  return (
    <div style={{
      width: "100%",
      padding: 20,
      borderRadius: 20,
      border: "1px solid rgba(255,255,255,0.1)",
      background: "rgba(0,0,0,0.2)",
      backdropFilter: "blur(10px)",
      marginBottom: 30
    }}>
      {children || null}
    </div>
  );
}