<!-- <?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['e_mail'])) {
    // Фильтрация и очистка полученных данных
    $email = filter_var($_POST['e_mail'], FILTER_SANITIZE_EMAIL);
    
    // Создаем новый экземпляр PHPMailer
    $mail = new PHPMailer(true);

    try {
        //Server settings
        $mail->isSMTP();
        $mail->Host = 'smtp.example.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'your_email@example.com';
        $mail->Password = 'your_password';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;
        
        // Recipients
        $mail->setFrom('your_email@example.com', 'Your Name');
        $mail->addAddress($email); // Добавляем получателя

        // Генерация токена и подготовка тела письма
        $verificationToken = bin2hex(random_bytes(16)); // Генерируем уникальный токен
        $mail->isHTML(true); // Устанавливаем формат письма как HTML
        $mail->Subject = 'Подтверждение регистрации';
        $mail->Body = "Для завершения регистрации, пожалуйста, перейдите по следующей ссылке: http://example.com/verify.php?token={$verificationToken}";
        $mail->send();
        echo 'Сообщение было отправлено.';
    } catch (Exception $e) {
        echo "Сообщение не было отправлено. Ошибка: {$mail->ErrorInfo}";
    }
} else {
    echo 'Ошибка: Email не предоставлен.';
}
?> -->
