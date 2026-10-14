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
    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
    if ($id > 0) {
        $stmt = $pdo->prepare("SELECT * FROM `gedung` WHERE `id_gedung` = ?");
        $stmt->execute([$id]);
        $gedung = $stmt->fetch();
        if ($gedung) {
            // Ambil daftar lantai untuk gedung ini
            $stmtLantai = $pdo->prepare("SELECT * FROM `lantai` WHERE `id_gedung` = ? ORDER BY `nomor_lantai` ASC");
            $stmtLantai->execute([$id]);
            $gedung['lantai'] = $stmtLantai->fetchAll();
            
            // Hitung total ruangan di gedung
            $stmtR = $pdo->prepare("SELECT COUNT(*) FROM `ruangan` WHERE `id_gedung` = ?");
            $stmtR->execute([$id]);
            $gedung['total_ruangan'] = $stmtR->fetchColumn();
            
            sendJsonResponse(['status' => 'success', 'data' => $gedung]);
        } else {
            sendJsonResponse(['status' => 'error', 'message' => 'Gedung tidak ditemukan'], 404);
        }
    } else {
        $stmt = $pdo->query("SELECT g.*, 
            (SELECT COUNT(*) FROM `ruangan` r WHERE r.`id_gedung` = g.`id_gedung`) AS `total_ruangan`
            FROM `gedung` g 
            WHERE g.`status` != 'nonaktif' 
            ORDER BY g.`id_gedung` ASC");
        $gedungs = $stmt->fetchAll();
        sendJsonResponse(['status' => 'success', 'data' => $gedungs]);
    }
} catch (PDOException $e) {
    sendJsonResponse(['status' => 'error', 'message' => $e->getMessage()], 500);
}
