
<!-- register.php выступает посредником -->

<?php
require 'vendor/autoload.php'; // Подключаем библиотеку для отправки HTTP запросов
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $inputData = json_decode(file_get_contents('php://input'), true);
    $email = $inputData['email'];
    $login = $inputData['login'];
    $password = $inputData['password'];
    $role = $inputData['role'];

    // Создаем HTTP клиент
    $client = new Client(['base_uri' => 'http://learn-lang-platform.local']);

    // Отправляем запрос на сервер для регистрации нового пользователя
    try {
        $response = $client->post('AngularRequestsHandler.php', [
            'json' => [
                'action' => 'register',
                'email' => $email,
                'login' => $login,
                'password' => $password
            ]
        ]);

        $responseData = json_decode($response->getBody(), true);

        // Выводим результат регистрации
        echo json_encode($responseData);
    } catch (RequestException $e) {
        // Обработка сетевых ошибок
        $responseBody = $e->getResponse() ? $e->getResponse()->getBody(true) : null;
        $errorMessage = $responseBody ? json_decode($responseBody, true) : ['error' => 'An error occurred during registration.'];
        echo json_encode($errorMessage);
    } catch (Exception $e) {
        // Обработка прочих ошибок
        echo json_encode(['error' => 'An unexpected error occurred.']);
    }
}
?>

