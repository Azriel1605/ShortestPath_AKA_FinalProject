"use client"

import type { AlgorithmResult } from "@/lib/api"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ResultsTableProps {
  title: string
  result: AlgorithmResult
  variant: "primary" | "accent"
}

export function ResultsTable({ title, result, variant }: ResultsTableProps) {
  const colorClass = variant === "primary" ? "text-blue-400" : "text-cyan-400"
  const borderClass = variant === "primary" ? "border-blue-500/30" : "border-cyan-500/30"
  const bgClass = variant === "primary" ? "bg-blue-500/20" : "bg-cyan-500/20"

  return (
    <Card className={`${borderClass} bg-slate-900/50`}>
      <CardHeader className="pb-2 sm:pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <CardTitle className={`text-sm sm:text-base ${colorClass}`}>{title}</CardTitle>
          <Badge className={bgClass} variant="outline">
            <span className={colorClass}>{result.execution_time.toFixed(4)} ms</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="max-h-48 sm:max-h-56 overflow-y-auto rounded-lg border border-slate-700">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-800/50 hover:bg-slate-800/50">
                <TableHead className="w-16 sm:w-20 text-[10px] sm:text-xs text-slate-400">Node</TableHead>
                <TableHead className="w-20 sm:w-24 text-[10px] sm:text-xs text-slate-400">Jarak</TableHead>
                <TableHead className="text-[10px] sm:text-xs text-slate-400">Sebelumnya</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.results.map((row) => (
                <TableRow key={row.node} className="text-xs sm:text-sm border-slate-700 hover:bg-slate-800/30">
                  <TableCell className="font-mono font-medium text-slate-200">{row.node}</TableCell>
                  <TableCell className="font-mono text-slate-300">{row.distance === -1 ? "∞" : row.distance}</TableCell>
                  <TableCell className="font-mono text-slate-400">{row.previous || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
