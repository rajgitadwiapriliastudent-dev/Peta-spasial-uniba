<?php
/**
 * API Backend Algoritma Dijkstra untuk Pencarian Rute Terpendek Kampus UNIBA Madura
 * Menggunakan Koordinat Spasial Lokal Asli Peta UNIBA Madura (731 x 1034)
 * Mendukung Perjalanan Menjangkau Ruangan Tertentu (Outdoor + Indoor)
 * Pengembang: R. Aj Gita Dwi Aprilia (NIM: 2302510011)
 */

require_once __DIR__ . '/../config/database.php';

header('Content-Type: application/json; charset=utf-8');

// 1. Simpul / Nodes Graf Spasial Kampus (Luar & Akses Masuk)
$nodes = [
    'gerbang_utama'       => ['id' => 'gerbang_utama', 'nama' => 'Gerbang Utama (Jl. Raya Lenteng)', 'label' => 'Gerbang Utama', 'kategori' => 'Akses', 'x' => 168, 'y' => 910, 'lat' => 124, 'lon' => 168],
    'pos_keamanan'        => ['id' => 'pos_keamanan', 'nama' => 'Pos Keamanan & Portal Depan', 'label' => 'Pos Keamanan', 'kategori' => 'Akses', 'x' => 200, 'y' => 810, 'lat' => 224, 'lon' => 200],
    'jalan_masuk'         => ['id' => 'jalan_masuk', 'nama' => 'Jalan Masuk Utama Kawasan', 'label' => 'Jalan Masuk', 'kategori' => 'Jalan', 'x' => 245, 'y' => 730, 'lat' => 304, 'lon' => 245],
    'simpang_gor'         => ['id' => 'simpang_gor', 'nama' => 'Simpang GOR & Parkir Lorong Bangka', 'label' => 'Simpang GOR', 'kategori' => 'Simpang', 'x' => 285, 'y' => 675, 'lat' => 359, 'lon' => 285],
    'parkir_gor'          => ['id' => 'parkir_gor', 'nama' => 'Area Parkir GOR Bahaudin Mudhary', 'label' => 'Parkir GOR', 'kategori' => 'Fasilitas', 'x' => 160, 'y' => 665, 'lat' => 369, 'lon' => 160],
    'parkir_lorong_bangka'=> ['id' => 'parkir_lorong_bangka', 'nama' => 'Area Parkiran Lorong Bangka', 'label' => 'Parkir Lorong Bangka', 'kategori' => 'Fasilitas', 'x' => 330, 'y' => 700, 'lat' => 334, 'lon' => 330],
    'simpang_pajhur'      => ['id' => 'simpang_pajhur', 'nama' => 'Simpang Panggung Pajhur', 'label' => 'Simpang Pajhur', 'kategori' => 'Simpang', 'x' => 360, 'y' => 575, 'lat' => 459, 'lon' => 360],
    'bundaran_monumen'    => ['id' => 'bundaran_monumen', 'nama' => 'Bundaran Monumen Achmad Bahaudin Mudhary', 'label' => 'Bundaran Monumen', 'kategori' => 'Simpang', 'x' => 425, 'y' => 505, 'lat' => 529, 'lon' => 425],
    'plaza_tengah'        => ['id' => 'plaza_tengah', 'nama' => 'Plaza & Taman Pedestrian Kampus', 'label' => 'Plaza Tengah', 'kategori' => 'Simpang', 'x' => 460, 'y' => 430, 'lat' => 604, 'lon' => 460],
    'simpang_barat'       => ['id' => 'simpang_barat', 'nama' => 'Simpang Koridor Barat (Gedung A & D)', 'label' => 'Simpang Barat', 'kategori' => 'Simpang', 'x' => 300, 'y' => 490, 'lat' => 544, 'lon' => 300],
    'simpang_utara'       => ['id' => 'simpang_utara', 'nama' => 'Simpang Pedestrian Utara (Depan Gedung C)', 'label' => 'Simpang Utara', 'kategori' => 'Simpang', 'x' => 475, 'y' => 380, 'lat' => 654, 'lon' => 475],
    'parkir_dosen'        => ['id' => 'parkir_dosen', 'nama' => 'Area Parkir Dosen & Karyawan', 'label' => 'Parkiran Dosen', 'kategori' => 'Fasilitas', 'x' => 590, 'y' => 585, 'lat' => 449, 'lon' => 590],
    'jalur_musholla'      => ['id' => 'jalur_musholla', 'nama' => 'Jalur Pedestrian Musholla', 'label' => 'Jalur Musholla', 'kategori' => 'Jalan', 'x' => 560, 'y' => 360, 'lat' => 674, 'lon' => 560],
    'musholla'            => ['id' => 'musholla', 'nama' => 'Musholla Al-Qosos Kampus', 'label' => 'Musholla Al-Qosos', 'kategori' => 'Fasilitas', 'x' => 620, 'y' => 345, 'lat' => 689, 'lon' => 620],
    'lab_industri'        => ['id' => 'lab_industri', 'nama' => 'Laboratorium Teknik Industri', 'label' => 'Lab Industri', 'kategori' => 'Fasilitas', 'x' => 685, 'y' => 375, 'lat' => 659, 'lon' => 685],
    'jalur_kantin'        => ['id' => 'jalur_kantin', 'nama' => 'Jalur Penghubung Kantin & Pujasera', 'label' => 'Jalur Kantin', 'kategori' => 'Jalan', 'x' => 620, 'y' => 285, 'lat' => 749, 'lon' => 620],
    'kantin'              => ['id' => 'kantin', 'nama' => 'Kantin & Pujasera Mahasiswa', 'label' => 'Kantin Kampus', 'kategori' => 'Fasilitas', 'x' => 655, 'y' => 285, 'lat' => 749, 'lon' => 655],
    'pkm_koperasi'        => ['id' => 'pkm_koperasi', 'nama' => 'PKM & Koperasi Mahasiswa', 'label' => 'PKM & Koperasi', 'kategori' => 'Fasilitas', 'x' => 605, 'y' => 205, 'lat' => 829, 'lon' => 605],

    // Akses Masuk Gedung
    'akses_gedung_a'      => ['id' => 'akses_gedung_a', 'nama' => 'Pintu Masuk Utama Gedung Deramista (Gedung A)', 'label' => 'Pintu Gedung A', 'kategori' => 'Gedung', 'gedung_id' => 1, 'x' => 245, 'y' => 445, 'lat' => 589, 'lon' => 245],
    'akses_gedung_b'      => ['id' => 'akses_gedung_b', 'nama' => 'Pintu Masuk Utama Gedung Campaka (Gedung B - FST)', 'label' => 'Pintu Gedung B', 'kategori' => 'Gedung', 'gedung_id' => 2, 'x' => 535, 'y' => 470, 'lat' => 564, 'lon' => 535],
    'akses_gedung_c'      => ['id' => 'akses_gedung_c', 'nama' => 'Pintu Masuk Utama Gedung Kapanjin (Gedung C - FEB)', 'label' => 'Pintu Gedung C', 'kategori' => 'Gedung', 'gedung_id' => 3, 'x' => 475, 'y' => 355, 'lat' => 679, 'lon' => 475],
    'akses_gedung_d'      => ['id' => 'akses_gedung_d', 'nama' => 'Pintu Masuk Utama Gedung Tuan Gubhe (Gedung D)', 'label' => 'Pintu Gedung D', 'kategori' => 'Gedung', 'gedung_id' => 4, 'x' => 345, 'y' => 485, 'lat' => 549, 'lon' => 345],
    'akses_gedung_e'      => ['id' => 'akses_gedung_e', 'nama' => 'Pintu Masuk Utama GOR Bahaudin Mudhary (Gedung E)', 'label' => 'Pintu Masuk GOR', 'kategori' => 'Gedung', 'gedung_id' => 5, 'x' => 260, 'y' => 620, 'lat' => 414, 'lon' => 260],
    'akses_gedung_f'      => ['id' => 'akses_gedung_f', 'nama' => 'Pintu Masuk Panggung Pajhur (Gedung F)', 'label' => 'Panggung Pajhur', 'kategori' => 'Gedung', 'gedung_id' => 6, 'x' => 430, 'y' => 590, 'lat' => 444, 'lon' => 430]
];

