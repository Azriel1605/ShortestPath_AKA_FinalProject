from flask import Flask, request, jsonify
from flask_cors import CORS
from typing import Dict, List, Tuple, Optional
import random
import time
import os
import sys
import heapq
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# CORS configuration from .env
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
CORS(app, origins=[frontend_url], supports_credentials=True)

# Increase recursion limit for large graphs
sys.setrecursionlimit(100000)

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


def dijkstra_heapq(n: int, graph: List[List[Tuple[int, int]]], start: int) -> Tuple[List[float], List[Optional[int]], float]:
    """
    Dijkstra's algorithm using heapq (min-priority queue)
    Time Complexity: O((V + E) log V)
    """
    
    # V = Vertex (Node / Simpul)
    start_time = time.perf_counter()
    
    # Inisialisasi
    INF = float('inf') # O(1)
    dist = [INF] * n # O(V)
    prev = [None] * n # O(V)
    
    ## 2 * V
    
    dist[start] = 0 # Node awal ke node awal pasti 0 jaraknya

    heap = []
    # Seperti Binary tree
    heapq.heappush(heap, (0, start))  # (distance, node)
    # Log V


    ## Best Case, ketika node yang dituju tidak memiliki edge lagi
    ## Node yang dikunjungi adalah node yang mungkin untuk dicapai
    while heap: # Selama ada node yang belum dikunjungi O (V)
        # Berakhir Loop ketika semua node dikunjungi
        
        cur_dist, u = heapq.heappop(heap) # Log (V) #Menandakan bahwa vertex sudah dikunjungi

        # Skip outdated entry
        if cur_dist > dist[u]: # SKip jika bobot node skrg lebih besar dari bobot yang dituju
            continue

        for v, w in graph[u]:  # O(E) # Looping Edge
            new_dist = cur_dist + w # Total Bobot
            if new_dist < dist[v]: # Jika terdapat rute yang lebih pendek, jarak akan diperbaharui
                dist[v] = new_dist
                prev[v] = u
                heapq.heappush(heap, (new_dist, v)) # Log V # Jika Node mungkin dicapai, node dimasukkan kedalam antrian
                
    # Total Time complexity 
    # (2 * V) + Log V + V * (Log V) + E * (Log V)
    
    # Normalnya Edge lebih banyak dibanding V
    ###### 
    # E >= V
    
    # Time complexity yang dipersimpel E * (log V)
    # n + n^2
    # O (n^2)
    
    

    execution_time = time.perf_counter() - start_time
    return dist, prev, execution_time


def bellman_ford_recursive( n: int, edges: List[Tuple[int, int, int]], start: int) -> Tuple[List[float], List[Optional[int]], float]:
    """
    Bellman-Ford recursive implementation
    Time Complexity: O(VE)
    """
    start_time = time.perf_counter()


    # Inisialisasi Jarak awal INF (Belum bisa dicapai)
    INF = float('inf')
    dist = [INF] * n # O(V)
    prev = [None] * n # O(V) # Node sebelumnya untuk mencapai Node tersebut
    dist[start] = 0 # Jarak node awal ke node awal pasti 0

    def recursive(iteration: int): # Maksimal recursive dipanggil adalah V-1 O(V)
        # Akan berhenti ketika tidak terdapat rute baru dari iterasi
        # Atau rekursif mencapai V-1
        # Base case: Berhenti ketika  V - 1 iterasi
        if iteration == n - 1: # Jika semua telah di cek
            return

        updated = False
        for u, v, w in edges: # Memerisa semua Edge O(E)
            if dist[u] != INF and dist[u] + w < dist[v]: # Jika terdapat rute lebih kecil
                dist[v] = dist[u] + w
                prev[v] = u
                updated = True # terdapat Setidaknya 1 rute baru

        # Recursive call only if something changed
        if updated:
            recursive(iteration + 1) # Maksimal dipanggil V - 1

    recursive(0)
    
    ## Time Complexity
    # V + V + (V-1) * E
    # (V - 1) * E
    # O(V * E)

    execution_time = time.perf_counter() - start_time
    return dist, prev, execution_time

def bellman_ford_iterative(
    n: int,
    edges: List[Tuple[int, int, int]],
    start: int
) -> Tuple[List[float], List[Optional[int]], float]:
    """
    Bellman-Ford iterative implementation
    Time Complexity: O(VE)
    """

    start_time = time.perf_counter()

    INF = float('inf')
    dist = [INF] * n           # O(V)
    prev = [None] * n          # O(V)
    dist[start] = 0

    # Relaksasi edge sebanyak V-1 kali
    for iteration in range(n - 1):   # O(V)
        updated = False

        for u, v, w in edges:        # O(E)
            if dist[u] != INF and dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                prev[v] = u
                updated = True

        # Early stopping: jika tidak ada perubahan
        if not updated:
            break

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
    
    # Setting Node awal
    try:
        start_node = int(start_node_str.replace("V", ""))
        if start_node < 0 or start_node >= num_nodes:
            start_node = 0
    except:
        start_node = 0
    
    # Buat graph random
    graph, edges_list = generate_random_graph(num_nodes)
    
    # Menjalankan Algoritma Dijkstra
    dijkstra_dist, dijkstra_prev, dijkstra_time = dijkstra_heapq(num_nodes, graph, start_node)
    
    # Menjalankan Algoritma Bellman-Ford
    bf_dist, bf_prev, bf_time = bellman_ford_recursive(num_nodes, edges_list, start_node)
    bfi_dist, bfi_prev, bfi_time = bellman_ford_iterative(num_nodes, edges_list, start_node)
    
    # Mengembalikan nilai node dengan awalan V
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
    
    bfi_results = [
        {
            "node": f"V{i}",
            "distance": bfi_dist[i] if bfi_dist[i] != float('inf') else -1,
            "previous": f"V{bfi_prev[i]}" if bfi_prev[i] is not None else None
        }
        for i in range(num_nodes)
    ]
    
    # Format edges untuk visualisasi
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
        "bellman_ford_iterative": {"results": bfi_results, "execution_time": bfi_time * 1000},
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
        _, _, d_time = dijkstra_heapq(num_nodes, graph, start_node)
        _, _, bf_time = bellman_ford_recursive(num_nodes, edges_list, start_node)
        _, _, bfi_time = bellman_ford_iterative(num_nodes, edges_list, start_node)
        
        results.append({
            "num_nodes": num_nodes,
            "dijkstra_time": d_time * 1000,
            "bellman_ford_time": bf_time * 1000,
            "bellman_ford_iterative_time": bfi_time * 1000
        })
    
    return jsonify({"results": results})


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
