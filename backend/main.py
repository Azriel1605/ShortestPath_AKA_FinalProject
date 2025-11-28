from flask import Flask, request, jsonify
from flask_cors import CORS
from typing import Dict, List, Tuple, Optional
import random
import time
import os
import sys
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# CORS configuration from .env
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
CORS(app, origins=[frontend_url], supports_credentials=True)

# Increase recursion limit for large graphs
sys.setrecursionlimit(100000)


class MinHeap:
    def __init__(self):
        self.data = []  # array heap

    def push(self, item):  # item = (distance, node)
        self.data.append(item)
        self._heapify_up(len(self.data) - 1)

    def pop(self):
        if not self.data:
            return None
        self._swap(0, len(self.data) - 1)
        item = self.data.pop()
        self._heapify_down(0)
        return item

    def _heapify_up(self, idx):
        parent = (idx - 1) // 2
        while idx > 0 and self.data[idx][0] < self.data[parent][0]:
            self._swap(idx, parent)
            idx = parent
            parent = (idx - 1) // 2

    def _heapify_down(self, idx):
        n = len(self.data)
        while True:
            left = 2 * idx + 1
            right = 2 * idx + 2
            smallest = idx

            if left < n and self.data[left][0] < self.data[smallest][0]:
                smallest = left
            if right < n and self.data[right][0] < self.data[smallest][0]:
                smallest = right

            if smallest == idx:
                break

            self._swap(idx, smallest)
            idx = smallest

    def _swap(self, i, j):
        self.data[i], self.data[j] = self.data[j], self.data[i]

    def __len__(self):
        return len(self.data)


def generate_random_graph(num_nodes: int) -> Tuple[List[List[Tuple[int, int]]], List[Tuple[int, int, int]]]:
    """Generate a random directed graph with weighted edges using index-based representation"""
    graph = [[] for _ in range(num_nodes)]
    edges_list = []  # List of (u, v, w) tuples for Bellman-Ford
    
    # Ensure connectivity: create a spanning tree first
    for i in range(1, num_nodes):
        source = random.randint(0, i - 1)
        target = i
        weight = random.randint(1, 20)
        graph[source].append((target, weight))
        edges_list.append((source, target, weight))
    
    # Add additional random edges (approximately E = V * 1.5)
    num_extra_edges = max(1, int(num_nodes * 0.5))
    for _ in range(num_extra_edges):
        source = random.randint(0, num_nodes - 1)
        target = random.randint(0, num_nodes - 1)
        if source != target:
            weight = random.randint(1, 20)
            # Avoid duplicate edges
            if not any(neighbor == target for neighbor, _ in graph[source]):
                graph[source].append((target, weight))
                edges_list.append((source, target, weight))
    
    return graph, edges_list


def dijkstra_manual_heap(n: int, graph: List[List[Tuple[int, int]]], start: int) -> Tuple[List[float], List[Optional[int]], float]:
    """
    Dijkstra's algorithm using manual MinHeap - O(V x E)
    """
    start_time = time.perf_counter()
    
    INF = float('inf')
    dist = [INF] * n
    prev = [None] * n
    dist[start] = 0
    
    heap = MinHeap()
    heap.push((0, start))  # (distance, node)
    
    while len(heap) > 0:
        cur_dist, u = heap.pop()
        
        if cur_dist > dist[u]:
            continue
        
        for v, w in graph[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                prev[v] = u
                heap.push((dist[v], v))
    
    execution_time = time.perf_counter() - start_time
    return dist, prev, execution_time


def bellman_ford_recursive(n: int, edges: List[Tuple[int, int, int]], start: int) -> Tuple[List[float], List[Optional[int]], float]:
    """
    Bellman-Ford recursive implementation - O(V^2)
    """
    start_time = time.perf_counter()
    
    INF = float('inf')
    dist = [INF] * n
    prev = [None] * n
    dist[start] = 0
    
    def relax(iteration):
        if iteration == n - 1:
            return
        changed = False
        for u, v, w in edges:
            if dist[u] != INF and dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                prev[v] = u
                changed = True
        if changed:
            relax(iteration + 1)
    
    relax(0)
    
    execution_time = time.perf_counter() - start_time
    return dist, prev, execution_time


@app.route("/")
def root():
    return jsonify({"message": "Graph Algorithm Comparison API (Flask)", "status": "running"})


@app.route("/api/compare", methods=["POST"])
def compare_algorithms():
    """Run both algorithms and return comparison results"""
    data = request.get_json()
    num_nodes = data.get("num_nodes", 10)
    start_node_str = data.get("start_node", "V0")
    
    # Parse start node index
    try:
        start_node = int(start_node_str.replace("V", ""))
        if start_node < 0 or start_node >= num_nodes:
            start_node = 0
    except:
        start_node = 0
    
    # Generate random graph
    graph, edges_list = generate_random_graph(num_nodes)
    
    # Run Dijkstra's algorithm with manual heap
    dijkstra_dist, dijkstra_prev, dijkstra_time = dijkstra_manual_heap(num_nodes, graph, start_node)
    
    # Run Bellman-Ford recursive algorithm
    bf_dist, bf_prev, bf_time = bellman_ford_recursive(num_nodes, edges_list, start_node)
    
    # Format results with node names
    nodes = [f"V{i}" for i in range(num_nodes)]
    
    dijkstra_results = [
        {
            "node": f"V{i}",
            "distance": dijkstra_dist[i] if dijkstra_dist[i] != float('inf') else -1,
            "previous": f"V{dijkstra_prev[i]}" if dijkstra_prev[i] is not None else None
        }
        for i in range(num_nodes)
    ]
    
    bf_results = [
        {
            "node": f"V{i}",
            "distance": bf_dist[i] if bf_dist[i] != float('inf') else -1,
            "previous": f"V{bf_prev[i]}" if bf_prev[i] is not None else None
        }
        for i in range(num_nodes)
    ]
    
    # Format edges for visualization
    edges = [
        {"source": f"V{u}", "target": f"V{v}", "weight": w}
        for u, v, w in edges_list
    ]
    
    # Format graph for response
    graph_dict = {
        f"V{i}": [(f"V{v}", w) for v, w in graph[i]]
        for i in range(num_nodes)
    }
    
    return jsonify({
        "dijkstra": {"results": dijkstra_results, "execution_time": dijkstra_time * 1000},
        "bellman_ford": {"results": bf_results, "execution_time": bf_time * 1000},
        "graph": graph_dict,
        "nodes": nodes,
        "edges": edges
    })


@app.route("/api/benchmark", methods=["POST"])
def run_benchmark():
    """Run benchmark for specified max_nodes"""
    data = request.get_json()
    max_nodes = data.get("max_nodes", 200)
    
    results = []
    
    # Determine step size based on max_nodes
    if max_nodes <= 200:
        step = 5
    elif max_nodes <= 1000:
        step = 20
    elif max_nodes <= 10000:
        step = 200
    else:
        step = 1000
    
    node_counts = list(range(step, max_nodes + 1, step))
    if max_nodes not in node_counts:
        node_counts.append(max_nodes)
    
    for num_nodes in node_counts:
        graph, edges_list = generate_random_graph(num_nodes)
        start_node = 0
        
        # Run algorithms
        _, _, d_time = dijkstra_manual_heap(num_nodes, graph, start_node)
        _, _, bf_time = bellman_ford_recursive(num_nodes, edges_list, start_node)
        
        results.append({
            "num_nodes": num_nodes,
            "dijkstra_time": d_time * 1000,
            "bellman_ford_time": bf_time * 1000
        })
    
    return jsonify({"results": results})


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