// 2. Garis Penghubung / Edges dengan Bobot (Jarak dalam Meter)
$edges = [
    ['u' => 'gerbang_utama', 'v' => 'pos_keamanan', 'weight' => 35],
    ['u' => 'pos_keamanan', 'v' => 'jalan_masuk', 'weight' => 40],
    ['u' => 'jalan_masuk', 'v' => 'simpang_gor', 'weight' => 35],
    ['u' => 'simpang_gor', 'v' => 'parkir_gor', 'weight' => 45],
    ['u' => 'simpang_gor', 'v' => 'parkir_lorong_bangka', 'weight' => 25],
    ['u' => 'simpang_gor', 'v' => 'akses_gedung_e', 'weight' => 30],
    ['u' => 'simpang_gor', 'v' => 'simpang_pajhur', 'weight' => 50],
    ['u' => 'simpang_pajhur', 'v' => 'akses_gedung_f', 'weight' => 30],
    ['u' => 'simpang_pajhur', 'v' => 'bundaran_monumen', 'weight' => 40],
    ['u' => 'simpang_pajhur', 'v' => 'simpang_barat', 'weight' => 45],
    ['u' => 'simpang_barat', 'v' => 'akses_gedung_a', 'weight' => 25],
    ['u' => 'simpang_barat', 'v' => 'akses_gedung_d', 'weight' => 25],
    ['u' => 'bundaran_monumen', 'v' => 'simpang_barat', 'weight' => 40],
    ['u' => 'bundaran_monumen', 'v' => 'plaza_tengah', 'weight' => 35],
    ['u' => 'bundaran_monumen', 'v' => 'parkir_dosen', 'weight' => 65],
    ['u' => 'plaza_tengah', 'v' => 'akses_gedung_d', 'weight' => 30],
    ['u' => 'plaza_tengah', 'v' => 'akses_gedung_b', 'weight' => 35],
    ['u' => 'plaza_tengah', 'v' => 'simpang_utara', 'weight' => 35],
    ['u' => 'akses_gedung_b', 'v' => 'parkir_dosen', 'weight' => 35],
    ['u' => 'simpang_utara', 'v' => 'akses_gedung_c', 'weight' => 20],
    ['u' => 'simpang_utara', 'v' => 'jalur_musholla', 'weight' => 30],
    ['u' => 'jalur_musholla', 'v' => 'musholla', 'weight' => 25],
    ['u' => 'jalur_musholla', 'v' => 'lab_industri', 'weight' => 35],
    ['u' => 'jalur_musholla', 'v' => 'jalur_kantin', 'weight' => 30],
    ['u' => 'jalur_kantin', 'v' => 'kantin', 'weight' => 20],
    ['u' => 'jalur_kantin', 'v' => 'pkm_koperasi', 'weight' => 35]
];

