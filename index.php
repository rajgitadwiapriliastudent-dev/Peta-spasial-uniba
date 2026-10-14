<?php
/**
 * Entrypoint PHP Server untuk Sistem Informasi Spasial UNIBA Madura
 */
require_once __DIR__ . '/config/database.php';

// Cek koneksi database MySQL
$isDbConnected = Database::isConnected();

// Baca file index.html dan render dengan meta tag status koneksi
$html = file_get_contents(__DIR__ . '/index.html');

// Sisipkan status PHP & MySQL ke dalam window object sebelum script lain
$statusScript = "
<script>
    window.UNIBA_SERVER_INFO = {
        backend: 'PHP " . PHP_VERSION . "',
        mysqlConnected: " . ($isDbConnected ? 'true' : 'false') . ",
        dbName: '" . DB_NAME . "'
    };
    console.log('⚡ PHP Server Running:', window.UNIBA_SERVER_INFO);
</script>
";

$html = str_replace('</head>', $statusScript . "\n</head>", $html);
echo $html;
