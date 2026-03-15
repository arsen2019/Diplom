
export function runDijkstra(matrix, source, target) {
  const n       = matrix.length
  const dist    = new Array(n).fill(Infinity)
  const prev    = new Array(n).fill(null)
  const visited = new Array(n).fill(false)
  const inQueue = new Array(n).fill(false)
  const steps   = []

  const snapshot = (phase, current, neighbor, desc) =>
    steps.push({
      phase,
      dist:     [...dist],
      prev:     [...prev],
      visited:  [...visited],
      inQueue:  [...inQueue],
      current,
      neighbor,
      desc,
    })

  // ── Initialisation ──────────────────────────────────────
  dist[source]    = 0
  inQueue[source] = true
  snapshot('init', null, null,
    `INIT — Set dist[${source}] = 0 because the cost to reach the source from itself is zero. ` +
    `All other nodes are set to ∞ (unreachable until proven otherwise). ` +
    `Node ${source} is added to the priority queue as the only known reachable node.`)

  for (let iter = 0; iter < n; iter++) {
    // Pick unvisited node with minimum distance
    let u = -1
    for (let v = 0; v < n; v++) {
      if (!visited[v] && dist[v] < Infinity && (u === -1 || dist[v] < dist[u]))
        u = v
    }
    if (u === -1) break

    visited[u]  = true
    inQueue[u]  = false

    snapshot('dequeue', u, null,
      `DEQUEUE — Extract node ${u} with dist = ${dist[u]} (the smallest known distance in the queue). ` +
      `Greedy key insight: because all edge weights are non-negative, no future path can ever ` +
      `improve on dist[${u}] = ${dist[u]}, so we permanently mark it as finalised (visited).`)

    if (u === target) {
      snapshot('done', u, null,
        `DONE — Target node ${target} has been dequeued with dist = ${dist[target]}. ` +
        `This is guaranteed to be the shortest path cost because Dijkstra's greedy selection ` +
        `ensures every dequeued node has its optimal distance finalised.`)
      break
    }

    for (let v = 0; v < n; v++) {
      if (matrix[u][v] > 0 && !visited[v]) {
        const alt      = dist[u] + matrix[u][v]
        const prevDist = dist[v]

        if (alt < dist[v]) {
          dist[v] = alt
          prev[v] = u
          if (!inQueue[v]) inQueue[v] = true
          snapshot('relax', u, v,
            `RELAX (${u} → ${v}) — New candidate: dist[${u}] + w(${u},${v}) = ${dist[u]} + ${matrix[u][v]} = ${alt}. ` +
            `This beats the previous dist[${v}] = ${prevDist === Infinity ? '∞' : prevDist}, so we UPDATE dist[${v}] = ${alt} ` +
            `and record prev[${v}] = ${u} (meaning: the best known path to ${v} goes through ${u}). ` +
            `Node ${v} is added/updated in the queue.`)
        } else {
          snapshot('skip', u, v,
            `SKIP (${u} → ${v}) — Candidate: dist[${u}] + w(${u},${v}) = ${dist[u]} + ${matrix[u][v]} = ${alt}. ` +
            `This does NOT improve on dist[${v}] = ${dist[v] === Infinity ? '∞' : dist[v]}, so no update is made. ` +
            `The current path to ${v} is already at least as good as going through ${u}.`)
        }
      }
    }
  }

  return { steps, path: reconstructPath(prev, source, target, dist) }
}


function reconstructPath(prev, source, target, dist) {
  if (dist[target] === Infinity) return []
  const path = []
  let cur = target
  while (cur !== null) {
    path.unshift(cur)
    if (cur === source) break
    cur = prev[cur]
  }
  return path[0] === source ? path : []
}