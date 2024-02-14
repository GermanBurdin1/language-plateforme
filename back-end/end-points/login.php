<?php
require '../db.php'; // Подключение к базе данных
require '../vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use GuzzleHttp\Client;

// Ключ, используемый для подписи JWT. Должен быть сохранен в безопасном месте!
$key = 'Jefjimfu09!';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Предзапрос CORS успешен
    http_response_code(204); // No Content
    exit;
}
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $inputData = json_decode(file_get_contents('php://input'), true);
    $email = $inputData['e_mail'] ?? null;
    $password = $inputData['password'] ?? null;

    // Предположим, что здесь происходит проверка учетных данных пользователя...
    // Это псевдокод, замените его на вашу логику проверки учетных данных:
    $user = authenticateUser($email, $password); // Функция authenticateUser должна быть реализована вами

    if ($user) {
        // Успешная аутентификация, создаем JWT
        $issuedAt = time();
        $expirationTime = $issuedAt + 3600; // Токен действителен 1 час

        $payload = [
            'iss' => 'http://learn-lang-platform.local', // Издатель
            'aud' => 'http://learn-lang-platform.local', // Аудитория
            'iat' => $issuedAt, // Время выдачи
            'exp' => $expirationTime, // Время истечения
            'sub' => $user['Id_person'], // Идентификатор пользователя
        ];
        error_log(print_r($payload, true));//
        $jwt = JWT::encode($payload, $key, 'HS256');

        // Отправляем токен пользователю
        echo json_encode(['token' => $jwt, 'role' => $user['role']]);
    } else {
        // Неудачная аутентификация
        http_response_code(401);
        echo json_encode(['error' => 'Invalid email or password.']);
    }
} else {
    // Неподдерживаемый метод запроса
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
}

// Функция authenticateUser должна быть определена вами
// Она должна возвращать данные пользователя, если учетные данные верны, или null, если нет
function authenticateUser($email, $password) {
    global $pdo; // Используем глобальный объект PDO для доступа к базе данных
    error_log("Authenticating user with email: $email\n", 3, "../logfile.log");
    // Подготовленный запрос для избежания SQL-инъекций
    $stmt = $pdo->prepare("SELECT * FROM person WHERE e_mail = :email");
    $stmt->execute(['email' => $email]);
    
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        error_log("Found user: " . json_encode($user) . "\n", 3, "../logfile.log");
        if (password_verify($password, $user['password'])) {
            error_log("User authenticated successfully: " . json_encode($user) . "\n", 3, "../logfile.log");
            // Если пароли совпадают
            return $user;
        } else {
            error_log("Password does not match for user: " . json_encode($user) . "\n", 3, "../logfile.log");
            // Неверный пароль
            return null;
        }
    } else {
        error_log("No user found with email: $email\n", 3, "../logfile.log");
        // Пользователь не найден
        return null;
    }
}


?>
