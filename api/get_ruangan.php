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
    $idGedung = isset($_GET['id_gedung']) ? intval($_GET['id_gedung']) : 0;
    $idLantai = isset($_GET['id_lantai']) ? intval($_GET['id_lantai']) : 0;
    $jenis = isset($_GET['jenis']) ? trim($_GET['jenis']) : '';
    $q = isset($_GET['q']) ? trim($_GET['q']) : '';

    if ($id > 0) {
        $stmt = $pdo->prepare("SELECT r.*, g.nama_gedung, g.kode_gedung, g.latitude, g.longitude, l.nama_lantai, l.nomor_lantai 
                               FROM `ruangan` r 
                               JOIN `gedung` g ON r.id_gedung = g.id_gedung 
                               JOIN `lantai` l ON r.id_lantai = l.id_lantai 
                               WHERE r.id_ruangan = ?");
        $stmt->execute([$id]);
        $ruangan = $stmt->fetch();
        if ($ruangan) {
            sendJsonResponse(['status' => 'success', 'data' => $ruangan]);
        } else {
            sendJsonResponse(['status' => 'error', 'message' => 'Ruangan tidak ditemukan'], 404);
        }
    } else {
        $sql = "SELECT r.*, g.nama_gedung, g.kode_gedung, g.latitude, g.longitude, l.nama_lantai, l.nomor_lantai 
                FROM `ruangan` r 
                JOIN `gedung` g ON r.id_gedung = g.id_gedung 
                JOIN `lantai` l ON r.id_lantai = l.id_lantai 
                WHERE 1=1";
        $params = [];

        if ($idGedung > 0) {
            $sql .= " AND r.id_gedung = ?";
            $params[] = $idGedung;
        }

        if ($idLantai > 0) {
            $sql .= " AND r.id_lantai = ?";
            $params[] = $idLantai;
        }

        if (!empty($jenis)) {
            $sql .= " AND r.jenis_ruangan = ?";
            $params[] = $jenis;
        }

        if (!empty($q)) {
            $sql .= " AND (r.nama_ruangan LIKE ? OR r.kode_ruangan LIKE ? OR r.fasilitas LIKE ? OR g.nama_gedung LIKE ?)";
            $searchTerm = "%$q%";
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
        }

        $sql .= " ORDER BY g.id_gedung ASC, l.nomor_lantai ASC, r.kode_ruangan ASC";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $ruangans = $stmt->fetchAll();

        sendJsonResponse(['status' => 'success', 'total' => count($ruangans), 'data' => $ruangans]);
    }
} catch (PDOException $e) {
    sendJsonResponse(['status' => 'error', 'message' => $e->getMessage()], 500);
}
