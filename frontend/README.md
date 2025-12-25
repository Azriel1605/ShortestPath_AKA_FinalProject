# Graph Algorithm Comparison: Dijkstra vs Bellman-Ford

Aplikasi full-stack untuk membandingkan performa algoritma Dijkstra (iteratif dengan manual heap) dan Bellman-Ford (rekursif).

## 📋 Persyaratan

- Node.js 18+ dan npm/yarn
- Python 3.8+
- pip (Python package manager)

## 🚀 Setup Cepat

### 1. Clone atau Download Project

```bash
# Jika sudah ada, buka folder project
cd my-v0-project
```

### 2. Setup Backend (Flask)

```bash
# Masuk ke folder backend
cd backend

# Install dependencies
pip install -r requirements.txt

# Jalankan Flask server
python main.py
```

Backend akan berjalan di `http://localhost:5000`

### 3. Setup Frontend (React/Next.js) - Terminal baru

```bash
# Di root project
npm install

# atau jika pakai yarn
yarn install

# Jalankan development server
npm run dev
```

Frontend akan berjalan di `http://localhost:3000`

## 🌐 Akses Aplikasi

Buka browser dan kunjungi: **http://localhost:3000**

## 📁 Struktur Project

```
my-v0-project/
├── backend/              # Flask API
│   ├── main.py          # Algoritma & endpoints
│   ├── .env             # Konfigurasi (FRONTEND_URL, PORT)
│   └── requirements.txt  # Python dependencies
│
├── app/                 # Next.js app
│   ├── page.tsx         # Main page
│   ├── layout.tsx       # Root layout
│   └── globals.css      # Global styles
│
├── components/          # React components
│   ├── graph-visualization.tsx
│   ├── results-table.tsx
│   └── complexity-section.tsx
│
├── lib/                 # Utilities
│   └── api.ts           # API calls
│
├── .env.local           # Frontend env vars
└── package.json         # Node dependencies
```

## ⚙️ Konfigurasi Variabel Environment

### Frontend (`.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Backend (`backend/.env`)
```
FRONTEND_URL=http://localhost:3000
PORT=5000
```

## 🔧 Troubleshooting

### Frontend tidak bisa connect ke backend
1. Pastikan Flask running di port 5000: `python backend/main.py`
2. Cek `.env.local` memiliki `NEXT_PUBLIC_API_URL=http://localhost:5000`

### Module error di frontend
```bash
# Clear node_modules dan reinstall
rm -rf node_modules package-lock.json
npm install
```

### Python module tidak ditemukan
```bash
cd backend
pip install --upgrade -r requirements.txt
```

### Port sudah digunakan
```bash
# Ubah port di backend/.env atau gunakan port lain
# Default: 5000
```

## 📊 Fitur Aplikasi

1. **Input Graf Dinamis** - Tentukan jumlah node dan starting node
2. **Visualisasi Graf** - Lihat struktur graf dengan warna kontras
3. **Perbandingan Real-time** - Jalankan kedua algoritma dan lihat hasil
4. **Benchmark Mode** - Test performa dengan 500, 1K, 10K, 50K nodes
5. **Grafik Performa** - Visualisasi perbandingan waktu eksekusi
6. **Analisis Kompleksitas** - Penjelasan Big O notation kedua algoritma

## 🔍 Algoritma

### Dijkstra (Manual Heap) - O(V × E)
- Iteratif menggunakan MinHeap custom
- Optimal untuk graf sparse
- Tidak support bobot negatif

### Bellman-Ford (Rekursif) - O(V²)
- Implementasi rekursif dengan fungsi `relax()`
- Support bobot negatif
- Terbatas oleh stack depth untuk graf sangat besar

## 📈 Contoh Penggunaan

1. Set nodes: 20, Starting node: V0
2. Click "Jalankan" → lihat hasil di tabel
3. Buka "Benchmark" → pilih "10,000 nodes"
4. Click "Run Benchmark" → tunggu proses, lihat grafik perbandingan

## 🛠️ Development

```bash
# Frontend dev server dengan hot reload
npm run dev

# Build production
npm run build

# Backend dengan auto-reload (jika pakai watchdog)
pip install watchdog
watchmedo auto-restart -d backend -p '*.py' -- python backend/main.py
```

## 📝 Catatan

- Benchmark dengan 50K nodes dapat memakan waktu beberapa menit
- Recursion limit Python sudah diset ke 100,000 untuk mendukung graf besar
- Graph selalu di-generate dengan connectivity terjamin

---

**Made with v0.app** | Graph Algorithm Analysis Tool
