const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export interface NodeResult {
  node: string
  distance: number
  previous: string | null
}

export interface AlgorithmResult {
  results: NodeResult[]
  execution_time: number
}

export interface Edge {
  source: string
  target: string
  weight: number
}

export interface ComparisonResponse {
  dijkstra: AlgorithmResult
  bellman_ford: AlgorithmResult
  graph: Record<string, [string, number][]>
  nodes: string[]
  edges: Edge[]
}

export interface BenchmarkResult {
  num_nodes: number
  dijkstra_time: number
  bellman_ford_time: number
}

export interface BenchmarkResponse {
  results: BenchmarkResult[]
}

export async function compareAlgorithms(numNodes: number, startNode: string): Promise<ComparisonResponse> {
  const response = await fetch(`${API_URL}/api/compare`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ num_nodes: numNodes, start_node: startNode }),
  })

  if (!response.ok) {
    throw new Error("Failed to compare algorithms")
  }

  return response.json()
}

export async function runBenchmark(maxNodes = 200): Promise<BenchmarkResponse> {
  const response = await fetch(`${API_URL}/api/benchmark`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ max_nodes: maxNodes }),
  })

  if (!response.ok) {
    throw new Error("Failed to run benchmark")
  }

  return response.json()
}
