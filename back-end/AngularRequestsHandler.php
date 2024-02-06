<!-- <?php
// Заголовки для CORS и JSON
require 'db.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

// Обработка предзапроса CORS
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// Обработка GET-запроса для проверки уникальности логина
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['e_mail'])) {
    $emailToCheck = $_GET['e_mail'];
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM person WHERE e_mail = :email");
    $stmt->execute([':email' => $emailToCheck]);
    $exists = $stmt->fetchColumn() > 0;

    echo json_encode(['exists' => $exists]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['login'])) {
    $loginToCheck = $_GET['login'];
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM person WHERE login = :login");
    $stmt->execute([':login' => $loginToCheck]);
    $loginExists = $stmt->fetchColumn() > 0;

    echo json_encode(['exists' => $loginExists]);
    exit;
}

$logFile = './logfile.log';

try {
    $inputData = json_decode(file_get_contents('php://input'), true);
    $email = $inputData['e_mail'] ?? null;
    $login = $inputData['login'] ?? null;
    $password = $inputData['password'];
    $name = $inputData['name'];

    if (!empty($email) && !empty($login)) {
        $stmt = $pdo->prepare("INSERT INTO person (e_mail, login, password, name) VALUES (:e_mail, :login, :password, :name)");
        $stmt->execute([':e_mail' => $email, ':login' => $login, ':password' => $password, ':name' => $name]);
    } else {
        throw new Exception("Both email and login are required.");
    }

    echo json_encode(['result' => 'success']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?> -->

<?php
// Заголовки для CORS и JSON
require 'db.php';
require 'vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

// Обработка предзапроса CORS
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// Ваши обработчики GET-запросов остаются без изменений...

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $inputData = json_decode(file_get_contents('php://input'), true);
    $email = $inputData['e_mail'] ?? null;
    $login = $inputData['login'] ?? null;
    $password = $inputData['password'];
    $name = $inputData['name'];

    if (!empty($email) && !empty($login)) {
        // Генерация уникального токена для верификации
        $verificationToken = bin2hex(random_bytes(16));
        
        try {
            $stmt = $pdo->prepare("INSERT INTO person (e_mail, login, password, name, verification_token) VALUES (:e_mail, :login, :password, :name, :verification_token)");
            $stmt->execute([
                ':e_mail' => $email,
                ':login' => $login,
                ':password' => $password,
                ':name' => $name,
                ':verification_token' => $verificationToken
            ]);
            
            // Отправка email с использованием PHPMailer
            sendVerificationEmail($email, $verificationToken); // Вызываем функцию отправки email
            
            echo json_encode(['result' => 'success']);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    } else {
        echo json_encode(['error' => 'Both email and login are required.']);
    }
}

function sendVerificationEmail($email, $verificationToken) {
    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.example.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'your_email@example.com';
        $mail->Password = 'your_password';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        $mail->setFrom('your_email@example.com', 'Your Name');
        $mail->addAddress($email);

        $mail->isHTML(true);
        $mail->Subject = 'Подтверждение регистрации';
        $mail->Body = "Для завершения регистрации, пожалуйста, перейдите по следующей ссылке: http://example.com/verify.php?token={$verificationToken}";

        $mail->send();
    } catch (Exception $e) {
        // Обработка ошибки отправки email
        error_log('Ошибка отправки письма: ' . $mail->ErrorInfo);
    }
}
?>
