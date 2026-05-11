export default function Mascot({ size = 40, className = '' }) {
  return (
    <div
      className={`flex items-center justify-center rounded-full bg-secondary-container/30 border border-outline-variant ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.6 }}
      role="img"
      aria-label="Tarvuz mascot"
    >
      🍉
    </div>
  )
}
