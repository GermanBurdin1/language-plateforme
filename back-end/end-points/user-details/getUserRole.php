<?php

require '../../db.php';
require '../../vendor/autoload.php';
use Firebase\JWT\JWT;

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Возвращаем только заголовки для предзапроса OPTIONS
    http_response_code(204);
    exit;
}

// Получаем токен из заголовка Authorization
$authHeader = getallheaders()['Authorization'] ?? '';
$jwt = str_replace('Bearer ', '', $authHeader); // Обрезаем префикс 'Bearer '

try {
    if ($jwt) {
        $key = 'Jefjimfu09!'; // Ваш секретный ключ для JWT
        $decoded = JWT::decode($jwt, new \Firebase\JWT\Key($key, 'HS256'));

        // Проверяем, содержит ли токен id пользователя в полезной нагрузке
        if (isset($decoded->sub)) {
            $userId = $decoded->sub;
            $stmt = $pdo->prepare("SELECT role FROM person WHERE Id_person = :userId");
            $stmt->execute([':userId' => $userId]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user) {
                echo json_encode(['role' => $user['role']]);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'User not found.']);
            }
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'User ID not found in token.']);
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