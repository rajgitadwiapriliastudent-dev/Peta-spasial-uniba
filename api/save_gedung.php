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
        $id = intval($input['id_gedung'] ?? $_GET['id_gedung'] ?? 0);
        if ($id <= 0) sendJsonResponse(['status' => 'error', 'message' => 'ID Gedung tidak valid'], 400);

        $stmt = $pdo->prepare("DELETE FROM `gedung` WHERE `id_gedung` = ?");
        $stmt->execute([$id]);
        sendJsonResponse(['status' => 'success', 'message' => 'Gedung berhasil dihapus!']);
    }

    $idGedung = intval($input['id_gedung'] ?? 0);
    $kode = trim($input['kode_gedung'] ?? '');
    $nama = trim($input['nama_gedung'] ?? '');
    $alias = trim($input['alias'] ?? '');
    $kategori = trim($input['kategori'] ?? 'Akademik');
    $deskripsi = trim($input['deskripsi'] ?? '');
    $foto = trim($input['foto'] ?? 'assets/img/buildings/gedung_deramista.svg');
    $lokasi = trim($input['lokasi'] ?? '');
    $lat = floatval($input['latitude'] ?? -7.0135);
    $lng = floatval($input['longitude'] ?? 113.8305);
    $lantai = intval($input['jumlah_lantai'] ?? 1);
    $warna = trim($input['warna_peta'] ?? '#059669');

    if (empty($kode) || empty($nama)) {
        sendJsonResponse(['status' => 'error', 'message' => 'Kode gedung dan nama gedung wajib diisi!'], 400);
    }

    if ($idGedung > 0) {
        $stmt = $pdo->prepare("UPDATE `gedung` SET 
            `kode_gedung` = ?, `nama_gedung` = ?, `alias` = ?, `kategori` = ?, `deskripsi` = ?, 
            `foto` = ?, `lokasi` = ?, `latitude` = ?, `longitude` = ?, `jumlah_lantai` = ?, `warna_peta` = ?
            WHERE `id_gedung` = ?");
        $stmt->execute([$kode, $nama, $alias, $kategori, $deskripsi, $foto, $lokasi, $lat, $lng, $lantai, $warna, $idGedung]);
        sendJsonResponse(['status' => 'success', 'message' => 'Data gedung berhasil diperbarui!']);
    } else {
        $stmt = $pdo->prepare("INSERT INTO `gedung` 
            (`kode_gedung`, `nama_gedung`, `alias`, `kategori`, `deskripsi`, `foto`, `lokasi`, `latitude`, `longitude`, `jumlah_lantai`, `warna_peta`)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$kode, $nama, $alias, $kategori, $deskripsi, $foto, $lokasi, $lat, $lng, $lantai, $warna]);
        $newId = $pdo->lastInsertId();
        sendJsonResponse(['status' => 'success', 'message' => 'Gedung baru berhasil ditambahkan!', 'id_gedung' => $newId]);
    }
} catch (PDOException $e) {
    sendJsonResponse(['status' => 'error', 'message' => $e->getMessage()], 500);
}
