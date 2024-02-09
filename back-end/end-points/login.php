<!-- login.php содержит только код, который создает и возвращает JWT токен: -->

<?php
// Код для login.php
require 'db.php'; // Подключение к базе данных
require 'vendor/autoload.php';

use GuzzleHttp\Client;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $inputData = json_decode(file_get_contents('php://input'), true);
    $email = $inputData['email'] ?? null;
    $password = $inputData['password'] ?? null;

    // Создаем HTTP клиент
    $client = new Client(['base_uri' => 'http://learn-lang-platform.local']);

    // Отправляем запрос на сервер для аутентификации (логина)
    try {
        $response = $client->post('AngularRequestsHandler.php', [
            'json' => [
                'action' => 'login',
                'email' => $email,
                'password' => $password
            ]
        ]);

        $responseData = json_decode($response->getBody(), true);

        // Выводим результат аутентификации
        echo json_encode($responseData);
    } catch (Exception $e) {
        // Обработка ошибок
        echo json_encode(['error' => 'An error occurred during login.']);
    }
}
?>
