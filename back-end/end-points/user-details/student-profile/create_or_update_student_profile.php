<?php
require '../../../db.php'; // Подключение к базе данных

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

// Получение данных из POST-запроса
$inputData = json_decode(file_get_contents('php://input'), true);
$userId = $inputData['userId']; // ID пользователя, для которого создается профиль
$location = $inputData['location'];
$nativeLanguage = $inputData['native_language'];
$timezone = $inputData['timezone'];
$skype = $inputData['skype'];
$callLink = $inputData['call_link'];

try {
    $pdo->beginTransaction();

    // Проверка существует ли уже профиль студента для данного пользователя
    $stmt = $pdo->prepare("SELECT Id_person FROM studentprofile WHERE Id_person = :userId");
    $stmt->execute([':userId' => $userId]);
    $exists = $stmt->fetchColumn();

    if ($exists) {
        // Если профиль уже существует, обновляем его
        $stmt = $pdo->prepare("UPDATE studentprofile SET location = :location, native_language = :native_language, timezone = :timezone, skype = :skype, call_link = :call_link WHERE Id_person = :userId");
    } else {
        // Если профиль не существует, создаем новый
        $stmt = $pdo->prepare("INSERT INTO studentprofile (Id_person, location, native_language, timezone, skype, call_link) VALUES (:userId, :location, :native_language, :timezone, :skype, :call_link)");
    }

    // Выполнение запроса с переданными данными
    $stmt->execute([
        ':userId' => $userId,
        ':location' => $location,
        ':native_language' => $nativeLanguage,
        ':timezone' => $timezone,
        ':skype' => $skype,
        ':call_link' => $callLink
    ]);

    $pdo->commit();
    echo json_encode(['result' => 'success']);
} catch (PDOException $e) {
    $pdo->rollBack();
    echo json_encode(['error' => $e->getMessage()]);
}
