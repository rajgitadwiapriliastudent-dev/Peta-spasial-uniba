<?php
/**
 * Konfigurasi Database MySQL & Helper API
 * Sistem Informasi Spasial UNIBA Madura
 */

define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'uniba_spasial');
define('DB_PORT', 3306);

class Database {
    private static ?PDO $pdo = null;
    private static bool $connectionAttempted = false;
    private static ?string $errorMessage = null;

    public static function getConnection(): ?PDO {
        if (self::$pdo !== null) {
            return self::$pdo;
        }

        if (self::$connectionAttempted && self::$pdo === null) {
            return null;
        }

        self::$connectionAttempted = true;

        try {
            $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=utf8mb4";
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
                PDO::ATTR_TIMEOUT            => 3,
            ];
            self::$pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
            return self::$pdo;
        } catch (PDOException $e) {
            self::$errorMessage = $e->getMessage();
            // Coba periksa apakah server MySQL hidup tetapi database belum dibuat
            try {
                $rawPdo = new PDO("mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";charset=utf8mb4", DB_USER, DB_PASS, [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_TIMEOUT => 2
                ]);
                // Server MySQL aktif, arahkan user ke setup
                self::$errorMessage = "Database 'uniba_spasial' belum diimpor. Silakan jalankan config/setup_db.php";
            } catch (PDOException $ex) {
                self::$errorMessage = "Tidak dapat terhubung ke MySQL. Pastikan MySQL di XAMPP Control Panel telah dijalankan (Start).";
            }
            return null;
        }
    }

    public static function isConnected(): bool {
        return self::getConnection() !== null;
    }

    public static function getErrorMessage(): ?string {
        return self::$errorMessage;
    }
}

/**
 * Helper untuk response JSON API
 */
function sendJsonResponse(array $data, int $statusCode = 200): void {
    if (!headers_sent()) {
        http_response_code($statusCode);
        header('Content-Type: application/json; charset=utf-8');
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
    }
    echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}
