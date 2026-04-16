import { useRef, type ReactNode, type CSSProperties } from "react";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  intensity?: number;
};

export default function TiltCard({ children, className = "", style, intensity = 6 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const card = ref.current;
    const glow = glowRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotX = (y - 0.5) * -intensity;
    const rotY = (x - 0.5) * intensity;

    card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px) scale(1.01)`;

    if (glow) {
      glow.style.opacity = "1";
      glow.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(212,175,55,0.12) 0%, transparent 65%)`;
    }
  }

  function handleMouseLeave() {
    const card = ref.current;
    const glow = glowRef.current;
    if (!card) return;
    card.style.transition = "transform 0.55s cubic-bezier(0.23, 1, 0.32, 1), border-color 0.4s, box-shadow 0.4s";
    card.style.transform = "";
    if (glow) glow.style.opacity = "0";
    setTimeout(() => {
      if (card) card.style.transition = "";
    }, 560);
  }

  function handleMouseEnter() {
    const card = ref.current;
    if (!card) return;
    card.style.transition = "transform 0.08s linear, border-color 0.3s, box-shadow 0.3s";
  }

  return (
    <div
      ref={ref}
      className={`stone-card ${className}`}
      style={{ ...style, transformStyle: "preserve-3d", willChange: "transform" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      <div className="corner tl" /><div className="corner tr" />
      <div className="corner bl" /><div className="corner br" />
      <div
        ref={glowRef}
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0,
          transition: "opacity 0.3s",
          pointerEvents: "none",
          zIndex: 0,
          borderRadius: "inherit",
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}
