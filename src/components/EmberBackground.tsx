type EmberType = "gold" | "orange" | "red";

const TYPES: EmberType[] = ["gold", "orange", "orange", "orange", "red"];

const EMBERS = Array.from({ length: 36 }, (_, i) => ({
  id: i,
  left: `${(i * 29 + 7) % 100}%`,
  delay: `${(i * 1.3) % 16}s`,
  duration: `${7 + (i * 1.7) % 11}s`,
  dx1: `${((i * 11) % 36) - 18}px`,
  dx2: `${((i * 19) % 40) - 20}px`,
  dx3: `${((i * 7) % 28) - 14}px`,
  size: i % 7 === 0 ? 4 : i % 4 === 0 ? 2 : 3,
  type: TYPES[i % TYPES.length],
}));

export default function EmberBackground() {
  return (
    <>
      <div className="fantasy-bg" />
      <div className="embers">
        {EMBERS.map((e) => (
          <div
            key={e.id}
            className={`ember ${e.type}`}
            style={{
              left: e.left,
              animationDelay: e.delay,
              animationDuration: e.duration,
              width: e.size,
              height: e.size,
              ["--dx1" as string]: e.dx1,
              ["--dx2" as string]: e.dx2,
              ["--dx3" as string]: e.dx3,
            }}
          />
        ))}
      </div>
    </>
  );
}
