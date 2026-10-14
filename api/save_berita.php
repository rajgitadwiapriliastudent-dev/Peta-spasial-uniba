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
        $id = intval($input['id_berita'] ?? $_GET['id_berita'] ?? 0);
        if ($id <= 0) sendJsonResponse(['status' => 'error', 'message' => 'ID Berita tidak valid'], 400);

        $stmt = $pdo->prepare("DELETE FROM `berita` WHERE `id_berita` = ?");
        $stmt->execute([$id]);
        sendJsonResponse(['status' => 'success', 'message' => 'Berita/Pengumuman berhasil dihapus!']);
    }

    $idBerita = intval($input['id_berita'] ?? 0);
    $judul = trim($input['judul'] ?? '');
    $kategori = trim($input['kategori'] ?? 'Pengumuman');
    $tanggal = trim($input['tanggal'] ?? date('Y-m-d'));
    $ringkasan = trim($input['ringkasan'] ?? '');
    $isi = trim($input['isi'] ?? '');
    $penulis = trim($input['penulis'] ?? 'Humas UNIBA Madura');
    $foto = trim($input['foto'] ?? 'assets/img/campus_hero.jpg');

    if (empty($judul) || empty($ringkasan)) {
        sendJsonResponse(['status' => 'error', 'message' => 'Judul dan ringkasan pengumuman wajib diisi!'], 400);
    }

    if ($idBerita > 0) {
        $stmt = $pdo->prepare("UPDATE `berita` SET 
            `judul` = ?, `kategori` = ?, `tanggal` = ?, `ringkasan` = ?, `isi` = ?, `penulis` = ?, `foto` = ?
            WHERE `id_berita` = ?");
        $stmt->execute([$judul, $kategori, $tanggal, $ringkasan, $isi, $penulis, $foto, $idBerita]);
        sendJsonResponse(['status' => 'success', 'message' => 'Berita/Pengumuman berhasil diperbarui!']);
    } else {
        $stmt = $pdo->prepare("INSERT INTO `berita` 
            (`judul`, `kategori`, `tanggal`, `ringkasan`, `isi`, `penulis`, `foto`)
            VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$judul, $kategori, $tanggal, $ringkasan, $isi, $penulis, $foto]);
        $newId = $pdo->lastInsertId();
        sendJsonResponse(['status' => 'success', 'message' => 'Pengumuman baru berhasil diterbitkan!', 'id_berita' => $newId]);
    }
} catch (PDOException $e) {
    sendJsonResponse(['status' => 'error', 'message' => $e->getMessage()], 500);
}
