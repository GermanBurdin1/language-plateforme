<?php
require 'db.php'; // Подключение к базе данных
require 'vendor/autoload.php';
use Firebase\JWT\JWT;

header('Content-Type: application/json');

// Получаем токен из заголовка Authorization
$authHeader = getallheaders()['Authorization'] ?? '';
$jwt = str_replace('Bearer ', '', $authHeader); // Обрезаем префикс 'Bearer '

try {
    if ($jwt) {
        $key = 'Jefjimfu09!'; // Ваш секретный ключ для JWT
        $decoded = JWT::decode($jwt, new \Firebase\JWT\Key($key, 'HS256'));

        $userId = $decoded->sub; // 'sub' содержит идентификатор пользователя

        // Получаем данные пользователя из базы данных
        $stmt = $pdo->prepare("SELECT * FROM person WHERE id = :userId");
        $stmt->execute([':userId' => $userId]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            unset($user['password']); // Удаляем пароль из данных перед отправкой
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

<!-- Этот код делает следующее:

Извлекает JWT из заголовка авторизации.
Декодирует JWT, используя ваш секретный ключ, и получает идентификатор пользователя.
Использует идентификатор пользователя для извлечения его данных из базы данных.
Возвращает данные пользователя в формате JSON, за исключением пароля. -->