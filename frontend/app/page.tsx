"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GraphVisualization } from "@/components/graph-visualization"
import { ResultsTable } from "@/components/results-table"
import { ComplexitySection } from "@/components/complexity-section"
import { compareAlgorithms, runBenchmark, type ComparisonResponse, type BenchmarkResult } from "@/lib/api"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Play, Clock, GitBranch, BarChart3 } from "lucide-react"

const BENCHMARK_OPTIONS = [
  { value: "200", label: "200 nodes" },
  { value: "500", label: "500 nodes" },
  { value: "1000", label: "1,000 nodes" },
  { value: "10000", label: "10,000 nodes" },
  { value: "50000", label: "50,000 nodes" },
]

export default function HomePage() {
  const [numNodes, setNumNodes] = useState<number>(10)
  const [startNode, setStartNode] = useState<string>("V0")
  const [loading, setLoading] = useState<boolean>(false)
  const [benchmarkLoading, setBenchmarkLoading] = useState<boolean>(false)
  const [result, setResult] = useState<ComparisonResponse | null>(null)
  const [benchmarkData, setBenchmarkData] = useState<BenchmarkResult[]>([])
  const [error, setError] = useState<string | null>(null)
  const [benchmarkMaxNodes, setBenchmarkMaxNodes] = useState<string>("200")

  const handleCompare = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await compareAlgorithms(numNodes, startNode)
      setResult(data)
    } catch {
      setError("Backend tidak tersambung. Pastikan Flask berjalan di port 5000.")
    } finally {
      setLoading(false)
    }
  }, [numNodes, startNode])

  const handleBenchmark = useCallback(async () => {
    setBenchmarkLoading(true)
    setError(null)
    try {
      const data = await runBenchmark(Number.parseInt(benchmarkMaxNodes))
      setBenchmarkData(data.results)
    } catch {
      setError("Benchmark gagal. Pastikan Flask berjalan di port 5000.")
    } finally {
      setBenchmarkLoading(false)
    }
  }, [benchmarkMaxNodes])

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-8 space-y-4 sm:space-y-6">
        {/* Header - Responsive text sizes */}
        <header className="text-center space-y-2 sm:space-y-3 py-4 sm:py-6">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-400 text-xs sm:text-sm font-medium">
            <GitBranch className="w-3 h-3 sm:w-4 sm:h-4" />
            Graph Algorithm Comparison
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            Dijkstra vs Bellman-Ford
          </h1>
          <p className="text-slate-400 text-sm sm:text-lg max-w-xl mx-auto px-4">
            Bandingkan performa algoritma iteratif dan rekursif
          </p>
        </header>

        {/* Input Section - Responsive grid */}
        <Card className="border-slate-800 bg-slate-900/50 shadow-xl">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-white">
              <div className="p-1.5 sm:p-2 rounded-lg bg-blue-500/20">
                <Play className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
              </div>
              Konfigurasi Graf
            </CardTitle>
            <CardDescription className="text-slate-400 text-xs sm:text-sm">
              Tentukan jumlah node dan titik awal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-4">
              <div className="space-y-2 flex-1 sm:flex-none">
                <Label htmlFor="numNodes" className="text-xs sm:text-sm font-medium text-slate-300">
                  Jumlah Node (V)
                </Label>
                <Input
                  id="numNodes"
                  type="number"
                  min={1}
                  max={100}
                  value={numNodes}
                  onChange={(e) => setNumNodes(Math.max(1, Math.min(100, Number.parseInt(e.target.value) || 1)))}
                  className="w-full sm:w-28 bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <div className="space-y-2 flex-1 sm:flex-none">
                <Label htmlFor="startNode" className="text-xs sm:text-sm font-medium text-slate-300">
                  Node Awal
                </Label>
                <Input
                  id="startNode"
                  type="text"
                  value={startNode}
                  onChange={(e) => setStartNode(e.target.value)}
                  placeholder="V0"
                  className="w-full sm:w-28 bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <Button
                onClick={handleCompare}
                disabled={loading}
                className="gap-2 bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
              >
                <Play className="w-4 h-4" />
                {loading ? "Memproses..." : "Jalankan"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Benchmark Section - Responsive layout */}
        <Card className="border-slate-800 bg-slate-900/50 shadow-xl">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-white">
              <div className="p-1.5 sm:p-2 rounded-lg bg-cyan-500/20">
                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
              </div>
              Benchmark Performa
            </CardTitle>
            <CardDescription className="text-slate-400 text-xs sm:text-sm">
              Jalankan benchmark dengan berbagai ukuran input
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-4">
              <div className="space-y-2 flex-1 sm:flex-none">
                <Label className="text-xs sm:text-sm font-medium text-slate-300">Maksimum Node</Label>
                <Select value={benchmarkMaxNodes} onValueChange={setBenchmarkMaxNodes}>
                  <SelectTrigger className="w-full sm:w-44 bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="Pilih ukuran" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {BENCHMARK_OPTIONS.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        className="text-white hover:bg-slate-700 focus:bg-slate-700"
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleBenchmark}
                disabled={benchmarkLoading}
                variant="outline"
                className="gap-2 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20 w-full sm:w-auto bg-transparent"
              >
                <Clock className="w-4 h-4" />
                {benchmarkLoading ? "Benchmarking..." : "Run Benchmark"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl text-xs sm:text-sm">
            {error}
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className="space-y-4 sm:space-y-6">
            {/* Execution Time Cards - Better mobile layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <Card className="border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-blue-600/20">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-slate-300 font-medium">Dijkstra (Manual Heap)</p>
                      <p className="text-xl sm:text-3xl font-bold text-blue-400 mt-1">
                        {result.dijkstra.execution_time.toFixed(4)}{" "}
                        <span className="text-sm sm:text-lg font-normal">ms</span>
                      </p>
                    </div>
                    <div className="p-2 sm:p-3 rounded-xl bg-blue-500/30">
                      <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-cyan-600/20">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-slate-300 font-medium">Bellman-Ford (Rekursif)</p>
                      <p className="text-xl sm:text-3xl font-bold text-cyan-400 mt-1">
                        {result.bellman_ford.execution_time.toFixed(4)}{" "}
                        <span className="text-sm sm:text-lg font-normal">ms</span>
                      </p>
                    </div>
                    <div className="p-2 sm:p-3 rounded-xl bg-cyan-500/30">
                      <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Graph Visualization */}
            <GraphVisualization
              nodes={result.nodes}
              edges={result.edges}
              startNode={startNode.startsWith("V") ? startNode : "V0"}
            />

            {/* Results Tables - Stack on mobile */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
              <ResultsTable title="Dijkstra (Manual Heap)" result={result.dijkstra} variant="primary" />
              <ResultsTable title="Bellman-Ford (Rekursif)" result={result.bellman_ford} variant="accent" />
            </div>
          </div>
        )}

        {/* Benchmark Chart - Responsive height */}
        {benchmarkData.length > 0 && (
          <Card className="shadow-xl border-slate-800 bg-slate-900/50">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg text-white">
                Benchmark Performa (1-{benchmarkMaxNodes} Node)
              </CardTitle>
              <CardDescription className="text-slate-400 text-xs sm:text-sm">
                Perbandingan waktu eksekusi pada berbagai ukuran graf
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={benchmarkData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis
                      dataKey="num_nodes"
                      stroke="#94a3b8"
                      fontSize={10}
                      tickLine={false}
                      label={{
                        value: "Jumlah Node",
                        position: "insideBottom",
                        offset: -5,
                        fill: "#94a3b8",
                        fontSize: 10,
                      }}
                    />
                    <YAxis
                      stroke="#94a3b8"
                      fontSize={10}
                      tickLine={false}
                      label={{
                        value: "Waktu (ms)",
                        angle: -90,
                        position: "insideLeft",
                        fill: "#94a3b8",
                        fontSize: 10,
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                      labelStyle={{ color: "#f1f5f9" }}
                    />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                    <Line
                      type="monotone"
                      dataKey="dijkstra_time"
                      name="Dijkstra"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="bellman_ford_time"
                      name="Bellman-Ford"
                      stroke="#22d3d1"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Time Complexity Analysis */}
        <ComplexitySection />

        {/* Analysis Section - Responsive text */}
        <Card className="shadow-xl border-slate-800 bg-slate-900/50">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg text-white">Analisis Performa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-400 text-xs sm:text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <h4 className="font-semibold text-blue-400 mb-2">Dijkstra (Manual Heap)</h4>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Optimal untuk graf sparse</li>
                  <li>Tidak support bobot negatif</li>
                  <li>Iteratif - aman dari stack overflow</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-cyan-400 mb-2">Bellman-Ford (Rekursif)</h4>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Support bobot edge negatif</li>
                  <li>Rekursif - terbatas stack</li>
                  <li>Lebih lambat pada graf besar</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
