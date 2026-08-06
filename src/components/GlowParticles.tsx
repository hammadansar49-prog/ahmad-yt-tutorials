const particles = [
  { top: "8%", left: "12%", size: 180, color: "#3b82f6", opacity: 0.35, blur: 40, duration: 14, delay: 0, dx: 30, dy: -20 },
  { top: "20%", left: "78%", size: 140, color: "#ff6a3d", opacity: 0.28, blur: 36, duration: 12, delay: 1.5, dx: -25, dy: 25 },
  { top: "55%", left: "5%", size: 220, color: "#22d3ee", opacity: 0.22, blur: 50, duration: 16, delay: 0.5, dx: 20, dy: 30 },
  { top: "70%", left: "60%", size: 160, color: "#3b82f6", opacity: 0.3, blur: 38, duration: 13, delay: 2, dx: -30, dy: -15 },
  { top: "35%", left: "45%", size: 120, color: "#ff8a1c", opacity: 0.2, blur: 32, duration: 11, delay: 3, dx: 15, dy: 20 },
  { top: "85%", left: "20%", size: 150, color: "#22d3ee", opacity: 0.25, blur: 34, duration: 15, delay: 1, dx: -20, dy: -25 },
  { top: "5%", left: "55%", size: 100, color: "#ff6a3d", opacity: 0.22, blur: 28, duration: 10, delay: 2.5, dx: 25, dy: 15 },
  { top: "45%", left: "90%", size: 130, color: "#3b82f6", opacity: 0.25, blur: 32, duration: 12.5, delay: 0.8, dx: -18, dy: 22 },
  { top: "90%", left: "80%", size: 170, color: "#22d3ee", opacity: 0.2, blur: 42, duration: 17, delay: 3.5, dx: 22, dy: -18 },
  { top: "62%", left: "32%", size: 90, color: "#ff8a1c", opacity: 0.18, blur: 24, duration: 9, delay: 1.2, dx: -15, dy: 18 },
];

export default function GlowParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p, i) => (
        <span
          key={i}
          className="glow-particle"
          style={
            {
              top: p.top,
              left: p.left,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              "--glow-opacity": p.opacity,
              "--glow-blur": `${p.blur}px`,
              "--glow-duration": `${p.duration}s`,
              "--glow-delay": `${p.delay}s`,
              "--glow-drift-x": `${p.dx}px`,
              "--glow-drift-y": `${p.dy}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
