import { CANVAS } from '../constants/config'

export function generatePositions(n) {
  const { width: W, height: H, nodePadding: pad, minNodeSpacing } = CANVAS

  if (n <= 10) {
    const cx = W / 2
    const cy = H / 2
    const r  = Math.min(W, H) / 2 - pad - 5
    return Array.from({ length: n }, (_, i) => ({
      x: cx + r * Math.cos((2 * Math.PI * i) / n - Math.PI / 2),
      y: cy + r * Math.sin((2 * Math.PI * i) / n - Math.PI / 2),
    }))
  }

  const positions = []
  for (let i = 0; i < n; i++) {
    let x, y, attempts = 0
    do {
      x = pad + Math.random() * (W - 2 * pad)
      y = pad + Math.random() * (H - 2 * pad)
      attempts++
    } while (
      positions.some(p => Math.hypot(p.x - x, p.y - y) < minNodeSpacing) &&
      attempts < 150
    )
    positions.push({ x, y })
  }
  return positions
}

export function euclidean(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
}