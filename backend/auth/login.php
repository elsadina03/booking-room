<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

include "../config/koneksi.php";

$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

if (empty($email) || empty($password)) {
    echo json_encode([
        "success" => false,
        "message" => "Email dan password wajib diisi"
    ]);
    exit;
}

$stmt = $conn->prepare("SELECT id, nama, email, password FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();

    if (password_verify($password, $user['password'])) {
        echo json_encode([
            "success" => true,
            "message" => "Login berhasil",
            "user" => [
                "id" => $user["id"],
                "nama" => $user["nama"],
                "email" => $user["email"]
            ]
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Password salah"
        ]);
    }
} else {
    echo json_encode([
        "success" => false,
        "message" => "Email tidak ditemukan"
    ]);
}
?>