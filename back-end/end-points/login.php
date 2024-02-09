<!-- login.php содержит только код, который создает и возвращает JWT токен: -->

<?php
require 'db.php'; // Подключение к базе данных
require 'vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use GuzzleHttp\Client;

// Ключ, используемый для подписи JWT. Должен быть сохранен в безопасном месте!
$key = 'Jefjimfu09!';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $inputData = json_decode(file_get_contents('php://input'), true);
    $email = $inputData['email'] ?? null;
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
            'sub' => $user['id'], // Идентификатор пользователя
        ];
        error_log(print_r($payload, true));//
        $jwt = JWT::encode($payload, $key, 'HS256');

        // Отправляем токен пользователю
        echo json_encode(['token' => $jwt]);
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

    // Подготовленный запрос для избежания SQL-инъекций
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = :email");
    $stmt->execute(['email' => $email]);
    
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['password'])) {
        // Если пользователь найден и пароли совпадают
        return $user; // Возвращаем данные пользователя
    } else {
        // Неверные учетные данные
        return null;
    }
}

?>
