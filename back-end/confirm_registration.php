<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

// Create a new PHPMailer instance
$mail = new PHPMailer;

// Enable verbose debug output
$mail->SMTPDebug = SMTP::DEBUG_SERVER;

// Set up the SMTP server
$mail->isSMTP();
$mail->Host = 'smtp.example.com';
$mail->SMTPAuth = true;
$mail->Username = 'your_email@example.com';
$mail->Password = 'your_password';
$mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
$mail->Port = 587;

// Set up the sender
$mail->setFrom('your_email@example.com', 'Your Name');

try {
    $verificationToken = bin2hex(random_bytes(16)); // Генерируем уникальный токен

    // Подготавливаем запрос на вставку данных с токеном верификации
    $stmt = $pdo->prepare("INSERT INTO person (e_mail, login, password, name, verification_token) VALUES (:e_mail, :login, :password, :name, :verification_token)");
    
    // Выполняем запрос с токеном верификации
    $stmt->execute([
        ':e_mail' => $email,
        ':login' => $login,
        ':password' => $password,
        ':name' => $name,
        ':verification_token' => $verificationToken
    ]);
} catch (PDOException $e) {
    echo "Ошибка: " . $e->getMessage(); // Выводим сообщение об ошибке
    // Дополнительные действия при ошибке, например, логирование
}

// Send email with verification token
$mail->addAddress($email);
$mail->Subject = 'Подтверждение регистрации';
$mail->Body = 'Для завершения регистрации, перейдите по следующей ссылке: ' . 'http://example.com/verify.php?token=' . $verificationToken;

if ($mail->send()) {
    echo "Письмо с инструкциями по подтверждению регистрации отправлено на вашу электронную почту.";
} else {
    echo "Ошибка отправки письма: " . $mail->ErrorInfo;
}