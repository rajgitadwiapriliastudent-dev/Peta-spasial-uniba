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
    $idGedung = isset($_GET['id_gedung']) ? intval($_GET['id_gedung']) : 0;
    $idLantai = isset($_GET['id_lantai']) ? intval($_GET['id_lantai']) : 0;

    if ($idLantai > 0) {
        $stmt = $pdo->prepare("SELECT l.*, g.nama_gedung, g.kode_gedung 
                               FROM `lantai` l 
                               JOIN `gedung` g ON l.id_gedung = g.id_gedung 
                               WHERE l.id_lantai = ?");
        $stmt->execute([$idLantai]);
        $lantai = $stmt->fetch();
        if ($lantai) {
            // Ambil daftar ruangan di lantai ini
            $stmtR = $pdo->prepare("SELECT * FROM `ruangan` WHERE id_lantai = ? ORDER BY kode_ruangan ASC");
            $stmtR->execute([$idLantai]);
            $lantai['ruangan'] = $stmtR->fetchAll();
            sendJsonResponse(['status' => 'success', 'data' => $lantai]);
        } else {
            sendJsonResponse(['status' => 'error', 'message' => 'Lantai tidak ditemukan'], 404);
        }
    } elseif ($idGedung > 0) {
        $stmt = $pdo->prepare("SELECT l.*, 
            (SELECT COUNT(*) FROM `ruangan` r WHERE r.id_lantai = l.id_lantai) AS total_ruangan 
            FROM `lantai` l 
            WHERE l.id_gedung = ? 
            ORDER BY l.nomor_lantai ASC");
        $stmt->execute([$idGedung]);
        $lantais = $stmt->fetchAll();
        sendJsonResponse(['status' => 'success', 'data' => $lantais]);
    } else {
        $stmt = $pdo->query("SELECT l.*, g.nama_gedung, 
            (SELECT COUNT(*) FROM `ruangan` r WHERE r.id_lantai = l.id_lantai) AS total_ruangan 
            FROM `lantai` l 
            JOIN `gedung` g ON l.id_gedung = g.id_gedung 
            ORDER BY g.id_gedung ASC, l.nomor_lantai ASC");
        $lantais = $stmt->fetchAll();
        sendJsonResponse(['status' => 'success', 'data' => $lantais]);
    }
} catch (PDOException $e) {
    sendJsonResponse(['status' => 'error', 'message' => $e->getMessage()], 500);
}
