<?php

require '../../../db.php'; // Подключение к базе данных

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

// Получение данных из POST-запроса
$inputData = json_decode(file_get_contents('php://input'), true);
$userId = $inputData['userId']; // ID пользователя, для которого создается или обновляется профиль

// Формирование запроса на основе предоставленных данных
$updateFields = [];
$params = [':userId' => $userId];

if (isset($inputData['location'])) {
    $updateFields[] = "location = :location";
    $params[':location'] = $inputData['location'];
}
if (isset($inputData['native_Language'])) {
    $updateFields[] = "native_Language = :native_Language";
    $params[':native_Language'] = $inputData['native_Language'];
}
if (isset($inputData['timezone'])) {
    $updateFields[] = "timezone = :timezone";
    $params[':timezone'] = $inputData['timezone'];
}
if (isset($inputData['skype'])) {
    $updateFields[] = "skype = :skype";
    $params[':skype'] = $inputData['skype'];
}
if (isset($inputData['call_link'])) {
    $updateFields[] = "call_link = :call_link";
    $params[':call_link'] = $inputData['call_link'];
}

try {
    $pdo->beginTransaction();

    // Проверка существует ли уже профиль студента для данного пользователя
    $stmt = $pdo->prepare("SELECT Id_person FROM studentprofile WHERE Id_person = :userId");
    $stmt->execute([':userId' => $userId]);
    $exists = $stmt->fetchColumn();

    if ($exists && count($updateFields) > 0) {
        // Если профиль уже существует, обновляем его
        $sql = "UPDATE studentprofile SET " . implode(', ', $updateFields) . " WHERE Id_person = :userId";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
    } elseif (!$exists) {
        // Если профиль не существует, создаем новый
        $stmt = $pdo->prepare("INSERT INTO studentprofile (Id_person, location, native_Language, timezone, skype, call_link) VALUES (:userId, :location, :native_Language, :timezone, :skype, :call_link)");
        $stmt->execute($params);
    }

    $pdo->commit();
    echo json_encode(['result' => 'success']);
} catch (PDOException $e) {
    $pdo->rollBack();
    echo json_encode(['error' => $e->getMessage()]);
}
