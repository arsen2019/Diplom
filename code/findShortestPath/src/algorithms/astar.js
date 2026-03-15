import { euclidean } from '../utils/positionUtils'


export function runAstar(matrix, source, target, positions) {
  const n      = matrix.length
  const g      = new Array(n).fill(Infinity)
  const f      = new Array(n).fill(Infinity)
  const prev   = new Array(n).fill(null)
  const closed = new Array(n).fill(false)
  const open   = new Array(n).fill(false)
  const steps  = []

  let minCostPerPixel = Infinity
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (matrix[i][j] > 0 && positions[i] && positions[j]) {
        const px = euclidean(positions[i], positions[j])
        if (px > 0) minCostPerPixel = Math.min(minCostPerPixel, matrix[i][j] / px)
      }
    }
  }
  if (!isFinite(minCostPerPixel)) minCostPerPixel = 0.01

  const h = (node) => {
    if (!positions?.[node] || !positions?.[target]) return 0
    return euclidean(positions[node], positions[target]) * minCostPerPixel
  }

  const fmt = (v) => (v === Infinity ? '∞' : v.toFixed(2))

  const snapshot = (phase, current, neighbor, desc) =>
    steps.push({
      phase,
      g:       [...g],
      f:       [...f],
      prev:    [...prev],
      closed:  [...closed],
      open:    [...open],
      current,
      neighbor,
      desc,
    })

  g[source]    = 0
  f[source]    = h(source)
  open[source] = true

  const hSource = h(source)
  snapshot('init', null, null,
    `INIT — A* uses f(n) = g(n) + h(n) to guide the search. ` +
    `g(n) is the exact cost paid so far to reach n. ` +
    `h(n) is the heuristic: admissible scaled Euclidean distance to the target (never over-estimates). ` +
    `Set g[${source}] = 0, h(${source}) = ${fmt(hSource)}, so f[${source}] = ${fmt(hSource)}. ` +
    `Add node ${source} to the open set.`)

  // ── Main loop ───────────────────────────────────────────
  while (open.some(Boolean)) {
    // Pick open node with lowest f-value
    let u = -1
    for (let v = 0; v < n; v++) {
      if (open[v] && (u === -1 || f[v] < f[u])) u = v
    }
    if (u === -1) break

    if (u === target) {
      open[u]   = false
      closed[u] = true
      snapshot('done', u, null,
        `DONE — Target node ${target} has been selected from the open set with f = ${fmt(f[u])}. ` +
        `The actual path cost is g[${target}] = ${fmt(g[target])}. ` +
        `A* is complete: when the target is dequeued, its g-value is the optimal cost ` +
        `because our heuristic is admissible.`)
      break
    }

    open[u]   = false
    closed[u] = true

    snapshot('expand', u, null,
      `EXPAND — Select node ${u} from open set (lowest f). ` +
      `g[${u}] = ${fmt(g[u])} (exact cost from source). ` +
      `h(${u}) = ${fmt(h(u))} (heuristic: estimated cost to target). ` +
      `f[${u}] = g + h = ${fmt(g[u])} + ${fmt(h(u))} = ${fmt(f[u])}. ` +
      `Move to closed set and examine all neighbours.`)

    for (let v = 0; v < n; v++) {
      if (matrix[u][v] > 0 && !closed[v]) {
        const tentG  = g[u] + matrix[u][v]
        const hv     = h(v)
        const prevGv = g[v]

        if (tentG < g[v]) {
          g[v]    = tentG
          f[v]    = tentG + hv
          prev[v] = u
          if (!open[v]) open[v] = true
          snapshot('relax', u, v,
            `UPDATE (${u} → ${v}) — Tentative g[${v}] = g[${u}] + w(${u},${v}) = ${fmt(g[u])} + ${matrix[u][v]} = ${fmt(tentG)}. ` +
            `This BEATS previous g[${v}] = ${prevGv === Infinity ? '∞' : fmt(prevGv)}, so we update. ` +
            `h(${v}) = ${fmt(hv)} (heuristic to target). ` +
            `New f[${v}] = ${fmt(tentG)} + ${fmt(hv)} = ${fmt(f[v])}. ` +
            `Set prev[${v}] = ${u}. Node ${v} added/updated in open set.`)
        } else {
          snapshot('skip', u, v,
            `SKIP (${u} → ${v}) — Tentative g[${v}] = g[${u}] + w(${u},${v}) = ${fmt(g[u])} + ${matrix[u][v]} = ${fmt(tentG)}. ` +
            `Does NOT improve on g[${v}] = ${g[v] === Infinity ? '∞' : fmt(g[v])}. ` +
            `The path through ${u} is more expensive — no update needed.`)
        }
      }
    }
  }

  return { steps, path: reconstructPath(prev, source, target, g) }
}


function reconstructPath(prev, source, target, costArr) {
  if (costArr[target] === Infinity) return []
  const path = []
  let cur = target
  while (cur !== null) {
    path.unshift(cur)
    if (cur === source) break
    cur = prev[cur]
  }
  return path[0] === source ? path : []
}