// Ambil simpul dari database MySQL jika tersedia tabel node_rute
try {
    $pdo = Database::getConnection();
    if ($pdo) {
        $checkTable = $pdo->query("SHOW TABLES LIKE 'node_rute'")->fetch();
        if ($checkTable) {
            $dbNodes = $pdo->query("SELECT * FROM node_rute")->fetchAll();
            if (!empty($dbNodes)) {
                foreach ($dbNodes as $dn) {
                    $nid = $dn['id_node'];
                    $nodes[$nid] = [
                        'id' => $nid,
                        'nama' => $dn['nama_node'],
                        'label' => $dn['nama_node'],
                        'kategori' => $dn['jenis_node'],
                        'x' => intval($dn['koordinat_x']),
                        'y' => intval($dn['koordinat_y']),
                        'lat' => 1034 - intval($dn['koordinat_y']),
                        'lon' => intval($dn['koordinat_x']),
                        'gedung_id' => $dn['id_gedung'] ?? null,
                        'lantai' => $dn['id_lantai'] ?? null
                    ];
                }
            }
        }
        $checkEdges = $pdo->query("SHOW TABLES LIKE 'edge_rute'")->fetch();
        if ($checkEdges) {
            $dbEdges = $pdo->query("SELECT * FROM edge_rute")->fetchAll();
            if (!empty($dbEdges)) {
                $edges = [];
                foreach ($dbEdges as $de) {
                    $edges[] = [
                        'u' => $de['node_awal'],
                        'v' => $de['node_tujuan'],
                        'weight' => floatval($de['jarak'])
                    ];
                }
            }
        }
    }
} catch (Exception $ex) {
    // Gunakan fallback dataset bawaan
}

