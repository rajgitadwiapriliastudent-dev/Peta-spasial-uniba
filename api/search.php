<?php
require_once __DIR__ . '/../config/database.php';

$pdo = Database::getConnection();
if (!$pdo) {
    sendJsonResponse([
        'status' => 'offline',
        'message' => Database::getErrorMessage(),
        'data' => ['ruangan' => [], 'gedung' => [], 'fasilitas' => []]
    ], 200);
}

$query = isset($_GET['q']) ? trim($_GET['q']) : '';

if (empty($query)) {
    sendJsonResponse([
        'status' => 'success',
        'query' => '',
        'total' => 0,
        'data' => [
            'ruangan' => [],
            'gedung' => [],
            'fasilitas' => []
        ]
    ]);
}

try {
    $term = "%$query%";

    // 1. Cari Ruangan (SQL LIKE)
    $stmtR = $pdo->prepare("SELECT r.*, g.nama_gedung, g.kode_gedung, g.latitude, g.longitude, l.nama_lantai, l.nomor_lantai 
                           FROM `ruangan` r 
                           JOIN `gedung` g ON r.id_gedung = g.id_gedung 
                           JOIN `lantai` l ON r.id_lantai = l.id_lantai 
                           WHERE r.nama_ruangan LIKE ? 
                              OR r.kode_ruangan LIKE ? 
                              OR r.fasilitas LIKE ? 
                              OR r.jenis_ruangan LIKE ? 
                              OR g.nama_gedung LIKE ?
                           ORDER BY r.kode_ruangan ASC");
    $stmtR->execute([$term, $term, $term, $term, $term]);
    $ruanganResults = $stmtR->fetchAll();

    // 2. Cari Gedung
    $stmtG = $pdo->prepare("SELECT * FROM `gedung` 
                           WHERE nama_gedung LIKE ? 
                              OR kode_gedung LIKE ? 
                              OR alias LIKE ? 
                              OR fasilitas LIKE ?");
    $stmtG->execute([$term, $term, $term, $term]);
    $gedungResults = $stmtG->fetchAll();

    // 3. Cari Fasilitas
    $stmtF = $pdo->prepare("SELECT f.*, g.nama_gedung, g.kode_gedung 
                           FROM `fasilitas` f 
                           LEFT JOIN `gedung` g ON f.id_gedung = g.id_gedung 
                           WHERE f.nama_fasilitas LIKE ? 
                              OR f.kategori LIKE ? 
                              OR f.lokasi LIKE ? 
                              OR f.deskripsi LIKE ?");
    $stmtF->execute([$term, $term, $term, $term]);
    $fasilitasResults = $stmtF->fetchAll();

    $totalFound = count($ruanganResults) + count($gedungResults) + count($fasilitasResults);

    sendJsonResponse([
        'status' => 'success',
        'query' => $query,
        'total' => $totalFound,
        'data' => [
            'ruangan' => $ruanganResults,
            'gedung' => $gedungResults,
            'fasilitas' => $fasilitasResults
        ]
    ]);
} catch (PDOException $e) {
    sendJsonResponse(['status' => 'error', 'message' => $e->getMessage()], 500);
}
