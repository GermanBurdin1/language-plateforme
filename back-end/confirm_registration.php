<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['e_mail'])) {
    $email = filter_var($_POST['e_mail'], FILTER_SANITIZE_EMAIL);
    
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
        $mail->addAddress($email); 

        $verificationToken = bin2hex(random_bytes(16)); 
        $mail->isHTML(true); 
        $mail->Subject = 'Confirmation d\'inscription';
        $mail->Body = "Pour finaliser l\'inscription, veuillez suivre le lien suivant: http://example.com/verify.php?token={$verificationToken}";
        $mail->send();
        echo 'Le message n\'a pas été envoyé.';
    } catch (Exception $e) {
        echo "Le message n_\'a pas été envoyé. Erreur: {$mail->ErrorInfo}";
    }
} else {
    echo 'Erreur : Email non fourni';
}
?> 
