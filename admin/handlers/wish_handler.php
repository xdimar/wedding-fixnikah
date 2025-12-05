<?php
// --- Handler untuk Menghapus Data Ucapan ---

// Sertakan file konfigurasi database
require_once '../../config/database.php';

// Cek apakah ada aksi hapus dan ID yang dikirim
if (isset($_GET['action']) && $_GET['action'] == 'delete' && isset($_GET['id'])) {
    
    // Ambil ID dari URL
    $id = $_GET['id'];
    
    try {
        // Siapkan query untuk menghapus data berdasarkan ID
        $stmt = $pdo->prepare("DELETE FROM wishes WHERE id = ?");
        
        // Eksekusi query
        $stmt->execute([$id]);
        
        // Jika berhasil, tidak perlu melakukan apa-apa, langsung redirect
        
    } catch (PDOException $e) {
        // Jika terjadi error, bisa log error di sini (opsional)
        error_log("Wish Delete Error: " . $e->getMessage());
        // Jangan tampilkan error ke user untuk keamanan
    }
}

// Redirect kembali ke halaman dashboard utama
header('Location: ../dashboard.php');
exit;
?>