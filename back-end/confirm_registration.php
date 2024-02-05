<?php

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
