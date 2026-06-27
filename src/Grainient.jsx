export default function Grainient() {
  return (
    <div style={{
      position: "absolute",
      inset: 0,
      background: "radial-gradient(circle at 20% 20%, #5227FF, transparent 40%), radial-gradient(circle at 80% 30%, #FF9FFC, transparent 40%), radial-gradient(circle at 50% 80%, #B497CF, transparent 50%)",
      filter: "blur(40px)",
      opacity: 0.8
    }} />
  );
}