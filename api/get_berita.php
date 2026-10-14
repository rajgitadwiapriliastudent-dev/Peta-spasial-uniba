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
    $kategori = isset($_GET['kategori']) ? trim($_GET['kategori']) : '';

    if ($id > 0) {
        $stmt = $pdo->prepare("SELECT * FROM `berita` WHERE id_berita = ?");
        $stmt->execute([$id]);
        $berita = $stmt->fetch();
        if ($berita) {
            sendJsonResponse(['status' => 'success', 'data' => $berita]);
        } else {
            sendJsonResponse(['status' => 'error', 'message' => 'Berita tidak ditemukan'], 404);
        }
    } else {
        $sql = "SELECT * FROM `berita` WHERE status = 'terbit'";
        $params = [];
        if (!empty($kategori)) {
            $sql .= " AND kategori = ?";
            $params[] = $kategori;
        }
        $sql .= " ORDER BY tanggal DESC, id_berita DESC";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $beritas = $stmt->fetchAll();

        sendJsonResponse(['status' => 'success', 'data' => $beritas]);
    }
} catch (PDOException $e) {
    sendJsonResponse(['status' => 'error', 'message' => $e->getMessage()], 500);
}
