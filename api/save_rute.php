<?php
/**
 * API CRUD Node & Edge Jaringan Rute (Algoritma Dijkstra)
 * Sistem Informasi Spasial Kampus UNIBA Madura
 */
require_once __DIR__ . '/../config/database.php';

$pdo = Database::getConnection();
if (!$pdo) {
    sendJsonResponse(['status' => 'offline', 'message' => 'Database MySQL tidak aktif.'], 200);
}

$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
$action = $input['action'] ?? $_GET['action'] ?? '';

try {
    // 1. SIMPAN NODE
    if ($action === 'save_node') {
        $idNode = trim($input['id_node'] ?? '');
        $namaNode = trim($input['nama_node'] ?? '');
        $jenisNode = trim($input['jenis_node'] ?? 'outdoor');
        $gedungId = !empty($input['gedung_id']) ? intval($input['gedung_id']) : null;
        $lantai = intval($input['lantai'] ?? 1);
        $x = intval($input['x'] ?? 0);
        $y = intval($input['y'] ?? 0);

        if (empty($idNode) || empty($namaNode)) {
            sendJsonResponse(['status' => 'error', 'message' => 'ID Node dan Nama Node wajib diisi!'], 400);
        }

        // Cek apakah node sudah ada
        $check = $pdo->prepare("SELECT COUNT(*) FROM `node_rute` WHERE `id_node` = ?");
        $check->execute([$idNode]);
        $exists = $check->fetchColumn() > 0;

        if ($exists) {
            $stmt = $pdo->prepare("UPDATE `node_rute` SET 
                `nama_node` = ?, `jenis_node` = ?, `id_gedung` = ?, `id_lantai` = ?, `koordinat_x` = ?, `koordinat_y` = ?
                WHERE `id_node` = ?");
            $stmt->execute([$namaNode, $jenisNode, $gedungId, $lantai, $x, $y, $idNode]);
            sendJsonResponse(['status' => 'success', 'message' => 'Node rute berhasil diperbarui!']);
        } else {
            $stmt = $pdo->prepare("INSERT INTO `node_rute` 
                (`id_node`, `nama_node`, `jenis_node`, `id_gedung`, `id_lantai`, `koordinat_x`, `koordinat_y`)
                VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$idNode, $namaNode, $jenisNode, $gedungId, $lantai, $x, $y]);
            sendJsonResponse(['status' => 'success', 'message' => 'Node rute baru berhasil ditambahkan!']);
        }
    }

    // 2. HAPUS NODE
    elseif ($action === 'delete_node') {
        $idNode = trim($input['id_node'] ?? $_GET['id_node'] ?? '');
        if (empty($idNode)) sendJsonResponse(['status' => 'error', 'message' => 'ID Node tidak valid'], 400);

        // Hapus edge yang terhubung terlebih dahulu
        $stmtEdge = $pdo->prepare("DELETE FROM `edge_rute` WHERE `node_awal` = ? OR `node_tujuan` = ?");
        $stmtEdge->execute([$idNode, $idNode]);

        $stmt = $pdo->prepare("DELETE FROM `node_rute` WHERE `id_node` = ?");
        $stmt->execute([$idNode]);
        sendJsonResponse(['status' => 'success', 'message' => 'Node dan edge terkait berhasil dihapus!']);
    }

    // 3. SIMPAN EDGE
    elseif ($action === 'save_edge') {
        $idEdge = intval($input['id_edge'] ?? 0);
        $nodeAwal = trim($input['node_awal'] ?? '');
        $nodeTujuan = trim($input['node_tujuan'] ?? '');
        $jarak = floatval($input['jarak'] ?? 10);
        $jenisJalur = trim($input['jenis_jalur'] ?? 'pedestrian');

        if (empty($nodeAwal) || empty($nodeTujuan)) {
            sendJsonResponse(['status' => 'error', 'message' => 'Node Awal dan Node Tujuan wajib diisi!'], 400);
        }

        if ($nodeAwal === $nodeTujuan) {
            sendJsonResponse(['status' => 'error', 'message' => 'Node Awal dan Node Tujuan tidak boleh sama!'], 400);
        }

        if ($idEdge > 0) {
            $stmt = $pdo->prepare("UPDATE `edge_rute` SET 
                `node_awal` = ?, `node_tujuan` = ?, `jarak` = ?, `jenis_jalur` = ?
                WHERE `id_edge` = ?");
            $stmt->execute([$nodeAwal, $nodeTujuan, $jarak, $jenisJalur, $idEdge]);
            sendJsonResponse(['status' => 'success', 'message' => 'Edge penghubung berhasil diperbarui!']);
        } else {
            $stmt = $pdo->prepare("INSERT INTO `edge_rute` 
                (`node_awal`, `node_tujuan`, `jarak`, `jenis_jalur`)
                VALUES (?, ?, ?, ?)");
            $stmt->execute([$nodeAwal, $nodeTujuan, $jarak, $jenisJalur]);
            $newId = $pdo->lastInsertId();
            sendJsonResponse(['status' => 'success', 'message' => 'Edge penghubung baru berhasil ditambahkan!', 'id_edge' => $newId]);
        }
    }

    // 4. HAPUS EDGE
    elseif ($action === 'delete_edge') {
        $idEdge = intval($input['id_edge'] ?? $_GET['id_edge'] ?? 0);
        if ($idEdge <= 0) sendJsonResponse(['status' => 'error', 'message' => 'ID Edge tidak valid'], 400);

        $stmt = $pdo->prepare("DELETE FROM `edge_rute` WHERE `id_edge` = ?");
        $stmt->execute([$idEdge]);
        sendJsonResponse(['status' => 'success', 'message' => 'Edge berhasil dihapus!']);
    }

    // 5. AMBIL SEMUA DATA JARINGAN (NODES & EDGES)
    elseif ($action === 'get_network') {
        $nodes = $pdo->query("SELECT * FROM `node_rute` ORDER BY `jenis_node`, `id_node`")->fetchAll();
        $edges = $pdo->query("SELECT * FROM `edge_rute` ORDER BY `id_edge`")->fetchAll();

        sendJsonResponse([
            'status' => 'success',
            'data' => [
                'nodes' => $nodes,
                'edges' => $edges
            ]
        ]);
    }

    else {
        sendJsonResponse(['status' => 'error', 'message' => 'Aksi rute tidak dikenali'], 400);
    }
} catch (PDOException $e) {
    sendJsonResponse(['status' => 'error', 'message' => $e->getMessage()], 500);
}
