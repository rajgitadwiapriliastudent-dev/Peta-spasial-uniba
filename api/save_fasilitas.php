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
        $id = intval($input['id_fasilitas'] ?? $_GET['id_fasilitas'] ?? 0);
        if ($id <= 0) sendJsonResponse(['status' => 'error', 'message' => 'ID Fasilitas tidak valid'], 400);

        $stmt = $pdo->prepare("DELETE FROM `fasilitas` WHERE `id_fasilitas` = ?");
        $stmt->execute([$id]);
        sendJsonResponse(['status' => 'success', 'message' => 'Fasilitas berhasil dihapus!']);
    }

    $idFasilitas = intval($input['id_fasilitas'] ?? 0);
    $idGedung = !empty($input['id_gedung']) ? intval($input['id_gedung']) : null;
    $idRuangan = !empty($input['id_ruangan']) ? intval($input['id_ruangan']) : null;
    $nama = trim($input['nama_fasilitas'] ?? '');
    $kategori = trim($input['kategori'] ?? 'Umum');
    $lokasi = trim($input['lokasi'] ?? '');
    $deskripsi = trim($input['deskripsi'] ?? '');
    $ikon = trim($input['ikon'] ?? 'bi-geo-alt');
    $foto = trim($input['foto'] ?? 'assets/img/campus_hero.jpg');

    if (empty($nama) || empty($lokasi)) {
        sendJsonResponse(['status' => 'error', 'message' => 'Nama fasilitas dan lokasi wajib diisi!'], 400);
    }

    if ($idFasilitas > 0) {
        $stmt = $pdo->prepare("UPDATE `fasilitas` SET 
            `id_gedung` = ?, `id_ruangan` = ?, `nama_fasilitas` = ?, `kategori` = ?, 
            `lokasi` = ?, `deskripsi` = ?, `ikon` = ?, `foto` = ?
            WHERE `id_fasilitas` = ?");
        $stmt->execute([$idGedung, $idRuangan, $nama, $kategori, $lokasi, $deskripsi, $ikon, $foto, $idFasilitas]);
        sendJsonResponse(['status' => 'success', 'message' => 'Fasilitas berhasil diperbarui!']);
    } else {
        $stmt = $pdo->prepare("INSERT INTO `fasilitas` 
            (`id_gedung`, `id_ruangan`, `nama_fasilitas`, `kategori`, `lokasi`, `deskripsi`, `ikon`, `foto`)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$idGedung, $idRuangan, $nama, $kategori, $lokasi, $deskripsi, $ikon, $foto]);
        $newId = $pdo->lastInsertId();
        sendJsonResponse(['status' => 'success', 'message' => 'Fasilitas baru berhasil ditambahkan!', 'id_fasilitas' => $newId]);
    }
} catch (PDOException $e) {
    sendJsonResponse(['status' => 'error', 'message' => $e->getMessage()], 500);
}
