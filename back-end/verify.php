<?php
require 'db.php';
try {
    if (isset($_GET['token'])) {
        $token = $_GET['token'];

        $stmt = $pdo->prepare("SELECT * FROM person WHERE verification_token = :token LIMIT 1");
        $stmt->execute([':token' => $token]);
        $user = $stmt->fetch();

        if ($user) {
            $updateStmt = $pdo->prepare("UPDATE person SET is_verified = 1 WHERE verification_token = :token");
            $updateStmt->execute([':token' => $token]);

            header('Location: http://localhost:4200/login');
            exit;
        } else {
            echo "Jeton de vérification incorrect.";
        }
    } else {
        echo "Jeton de vérification non fourni.";
    }
} catch (PDOException $e) {
    echo "Ошибка: " . $e->getMessage(); 
}
?>

