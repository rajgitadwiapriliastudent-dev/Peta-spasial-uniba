<?php
require_once __DIR__ . '/../config/database.php';

$pdo = Database::getConnection();
if (!$pdo) {
    sendJsonResponse([
        'status' => 'offline',
        'message' => Database::getErrorMessage(),
        'data' => []
    ], 200);
}

try {
    $kategori = isset($_GET['kategori']) ? trim($_GET['kategori']) : '';
    $idGedung = isset($_GET['id_gedung']) ? intval($_GET['id_gedung']) : 0;

    $sql = "SELECT f.*, g.nama_gedung, g.kode_gedung, g.latitude, g.longitude, r.nama_ruangan, r.kode_ruangan, r.id_lantai 
            FROM `fasilitas` f 
            LEFT JOIN `gedung` g ON f.id_gedung = g.id_gedung 
            LEFT JOIN `ruangan` r ON f.id_ruangan = r.id_ruangan 
            WHERE f.status = 'aktif'";
    $params = [];

    if (!empty($kategori)) {
        $sql .= " AND f.kategori = ?";
        $params[] = $kategori;
    }

    if ($idGedung > 0) {
        $sql .= " AND f.id_gedung = ?";
        $params[] = $idGedung;
    }

    $sql .= " ORDER BY f.id_fasilitas ASC";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $fasilitas = $stmt->fetchAll();

    sendJsonResponse(['status' => 'success', 'data' => $fasilitas]);
} catch (PDOException $e) {
    sendJsonResponse(['status' => 'error', 'message' => $e->getMessage()], 500);
}
