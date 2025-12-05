<?php
// --- Server-Sent Events untuk Update Ucapan Real-Time ---

header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');
header('Connection: keep-alive');

require_once '../config/database.php';

// Simpan ID wish terakhir yang dikirim untuk mencegah duplikat
 $lastSentWishId = 0;

while (true) {
    // Ambil wish terbaru dari database
    $stmt = $pdo->query("SELECT id, name, message, likes, dislikes, created_at FROM wishes ORDER BY created_at DESC LIMIT 1");
    $latestWish = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($latestWish && $latestWish['id'] > $lastSentWishId) {
        
        // Format data
        $data = [
            'id' => $latestWish['id'],
            'name' => htmlspecialchars($latestWish['name']),
            'message' => htmlspecialchars($latestWish['message']),
            'likes' => $latestWish['likes'],
            'dislikes' => $latestWish['dislikes'],
            'created_at_formatted' => date('d M Y', strtotime($latestWish['created_at']))
        ];

        // Kirim data ke client
        echo "data: " . json_encode($data) . "\n\n";
        
        // Flush output buffer
        ob_flush();
        flush();

        // Update ID terakhir yang dikirim
        $lastSentWishId = $latestWish['id'];
    }

    // Tunggu 2 detik sebelum mengecek lagi
    sleep(3);
}
?>