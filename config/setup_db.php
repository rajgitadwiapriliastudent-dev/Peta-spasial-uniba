<?php
/**
 * Script Otomatis Setup & Import Database MySQL
 * Sistem Informasi Spasial UNIBA Madura
 */
require_once __DIR__ . '/database.php';

$message = '';
$status = 'info';
$details = [];

if (isset($_POST['install']) || isset($_GET['auto'])) {
    try {
        $pdo = new PDO("mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";charset=utf8mb4", DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
        ]);

        $sqlFile = __DIR__ . '/../database/uniba_spasial.sql';
        if (!file_exists($sqlFile)) {
            throw new Exception("File database SQL tidak ditemukan di $sqlFile");
        }

        $sqlContent = file_get_contents($sqlFile);
        
        // Eksekusi query
        $pdo->exec("CREATE DATABASE IF NOT EXISTS `" . DB_NAME . "` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
        $pdo->exec("USE `" . DB_NAME . "`;");

        // Split by statement
        $statements = array_filter(array_map('trim', explode(';', $sqlContent)));
        $executed = 0;
        foreach ($statements as $stmt) {
            if (!empty($stmt)) {
                $pdo->exec($stmt);
                $executed++;
            }
        }

        // Hitung baris tabel
        $tables = ['gedung', 'lantai', 'ruangan', 'fasilitas', 'berita', 'users', 'node_rute', 'edge_rute'];
        foreach ($tables as $t) {
            $stmt = $pdo->query("SELECT COUNT(*) FROM `$t`");
            $cnt = $stmt->fetchColumn();
            $details[] = "Tabel <b>$t</b> siap: $cnt data record.";
        }

        $status = 'success';
        $message = "Database <b>" . DB_NAME . "</b> dan seluruh tabel berhasil diinisialisasi & diisi data awal!";
    } catch (Exception $e) {
        $status = 'danger';
        $message = "Terjadi kesalahan saat inisialisasi: " . htmlspecialchars($e->getMessage());
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inisialisasi Database - Sistem Informasi Spasial UNIBA Madura</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            background: linear-gradient(135deg, #064e3b 0%, #047857 50%, #065f46 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .setup-card {
            background: #ffffff;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.25);
            max-width: 620px;
            width: 100%;
            overflow: hidden;
        }
        .setup-header {
            background: #f8fafc;
            border-bottom: 1px solid #e2e8f0;
            padding: 25px 30px;
            text-align: center;
        }
        .btn-uniba {
            background: #047857;
            color: #ffffff;
            font-weight: 600;
            padding: 12px 24px;
            border-radius: 12px;
            border: none;
            transition: all 0.2s;
        }
        .btn-uniba:hover {
            background: #065f46;
            color: #ffffff;
            transform: translateY(-2px);
        }
    </style>
</head>
<body>

<div class="setup-card">
    <div class="setup-header">
        <img src="../assets/img/logo_uniba.png" alt="Logo Resmi UNIBA Madura" height="68" class="mb-2" style="object-fit: contain;">
        <h4 class="fw-bold text-dark mb-1">Inisialisasi Database Sistem</h4>
        <p class="text-muted small mb-0">Sistem Informasi Spasial Interaktif Kampus UNIBA Madura</p>
    </div>

    <div class="p-4 p-md-5">
        <?php if ($message): ?>
            <div class="alert alert-<?= $status ?> d-flex align-items-center mb-4" role="alert">
                <i class="bi <?= $status === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill' ?> fs-4 me-3"></i>
                <div><?= $message ?></div>
            </div>

            <?php if (!empty($details)): ?>
                <div class="card bg-light border-0 rounded-3 p-3 mb-4">
                    <h6 class="fw-bold text-success mb-2"><i class="bi bi-database-check me-2"></i>Rincian Data Tersedia:</h6>
                    <ul class="list-unstyled mb-0 small text-secondary">
                        <?php foreach ($details as $d): ?>
                            <li class="py-1"><i class="bi bi-check2 text-success me-2"></i><?= $d ?></li>
                        <?php endforeach; ?>
                    </ul>
                </div>
            <?php endif; ?>

            <div class="d-grid gap-2">
                <a href="../index.html" class="btn btn-uniba btn-lg">
                    <i class="bi bi-box-arrow-up-right me-2"></i>Buka Sistem Informasi Spasial UNIBA
                </a>
                <a href="../index.php" class="btn btn-outline-success btn-lg">
                    <i class="bi bi-code-slash me-2"></i>Buka Versi PHP Server (index.php)
                </a>
            </div>
        <?php else: ?>
            <p class="text-secondary">
                Klik tombol di bawah untuk membuat database <code>uniba_spasial</code> dan mengisi seluruh tabel dengan data spasial kampus UNIBA Madura secara otomatis.
            </p>
            <div class="alert alert-light border d-flex align-items-center mb-4">
                <i class="bi bi-info-circle text-primary fs-4 me-3"></i>
                <div class="small text-muted">
                    Pastikan service <b>MySQL</b> di XAMPP Control Panel sudah berstatus <b>Running (Start)</b>.
                </div>
            </div>

            <form method="POST">
                <button type="submit" name="install" value="1" class="btn btn-uniba w-100 py-3 fs-5">
                    <i class="bi bi-play-circle-fill me-2"></i>Jalankan Setup &amp; Import Database
                </button>
            </form>
            <div class="text-center mt-3">
                <a href="../index.html" class="text-muted text-decoration-none small">
                    <i class="bi bi-arrow-left me-1"></i>Kembali ke Halaman Utama tanpa setup
                </a>
            </div>
        <?php endif; ?>
    </div>
</div>

</body>
</html>