// Fungsi Membangun Adjacency List
function buildAdjacencyList($nodes, $edges) {
    $adj = [];
    foreach ($nodes as $id => $val) {
        $adj[$id] = [];
    }
    foreach ($edges as $e) {
        if (isset($nodes[$e['u']]) && isset($nodes[$e['v']])) {
            $adj[$e['u']][] = ['node' => $e['v'], 'weight' => $e['weight']];
            $adj[$e['v']][] = ['node' => $e['u'], 'weight' => $e['weight']];
        }
    }
    return $adj;
}

// Algoritma Dijkstra
function dijkstraShortestPath($startId, $targetId, $nodes, $edges) {
    if (!isset($nodes[$startId]) || !isset($nodes[$targetId])) {
        return null;
    }

    if ($startId === $targetId) {
        return [
            'path_node_ids' => [$startId],
            'path_nodes'    => [$nodes[$startId]],
            'total_distance'=> 0,
            'estimated_min' => 1,
            'steps'         => [$nodes[$startId]['label']],
            'coordinates'   => [[$nodes[$startId]['lat'], $nodes[$startId]['lon']]],
            'step_guides'   => ["Anda telah berada di titik: {$nodes[$startId]['nama']}"]
        ];
    }

    $adj = buildAdjacencyList($nodes, $edges);
    $distances = [];
    $previous = [];
    $unvisited = [];

    foreach ($nodes as $id => $val) {
        $distances[$id] = INF;
        $previous[$id] = null;
        $unvisited[$id] = true;
    }
    $distances[$startId] = 0;

    while (!empty($unvisited)) {
        $current = null;
        $minDist = INF;

        foreach ($unvisited as $id => $v) {
            if ($distances[$id] < $minDist) {
                $minDist = $distances[$id];
                $current = $id;
            }
        }

        if ($current === null || $current === $targetId || $minDist === INF) {
            break;
        }

        unset($unvisited[$current]);

        foreach ($adj[$current] as $neighbor) {
            $nNode = $neighbor['node'];
            if (isset($unvisited[$nNode])) {
                $alt = $distances[$current] + $neighbor['weight'];
                if ($alt < $distances[$nNode]) {
                    $distances[$nNode] = $alt;
                    $previous[$nNode] = $current;
                }
            }
        }
    }

    $path = [];
    $curr = $targetId;
    while ($curr !== null) {
        array_unshift($path, $curr);
        $curr = $previous[$curr];
    }

    if (empty($path) || $path[0] !== $startId) {
        return null;
    }

    $pathNodes = [];
    $coords = [];
    $steps = [];
    $stepGuides = [];

    $stepGuides[] = "Mulai dari " . $nodes[$path[0]]['nama'];

    for ($i = 0; $i < count($path); $i++) {
        $pId = $path[$i];
        $node = $nodes[$pId];
        $pathNodes[] = $node;
        if (isset($node['lat']) && isset($node['lon'])) {
            $coords[] = [$node['lat'], $node['lon']];
        }
        $steps[] = $node['label'];

        if ($i > 0 && $i < count($path) - 1) {
            $stepGuides[] = "Ikuti jalur melewati " . $node['nama'];
        }
    }

    $stepGuides[] = "Tiba di tujuan: " . $nodes[$targetId]['nama'];

    $totalDist = round($distances[$targetId]);
    $estMin = max(1, (int)round($totalDist / 70));

    return [
        'path_node_ids' => $path,
        'path_nodes'    => $pathNodes,
        'total_distance'=> $totalDist,
        'estimated_min' => $estMin,
        'steps'         => $steps,
        'coordinates'   => $coords,
        'step_guides'   => $stepGuides
    ];
}

