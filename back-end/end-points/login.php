<?php
require '../db.php'; 
require '../vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use GuzzleHttp\Client;

$key = 'Jefjimfu09!';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204); 
    exit;
}
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $inputData = json_decode(file_get_contents('php://input'), true);
    $email = $inputData['e_mail'] ?? null;
    $password = $inputData['password'] ?? null;

    $user = authenticateUser($email, $password); 

    if ($user) {
        $issuedAt = time();
        $expirationTime = $issuedAt + 3600; 

        $payload = [
            'iss' => 'http://learn-lang-platform.local', 
            'aud' => 'http://learn-lang-platform.local', 
            'iat' => $issuedAt, 
            'exp' => $expirationTime, 
            'sub' => $user['Id_person'], 
        ];
        error_log(print_r($payload, true));//
        $jwt = JWT::encode($payload, $key, 'HS256');

        echo json_encode(['token' => $jwt, 'role' => $user['role'], 'Id_person' => $user['Id_person']]);
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid email or password.']);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
}

function authenticateUser($email, $password) {
    global $pdo; 
    error_log("Authenticating user with email: $email\n", 3, "../logfile.log");
    $stmt = $pdo->prepare("SELECT * FROM person WHERE e_mail = :email");
    $stmt->execute(['email' => $email]);
    
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        error_log("Found user: " . json_encode($user) . "\n", 3, "../logfile.log");
        if (password_verify($password, $user['password'])) {
            error_log("User authenticated successfully: " . json_encode($user) . "\n", 3, "../logfile.log");
            return $user;
        } else {
            error_log("Password does not match for user: " . json_encode($user) . "\n", 3, "../logfile.log");
            return null;
        }
    } else {
        error_log("No user found with email: $email\n", 3, "../logfile.log");
        return null;
    }
}


?>
