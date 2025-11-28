"use client"

import { useEffect, useRef, useCallback } from "react"
import type { Edge } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface GraphVisualizationProps {
  nodes: string[]
  edges: Edge[]
  startNode: string
}

interface NodePosition {
  x: number
  y: number
}

export function GraphVisualization({ nodes, edges, startNode }: GraphVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const calculateNodePositions = useCallback(
    (nodes: string[], width: number, height: number): Map<string, NodePosition> => {
      const positions = new Map<string, NodePosition>()
      const centerX = width / 2
      const centerY = height / 2
      const radius = Math.min(width, height) * 0.38

      nodes.forEach((node, index) => {
        const angle = (2 * Math.PI * index) / nodes.length - Math.PI / 2
        positions.set(node, {
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle),
        })
      })

      return positions
    },
    [],
  )

  const drawArrow = useCallback(
    (ctx: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number, nodeRadius: number) => {
      const angle = Math.atan2(toY - fromY, toX - fromX)
      const arrowLength = 10
      const arrowAngle = Math.PI / 6

      const endX = toX - nodeRadius * Math.cos(angle)
      const endY = toY - nodeRadius * Math.sin(angle)
      const startX = fromX + nodeRadius * Math.cos(angle)
      const startY = fromY + nodeRadius * Math.sin(angle)

      ctx.beginPath()
      ctx.moveTo(startX, startY)
      ctx.lineTo(endX, endY)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(endX, endY)
      ctx.lineTo(endX - arrowLength * Math.cos(angle - arrowAngle), endY - arrowLength * Math.sin(angle - arrowAngle))
      ctx.lineTo(endX - arrowLength * Math.cos(angle + arrowAngle), endY - arrowLength * Math.sin(angle + arrowAngle))
      ctx.closePath()
      ctx.fill()
    },
    [],
  )

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container || nodes.length === 0) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const containerWidth = container.clientWidth
    const canvasWidth = Math.min(containerWidth - 32, 600)
    const canvasHeight = Math.min(canvasWidth * 0.7, 400)

    canvas.width = canvasWidth
    canvas.height = canvasHeight

    const width = canvas.width
    const height = canvas.height
    const nodeRadius = Math.max(18, Math.min(28, 350 / nodes.length))

    ctx.fillStyle = "#0f172a"
    ctx.fillRect(0, 0, width, height)

    const positions = calculateNodePositions(nodes, width, height)

    edges.forEach((edge) => {
      const from = positions.get(edge.source)
      const to = positions.get(edge.target)
      if (from && to) {
        // Bright cyan/teal edges for visibility
        ctx.strokeStyle = "#22d3d1"
        ctx.fillStyle = "#22d3d1"
        ctx.lineWidth = 2
        drawArrow(ctx, from.x, from.y, to.x, to.y, nodeRadius)

        // Weight labels with white background for readability
        const midX = (from.x + to.x) / 2
        const midY = (from.y + to.y) / 2
        const weightText = edge.weight.toString()

        ctx.font = "bold 12px Inter, system-ui, sans-serif"
        const textWidth = ctx.measureText(weightText).width

        // Background pill for weight
        ctx.fillStyle = "#fef08a"
        ctx.beginPath()
        ctx.roundRect(midX - textWidth / 2 - 6, midY - 18, textWidth + 12, 18, 9)
        ctx.fill()

        // Weight text
        ctx.fillStyle = "#0f172a"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(weightText, midX, midY - 9)
      }
    })

    nodes.forEach((node) => {
      const pos = positions.get(node)
      if (!pos) return

      const isStart = node === startNode

      // Node circle with glow effect
      if (isStart) {
        // Glow for start node
        ctx.shadowColor = "#22c55e"
        ctx.shadowBlur = 15
      }

      ctx.beginPath()
      ctx.arc(pos.x, pos.y, nodeRadius, 0, 2 * Math.PI)

      // Start node: bright green, others: bright blue
      ctx.fillStyle = isStart ? "#22c55e" : "#3b82f6"
      ctx.fill()

      // Border
      ctx.strokeStyle = isStart ? "#86efac" : "#93c5fd"
      ctx.lineWidth = 3
      ctx.stroke()

      ctx.shadowBlur = 0

      // Node label - white text
      ctx.fillStyle = "#ffffff"
      ctx.font = `bold ${Math.max(11, 15 - nodes.length / 8)}px Inter, system-ui, sans-serif`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(node, pos.x, pos.y)
    })
  }, [nodes, edges, startNode, calculateNodePositions, drawArrow])

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Visualisasi Graf</CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={containerRef} className="flex justify-center w-full">
          <canvas ref={canvasRef} className="rounded-xl border-2 border-slate-700 max-w-full" />
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-4 text-xs sm:text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-green-300" />
            <span>Node Awal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-blue-300" />
            <span>Node Lain</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-cyan-400 rounded" />
            <span>Edge</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-4 bg-yellow-300 rounded-full text-[10px] flex items-center justify-center text-slate-900 font-bold">
              W
            </div>
            <span>Bobot</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
