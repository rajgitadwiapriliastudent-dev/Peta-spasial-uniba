<?php
require_once __DIR__ . '/../config/database.php';

$pdo = Database::getConnection();
if (!$pdo) {
    sendJsonResponse(['status' => 'offline', 'message' => 'Database MySQL tidak aktif.'], 200);
}

$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
$action = $input['action'] ?? $_GET['action'] ?? 'save';

try {
    if ($action === 'delete') {
        $id = intval($input['id_lantai'] ?? $_GET['id_lantai'] ?? 0);
        if ($id <= 0) sendJsonResponse(['status' => 'error', 'message' => 'ID Lantai tidak valid'], 400);

        $stmt = $pdo->prepare("DELETE FROM `lantai` WHERE `id_lantai` = ?");
        $stmt->execute([$id]);
        sendJsonResponse(['status' => 'success', 'message' => 'Lantai berhasil dihapus!']);
    }

    $idLantai = intval($input['id_lantai'] ?? 0);
    $idGedung = intval($input['id_gedung'] ?? 0);
    $nomor = intval($input['nomor_lantai'] ?? 1);
    $nama = trim($input['nama_lantai'] ?? "Lantai $nomor");
    $deskripsi = trim($input['deskripsi'] ?? '');
    $denahFile = trim($input['denah_file'] ?? 'assets/img/contoh_denah.png');

    if ($idGedung <= 0 || empty($nama)) {
        sendJsonResponse(['status' => 'error', 'message' => 'Gedung dan Nama Lantai wajib diisi!'], 400);
    }

    if ($idLantai > 0) {
        $stmt = $pdo->prepare("UPDATE `lantai` SET 
            `id_gedung` = ?, `nomor_lantai` = ?, `nama_lantai` = ?, `deskripsi` = ?, `denah_file` = ?
            WHERE `id_lantai` = ?");
        $stmt->execute([$idGedung, $nomor, $nama, $deskripsi, $denahFile, $idLantai]);
        sendJsonResponse(['status' => 'success', 'message' => 'Data lantai berhasil diperbarui!']);
    } else {
        $stmt = $pdo->prepare("INSERT INTO `lantai` 
            (`id_gedung`, `nomor_lantai`, `nama_lantai`, `deskripsi`, `denah_file`)
            VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$idGedung, $nomor, $nama, $deskripsi, $denahFile]);
        $newId = $pdo->lastInsertId();
        sendJsonResponse(['status' => 'success', 'message' => 'Lantai baru berhasil ditambahkan!', 'id_lantai' => $newId]);
    }
} catch (PDOException $e) {
    sendJsonResponse(['status' => 'error', 'message' => $e->getMessage()], 500);
}
