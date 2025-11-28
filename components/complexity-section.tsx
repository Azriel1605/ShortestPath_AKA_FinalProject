"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function ComplexitySection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
      <Card className="border-blue-500/30 bg-slate-900/50">
        <CardHeader className="pb-2 sm:pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <CardTitle className="text-blue-400 text-base sm:text-lg">Dijkstra (Manual Heap)</CardTitle>
            <Badge variant="outline" className="border-blue-500/50 text-blue-400 w-fit">
              Iteratif
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
          <div className="flex items-center justify-between p-2 sm:p-3 bg-blue-500/10 rounded-lg">
            <span className="text-slate-400">Time Complexity</span>
            <code className="font-mono font-bold text-blue-400">O(V × E)</code>
          </div>
          <div className="flex items-center justify-between p-2 sm:p-3 bg-slate-800/50 rounded-lg">
            <span className="text-slate-400">Space Complexity</span>
            <code className="font-mono font-semibold text-slate-300">O(V)</code>
          </div>
          <ul className="text-slate-400 space-y-1 text-[10px] sm:text-xs">
            <li>• Greedy dengan priority queue manual</li>
            <li>• Efisien untuk graf sparse</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="border-cyan-500/30 bg-slate-900/50">
        <CardHeader className="pb-2 sm:pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <CardTitle className="text-cyan-400 text-base sm:text-lg">Bellman-Ford (Rekursif)</CardTitle>
            <Badge variant="outline" className="border-cyan-500/50 text-cyan-400 w-fit">
              Rekursif
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
          <div className="flex items-center justify-between p-2 sm:p-3 bg-cyan-500/10 rounded-lg">
            <span className="text-slate-400">Time Complexity</span>
            <code className="font-mono font-bold text-cyan-400">O(V²)</code>
          </div>
          <div className="flex items-center justify-between p-2 sm:p-3 bg-slate-800/50 rounded-lg">
            <span className="text-slate-400">Space Complexity</span>
            <code className="font-mono font-semibold text-slate-300">O(V)</code>
          </div>
          <ul className="text-slate-400 space-y-1 text-[10px] sm:text-xs">
            <li>• Relaksasi iterasi dengan rekursi</li>
            <li>• Support bobot edge negatif</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
