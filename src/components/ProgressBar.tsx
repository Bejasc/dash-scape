import './components.css'

export function ProgressBar({ pct, label }: { pct: number; label?: string }) {
  const clamped = Math.max(0, Math.min(100, pct))
  return (
    <div className="progress-outer">
      <div className="progress-inner" style={{ width: `${clamped}%` }} />
      <div className="progress-label">{label ?? `${clamped.toFixed(1)}%`}</div>
    </div>
  )
}
