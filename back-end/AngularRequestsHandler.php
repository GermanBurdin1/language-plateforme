<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

$host = 'localhost';
$db = 'plateforme_lang';
$user = 'votre_user';
$pass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
];

$logFile = './logfile.log';

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
    $inputData = json_decode(file_get_contents('php://input'), true);
    
    $logMessage = "Received POST Request: " . json_encode($inputData) . " at " . date('Y-m-d H:i:s') . PHP_EOL;
    file_put_contents($logFile, $logMessage, FILE_APPEND);

    $email = isset($inputData['e_mail']) ? $inputData['e_mail'] : null;
    $login = isset($inputData['login']) ? $inputData['login'] : null;
    $password = $inputData['password'];
    $name = $inputData['name'];

    if (!empty($email)) {
        $stmt = $pdo->prepare("INSERT INTO person (e_mail, password, name) VALUES (:e_mail, :password, :name)");
        $stmt->execute([':e_mail' => $email, ':password' => $password, ':name' => $name]);
        $registrationInfo = $email;
    } elseif (!empty($login)) {
        $stmt = $pdo->prepare("INSERT INTO person (login, password, name) VALUES (:login, :password, :name)");
        $stmt->execute([':login' => $login, ':password' => $password, ':name' => $name]);
        $registrationInfo = $login;
    } else {
        // Обработка ошибки, если и e-mail, и логин не предоставлены
        throw new Exception("Neither e-mail nor login was provided.");
    }

    $successLogMessage = "Successful Registration: " . $registrationInfo . " at " . date('Y-m-d H:i:s') . PHP_EOL;
    file_put_contents($logFile, $successLogMessage, FILE_APPEND);
    
    echo json_encode(['result' => 'success']);
    
} catch (Exception $e) {
    $errorLogMessage = "Error: " . $e->getMessage() . " at " . date('Y-m-d H:i:s') . PHP_EOL;
    file_put_contents($logFile, $errorLogMessage, FILE_APPEND);

    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
