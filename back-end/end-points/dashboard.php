<?php
require 'db.php'; 
require 'vendor/autoload.php';
use Firebase\JWT\JWT;

header('Content-Type: application/json');

$authHeader = getallheaders()['Authorization'] ?? '';
$jwt = str_replace('Bearer ', '', $authHeader); 

try {
    if ($jwt) {
        $key = 'Jefjimfu09!'; 
        $decoded = JWT::decode($jwt, new \Firebase\JWT\Key($key, 'HS256'));

        $userId = $decoded->sub; 

        $stmt = $pdo->prepare("SELECT * FROM person WHERE id = :userId");
        $stmt->execute([':userId' => $userId]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            unset($user['password']); 
            echo json_encode(['dashboardData' => $user]);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'User not found.']);
        }
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Token not provided or invalid.']);
    }
} catch (\Firebase\JWT\ExpiredException $e) {
    http_response_code(401);
    echo json_encode(['error' => 'Token expired.']);
} catch (\Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'An error occurred processing your request.']);
}
?>

