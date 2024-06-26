<?php
// Заголовки для CORS и JSON

ini_set('error_log', 'logfile.log');

require 'db.php';
require 'vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

// error_log(print_r([1, 2, 3], true), 3, "c:/users/germa/onedrive/bureau/projects/learn-lang-plateforme/logs/error.log");

// Обработка предзапроса CORS
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// Обработка GET-запроса для проверки существования e-mail
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['e_mail'])) {
    $emailToCheck = $_GET['e_mail'];
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM person WHERE e_mail = :email");
    $stmt->execute([':email' => $emailToCheck]);
    $emailExists = $stmt->fetchColumn() > 0;

    // Важно: всегда возвращаем JSON объект с ключом 'exists'
    echo json_encode(['exists' => $emailExists]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['login'])) {
    $loginToCheck = $_GET['login'];
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM person WHERE login = :login");
    $stmt->execute([':login' => $loginToCheck]);
    $loginExists = $stmt->fetchColumn() > 0;

    // Важно: всегда возвращаем JSON объект с ключом 'exists'
    echo json_encode(['exists' => $loginExists]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $inputData = json_decode(file_get_contents('php://input'), true);

    error_log(print_r($inputData, true), 3, "c:/users/germa/onedrive/bureau/projects/learn-lang-plateforme/logs/error.log");
    
    $email = $inputData['e_mail'] ?? null;
    $login = $inputData['login'] ?? null;
    $password = $inputData['password'];
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    $name = $inputData['name'];
    // $role = $inputData['role'];
    $role = $inputData['role'] ?? null; // Получаем роль пользователя из входных данных

    // Массив допустимых значений для роли
    $validRoles = ['teacher', 'student'];

    // Проверяем, что полученная роль действительно присутствует в массиве допустимых значений
    if (!in_array($role, $validRoles)) {
        // Если полученное значение роли не соответствует допустимым вариантам, возвращаем ошибку
        http_response_code(400); // Устанавливаем код состояния HTTP 400 Bad Request
        echo json_encode(['error' => 'Invalid role specified.']);
        exit; // Прекращаем выполнение скрипта
    }

    if (!empty($email) && !empty($login) && !empty($role)) {
        $checkEmailStmt = $pdo->prepare("SELECT COUNT(*) FROM person WHERE e_mail = :e_mail");
        $checkEmailStmt->execute([':e_mail' => $email]);
        if ($checkEmailStmt->fetchColumn() > 0) {
            http_response_code(400); // Устанавливаем код состояния 400 (Bad Request)
            echo json_encode(['error' => 'Such an email already exists, please use another email.']);
            exit;
        }

        $checkLoginStmt = $pdo->prepare("SELECT COUNT(*) FROM person WHERE login = :login");
        $checkLoginStmt->execute([':login' => $login]);
        if ($checkLoginStmt->fetchColumn() > 0) {
            http_response_code(400); // Устанавливаем код состояния 400 (Bad Request)
            echo json_encode(['error' => 'Such a login already exists, please use another login.']);
            exit; 
        }

        try {
            $verificationToken = bin2hex(random_bytes(16));
            $stmt = $pdo->prepare("INSERT INTO person (e_mail, login, password, name, role,verification_token, role) VALUES (:e_mail, :login, :password, :name, :role, :verification_token, :role)");
            $stmt->execute([
                ':e_mail' => $email,
                ':login' => $login,
                ':password' => $hashedPassword,
                ':name' => $name,
                ':verification_token' => $verificationToken,
                ':role' => $role
            ]);
        
            sendVerificationEmail($email, $verificationToken);
        
            echo json_encode(['result' => 'success']);
        } catch (PDOException $e) {
            if ($e->getCode() == 23000) {
                echo json_encode(['error' => 'An account with this email or login already exists.']);
            } else {
                http_response_code(500);
                echo json_encode(['error' => $e->getMessage()]);
            }
        }
    } else {
        echo json_encode(['error' => 'Both email,login and role are required.']);
    }
}

function sendVerificationEmail($email, $verificationToken) {
    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'germanburdin1@gmail.com';
        $mail->Password = 'sqpbwdpzsubrfzka';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port = 465;

        $mail->setFrom('germanburdin1@gmail.com', 'Universe Languages');
        $mail->addAddress($email);

        $mail->isHTML(true);
        $mail->Subject = 'Registration confirmation';
        $mail->Body = "Для завершения регистрации, пожалуйста, перейдите по следующей ссылке: http://learn-lang-platform.local/back-end/verify.php?token={$verificationToken}";

        $mail->send();
    } catch (Exception $e) {
        // Обработка ошибки отправки email
        error_log('Ошибка отправки письма: ' . $mail->ErrorInfo);
    }
}
?>
