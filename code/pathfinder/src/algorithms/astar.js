import { euclidean } from '../utils/positionUtils'

/**
 * A* shortest-path algorithm with full step recording.
 *
 * Heuristic: admissible scaled Euclidean distance.
 * Scale = min(edgeWeight / edgePixelLength) over all real edges.
 * This puts h in the same magnitude as actual edge weights, making
 * A* visibly different from Dijkstra while staying admissible.
 *
 * @param {number[][]}              matrix    - Weighted adjacency matrix
 * @param {number}                  source    - Source node index
 * @param {number}                  target    - Target node index
 * @param {{ x:number, y:number }[]} positions - Node 2-D coordinates
 * @returns {{ steps: Step[], path: number[] }}
 *
 * Step shape:
 * {
 *   phase:    'init' | 'expand' | 'relax' | 'skip' | 'done'
 *   g:        number[]        // g-cost (actual cost from source)
 *   f:        number[]        // f-cost = g + h
 *   prev:     (number|null)[]
 *   closed:   boolean[]
 *   open:     boolean[]
 *   current:  number | null
 *   neighbor: number | null
 *   desc:     string
 * }
 */
export function runAstar(matrix, source, target, positions) {
  const n      = matrix.length
  const g      = new Array(n).fill(Infinity)
  const f      = new Array(n).fill(Infinity)
  const prev   = new Array(n).fill(null)
  const closed = new Array(n).fill(false)
  const open   = new Array(n).fill(false)
  const steps  = []

  // ── Heuristic: admissible scaled Euclidean ───────────────
  //
  // We need h to be in the same unit as edge weights so it
  // actually influences node selection.
  //
  // Strategy: compute the minimum (weight / pixelLength) ratio
  // over every real edge in the graph. This is the cheapest any
  // path can be per canvas pixel, so:
  //
  //   h(n) = euclidean(n, target) * minCostPerPixel
  //
  // is guaranteed admissible (never over-estimates) and is large
  // enough to meaningfully differentiate A* from Dijkstra.
  let minCostPerPixel = Infinity
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (matrix[i][j] > 0 && positions[i] && positions[j]) {
        const px = euclidean(positions[i], positions[j])
        if (px > 0) minCostPerPixel = Math.min(minCostPerPixel, matrix[i][j] / px)
      }
    }
  }
  // Fallback if no edges have computable length
  if (!isFinite(minCostPerPixel)) minCostPerPixel = 0.01

  const h = (node) => {
    if (!positions?.[node] || !positions?.[target]) return 0
    return euclidean(positions[node], positions[target]) * minCostPerPixel
  }

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

  const fmt = (v) => (v === Infinity ? '∞' : v.toFixed(2))

  // ── Initialisation ──────────────────────────────────────
  g[source]    = 0
  f[source]    = h(source)
  open[source] = true
  snapshot('init', null, null,
    `Initialise: g[${source}] = 0, h(${source}) = ${fmt(h(source))}, f[${source}] = ${fmt(f[source])}. Add ${source} to open set.`)

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
        `Target ${target} reached. Path cost g[${target}] = ${fmt(g[target])}.`)
      break
    }

    open[u]   = false
    closed[u] = true

    snapshot('expand', u, null,
      `Expand node ${u}: g = ${fmt(g[u])}, h = ${fmt(h(u))}, f = ${fmt(f[u])}.`)

    // ── Relax neighbours ──────────────────────────────────
    for (let v = 0; v < n; v++) {
      if (matrix[u][v] > 0 && !closed[v]) {
        const tentG = g[u] + matrix[u][v]
        const hv    = h(v)

        if (tentG < g[v]) {
          g[v]    = tentG
          f[v]    = tentG + hv
          prev[v] = u
          if (!open[v]) open[v] = true
          snapshot('relax', u, v,
            `Update ${v}: g = ${fmt(tentG)}, h = ${fmt(hv)}, f = ${fmt(f[v])}. ✓ Improved.`)
        } else {
          snapshot('skip', u, v,
            `Check (${u} → ${v}): tentG = ${fmt(tentG)} ≥ g[${v}] = ${fmt(g[v])}. No update.`)
        }
      }
    }
  }

  return { steps, path: reconstructPath(prev, source, target, g) }
}

// ── Shared helper ────────────────────────────────────────

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