$start = isset($_GET['start']) ? trim($_GET['start']) : 'gerbang_utama';
$target = isset($_GET['target']) ? trim($_GET['target']) : 'akses_gedung_a';
$idRuangan = isset($_GET['id_ruangan']) ? intval($_GET['id_ruangan']) : 0;

$buildingMap = [
    1 => 'akses_gedung_a',
    2 => 'akses_gedung_b',
    3 => 'akses_gedung_c',
    4 => 'akses_gedung_d',
    5 => 'akses_gedung_e',
    6 => 'akses_gedung_f'
];

$roomData = null;
if ($idRuangan > 0) {
    try {
        $pdo = Database::getConnection();
        if ($pdo) {
            $stmt = $pdo->prepare("SELECT r.*, g.nama_gedung, l.nama_lantai 
                                   FROM ruangan r 
                                   JOIN gedung g ON r.id_gedung = g.id_gedung 
                                   JOIN lantai l ON r.id_lantai = l.id_lantai 
                                   WHERE r.id_ruangan = ?");
            $stmt->execute([$idRuangan]);
            $roomData = $stmt->fetch();
            if ($roomData && isset($buildingMap[$roomData['id_gedung']])) {
                $target = $buildingMap[$roomData['id_gedung']];
            }
        }
    } catch (Exception $e) {
        // Fallback
    }
}

$route = dijkstraShortestPath($start, $target, $nodes, $edges);

if (!$route) {
    sendJsonResponse([
        'status' => 'error',
        'message' => 'Rute tidak ditemukan antara kedua titik yang dipilih'
    ], 404);
}

if ($roomData) {
    $floorNum = intval($roomData['nomor_lantai'] ?? 1);
    $extraFloor = ($floorNum - 1) * 20;
    $corridor = 15;
    $route['total_distance'] += ($extraFloor + $corridor);
    $route['estimated_min'] = max(1, (int)round($route['total_distance'] / 65));
    if ($floorNum > 1) {
        $route['steps'][] = "Lantai {$floorNum} (Tangga/Lift)";
        $route['step_guides'][] = "Naik ke Lantai {$floorNum} menggunakan tangga atau lift gedung";
    }
    $route['steps'][] = "{$roomData['kode_ruangan']} - {$roomData['nama_ruangan']}";
    $route['step_guides'][] = "Susuri koridor Lantai {$floorNum} menuju pintu masuk {$roomData['kode_ruangan']} - {$roomData['nama_ruangan']}";
    $route['step_guides'][] = "Tiba di ruangan tujuan: {$roomData['nama_ruangan']}";
    $route['ruangan'] = $roomData;
}

sendJsonResponse([
    'status' => 'success',
    'algorithm' => 'Dijkstra Shortest Path',
    'origin' => $nodes[$start] ?? null,
    'destination' => $nodes[$target] ?? null,
    'data' => $route
]);
