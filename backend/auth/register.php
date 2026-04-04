<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

error_reporting(E_ALL);
ini_set('display_errors', 1);

include "../config/koneksi.php";

$nama = $_POST['nama'] ?? '';
$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

if (empty($nama) || empty($email) || empty($password)) {
    echo json_encode([
        "success" => false,
        "message" => "Semua field wajib diisi"
    ]);
    exit;
}

$stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
if (!$stmt) {
    echo json_encode([
        "success" => false,
        "message" => "Prepare SELECT gagal",
        "error" => $conn->error
    ]);
    exit;
}

$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode([
        "success" => false,
        "message" => "Email sudah terdaftar"
    ]);
    exit;
}

$passwordHash = password_hash($password, PASSWORD_DEFAULT);

$stmt = $conn->prepare("INSERT INTO users (nama, email, password) VALUES (?, ?, ?)");
if (!$stmt) {
    echo json_encode([
        "success" => false,
        "message" => "Prepare INSERT gagal",
        "error" => $conn->error
    ]);
    exit;
}

$stmt->bind_param("sss", $nama, $email, $passwordHash);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Register berhasil",
        "user" => [
            "nama" => $nama,
            "email" => $email
        ]
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Register gagal",
        "error" => $stmt->error
    ]);
}
?>