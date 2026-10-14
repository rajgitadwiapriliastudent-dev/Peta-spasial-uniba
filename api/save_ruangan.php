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
        $id = intval($input['id_ruangan'] ?? $_GET['id_ruangan'] ?? 0);
        if ($id <= 0) sendJsonResponse(['status' => 'error', 'message' => 'ID Ruangan tidak valid'], 400);

        $stmt = $pdo->prepare("DELETE FROM `ruangan` WHERE `id_ruangan` = ?");
        $stmt->execute([$id]);
        sendJsonResponse(['status' => 'success', 'message' => 'Ruangan berhasil dihapus!']);
    }

    $idRuangan = intval($input['id_ruangan'] ?? 0);
    $idGedung = intval($input['id_gedung'] ?? 0);
    $idLantai = intval($input['id_lantai'] ?? 0);
    $kode = trim($input['kode_ruangan'] ?? '');
    $nama = trim($input['nama_ruangan'] ?? '');
    $jenis = trim($input['jenis_ruangan'] ?? 'Ruang Kelas');
    $kapasitas = intval($input['kapasitas'] ?? 30);
    $fasilitas = trim($input['fasilitas'] ?? '');
    $pic = trim($input['penanggung_jawab'] ?? '');
    $jam = trim($input['jam_operasional'] ?? '07.30 - 17.00 WIB');
    $deskripsi = trim($input['deskripsi'] ?? '');
    $foto = trim($input['foto'] ?? 'assets/img/rooms/kelas_standar.svg');
    $x = intval($input['denah_x'] ?? 50);
    $y = intval($input['denah_y'] ?? 50);
    $w = intval($input['denah_w'] ?? 180);
    $h = intval($input['denah_h'] ?? 120);
    $nodeAkses = !empty($input['node_akses_id']) ? trim($input['node_akses_id']) : null;

    if (empty($kode) || empty($nama) || $idGedung <= 0 || $idLantai <= 0) {
        sendJsonResponse(['status' => 'error', 'message' => 'Gedung, Lantai, Kode, dan Nama Ruangan wajib diisi!'], 400);
    }

    if ($idRuangan > 0) {
        $stmt = $pdo->prepare("UPDATE `ruangan` SET 
            `id_gedung` = ?, `id_lantai` = ?, `kode_ruangan` = ?, `nama_ruangan` = ?, `jenis_ruangan` = ?, 
            `kapasitas` = ?, `fasilitas` = ?, `penanggung_jawab` = ?, `jam_operasional` = ?, 
            `deskripsi` = ?, `foto` = ?, `denah_x` = ?, `denah_y` = ?, `denah_w` = ?, `denah_h` = ?, `node_akses_id` = ?
            WHERE `id_ruangan` = ?");
        $stmt->execute([$idGedung, $idLantai, $kode, $nama, $jenis, $kapasitas, $fasilitas, $pic, $jam, $deskripsi, $foto, $x, $y, $w, $h, $nodeAkses, $idRuangan]);
        sendJsonResponse(['status' => 'success', 'message' => 'Data ruangan berhasil diperbarui!']);
    } else {
        $stmt = $pdo->prepare("INSERT INTO `ruangan` 
            (`id_gedung`, `id_lantai`, `kode_ruangan`, `nama_ruangan`, `jenis_ruangan`, `kapasitas`, `fasilitas`, `penanggung_jawab`, `jam_operasional`, `deskripsi`, `foto`, `denah_x`, `denah_y`, `denah_w`, `denah_h`, `node_akses_id`)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$idGedung, $idLantai, $kode, $nama, $jenis, $kapasitas, $fasilitas, $pic, $jam, $deskripsi, $foto, $x, $y, $w, $h, $nodeAkses]);
        $newId = $pdo->lastInsertId();
        sendJsonResponse(['status' => 'success', 'message' => 'Ruangan baru berhasil ditambahkan!', 'id_ruangan' => $newId]);
    }
} catch (PDOException $e) {
    sendJsonResponse(['status' => 'error', 'message' => $e->getMessage()], 500);
}
