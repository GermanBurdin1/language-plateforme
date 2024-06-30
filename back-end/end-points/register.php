<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

require '../vendor/autoload.php'; 
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $inputData = json_decode(file_get_contents('php://input'), true);


    error_log(print_r($inputData, true), 3, "c:/users/germa/onedrive/bureau/projects/learn-lang-plateforme/logs/error.log");

    $email = isset($inputData['e_mail']) ? $inputData['e_mail'] : null;
    $login = isset($inputData['login']) ? $inputData['login'] : null;
    $password = isset($inputData['password']) ? $inputData['password'] : null;
    $role = isset($inputData['role']) ? $inputData['role'] : null;
    $name = isset($inputData['name']) ? $inputData['name'] : null;

    if (!$email || !$login || !$password || !$role || !$name ) {
        echo json_encode(['error' => 'Invalid input data provided.']);
        exit;
    }

    $client = new Client(['base_uri' => 'http://learn-lang-platform.local']);
    // error_log(print_r($client, true), 3, "c:/users/germa/onedrive/bureau/projects/learn-lang-plateforme/logs/error.log");

    try {
        $response = $client->post('c:/users/germa/onedrive/bureau/projects/learn-lang-plateforme/back-end/AngularRequestsHandler.php', [
            'json' => [
                'action' => 'register',
                'e_mail' => $email,
                'login' => $login,
                'password' => $password,

                'role' => $role,
                'name' => $name
            ]
        ]);

        $responseData = json_decode($response->getBody(), true);

        echo json_encode($responseData);
        exit;
    } catch (GuzzleHttp\Exception\ClientException $e) {
        $errorMessage = $e->getResponse()->getBody()->getContents();
        error_log(print_r($errorMessage, true), 3, "c:/users/germa/onedrive/bureau/projects/learn-lang-plateforme/logs/error.log");
        // $responseBody = $e->getResponse() ? $e->getResponse()->getBody() : null;
        // $errorMessage = $responseBody ? json_decode($responseBody, true) : ['error' => 'An error occurred during registration.'];
        // $errorMessage = ['error' => $e->$message];
        // echo json_encode($errorMessage);
        http_response_code(404);
        header('Content-Type: text/html');
        echo $errorMessage;
        exit;
    } catch (GuzzleHttp\Exception\ClientException $e) {
        error_log(print_r([4, 5, 6], true), 3, "c:/users/germa/onedrive/bureau/projects/learn-lang-plateforme/logs/error.log");
        echo json_encode(['error' => 'An unexpected error occurred.']);
        exit;
    }
}
?>

