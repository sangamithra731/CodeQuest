const CROSSES = [
  { top: "6%", left: "3%", size: 14 },
  { top: "10%", left: "22%", size: 10 },
  { top: "4%", left: "70%", size: 12 },
  { top: "16%", left: "92%", size: 16 },
  { top: "38%", left: "88%", size: 12 },
  { top: "55%", left: "95%", size: 10 },
  { top: "70%", left: "6%", size: 12 },
  { top: "88%", left: "18%", size: 10 },
];

const DOTS = [
  { top: "3%", left: "45%" },
  { top: "20%", left: "8%" },
  { top: "28%", left: "60%" },
  { top: "45%", left: "12%" },
  { top: "60%", left: "80%" },
  { top: "80%", left: "50%" },
  { top: "92%", left: "85%" },
];

function Cross({ top, left, size }) {
  const thickness = Math.max(2, Math.round(size / 5));
  return (
    <div style={{ position: "absolute", top, left, width: size, height: size }}>
      <div
        style={{
          position: "absolute",
          top: (size - thickness) / 2,
          left: 0,
          width: size,
          height: thickness,
          background: "var(--cyan)",
          opacity: 0.5,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: (size - thickness) / 2,
          top: 0,
          height: size,
          width: thickness,
          background: "var(--cyan)",
          opacity: 0.5,
        }}
      />
    </div>
  );
}

function NightSky() {
  return (
    <>
      {CROSSES.map((c, i) => (
        <Cross key={`cross-${i}`} {...c} />
      ))}
      {DOTS.map((d, i) => (
        <div
          key={`dot-${i}`}
          style={{
            position: "absolute",
            top: d.top,
            left: d.left,
            width: 4,
            height: 4,
            background: "var(--cyan)",
            opacity: 0.6,
          }}
        />
      ))}
    </>
  );
}

export default NightSky;