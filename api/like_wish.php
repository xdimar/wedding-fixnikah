<?php
// --- API untuk Menangani Like/Dislike ---

// Mulai session untuk mencegah spam like
session_start();

// Set header untuk respons JSON
header('Content-Type: application/json');
require_once '../config/database.php';

// Fungsi untuk mendapatkan IP address client
function getClientIp() {
    $ipaddress = '';
    if (isset($_SERVER['HTTP_CLIENT_IP']))
        $ipaddress = $_SERVER['HTTP_CLIENT_IP'];
    else if(isset($_SERVER['HTTP_X_FORWARDED_FOR']))
        $ipaddress = $_SERVER['HTTP_X_FORWARDED_FOR'];
    else if(isset($_SERVER['HTTP_X_FORWARDED']))
        $ipaddress = $_SERVER['HTTP_X_FORWARDED'];
    else if(isset($_SERVER['HTTP_FORWARDED_FOR']))
        $ipaddress = $_SERVER['HTTP_FORWARDED_FOR'];
    else if(isset($_SERVER['REMOTE_ADDR']))
        $ipaddress = $_SERVER['REMOTE_ADDR'];
    else
        $ipaddress = 'UNKNOWN';
    return $ipaddress;
}

// Ambil data dari request
 $wishId = $_POST['wish_id'] ?? 0;
 $action = $_POST['action'] ?? ''; // 'like' atau 'dislike'
 $clientIp = getClientIp();
 $sessionKey = 'voted_wish_' . $wishId;

 $response = ['status' => 'error', 'message' => 'Aksi tidak valid.'];

if ($wishId > 0 && in_array($action, ['like', 'dislike'])) {
    
    // Cek apakah user sudah pernah vote untuk wish ini
    if (isset($_SESSION[$sessionKey])) {
        $response['message'] = 'Anda sudah memberikan vote untuk ucapan ini.';
    } else {
        try {
            // Tentukan kolom yang akan diupdate
            $column = ($action === 'like') ? 'likes' : 'dislikes';
            
            // Update database
            $query = "UPDATE wishes SET {$column} = {$column} + 1 WHERE id = ?";
            $stmt = $pdo->prepare($query);
            $stmt->execute([$wishId]);
            
            // Tandai di session bahwa user sudah vote
            $_SESSION[$sessionKey] = true;
            
            $response = ['status' => 'success', 'message' => 'Vote Anda berhasil dicatat!'];

        } catch (PDOException $e) {
            $response['message'] = 'Gagal menyimpan vote. Silakan coba lagi.';
            error_log("Like/Dislike Error: " . $e->getMessage());
        }
    }
}

// Bersihkan output buffer dan kirim respons
ob_clean();
echo json_encode($response);
exit;
?>