<?php
require 'db.php';
try {
    if (isset($_GET['token'])) {
        $token = $_GET['token'];

        // Пытаемся найти пользователя с данным токеном верификации
        $stmt = $pdo->prepare("SELECT * FROM person WHERE verification_token = :token LIMIT 1");
        $stmt->execute([':token' => $token]);
        $user = $stmt->fetch();

        if ($user) {
            // Если пользователь найден, обновляем его статус на "подтверждено"
            $updateStmt = $pdo->prepare("UPDATE person SET is_verified = 1 WHERE verification_token = :token");
            $updateStmt->execute([':token' => $token]);

            echo "Ваш аккаунт успешно подтвержден.";
        } else {
            echo "Неверный токен верификации.";
        }
    } else {
        echo "Токен верификации не предоставлен.";
    }
} catch (PDOException $e) {
    echo "Ошибка: " . $e->getMessage(); 
}
?>

