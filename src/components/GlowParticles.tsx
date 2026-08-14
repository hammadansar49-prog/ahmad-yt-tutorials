const particles = [
  { top: "8%", left: "12%", size: 180, color: "#3b82f6", opacity: 0.3, blur: 30, duration: 14, delay: 0, dx: 30, dy: -20 },
  { top: "55%", left: "5%", size: 200, color: "#3b82f6", opacity: 0.2, blur: 34, duration: 16, delay: 0.5, dx: 20, dy: 30 },
  { top: "70%", left: "60%", size: 150, color: "#3b82f6", opacity: 0.26, blur: 28, duration: 13, delay: 2, dx: -30, dy: -15 },
  { top: "90%", left: "80%", size: 160, color: "#3b82f6", opacity: 0.18, blur: 30, duration: 17, delay: 3.5, dx: 22, dy: -18 },
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
