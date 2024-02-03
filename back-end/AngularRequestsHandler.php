<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Разрешить запросы CORS, если Angular и PHP размещены на разных доменах
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

$host = 'localhost'; // Адрес сервера MySQL
$db   = 'my_database'; // Имя базы данных
$user = 'username'; // Имя пользователя
$pass = 'password'; // Пароль
$charset = 'utf8mb4'; // Кодировка

// DSN (Data Source Name) для подключения к MySQL
$dsn = "mysql:host=$host;dbname=$db;charset=$charset";

// Настройки для PDO
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

$logFile = '/path/to/yourlogfile.log'; // Укажите путь к вашему лог-файлу

try {
    // Подключение к базе данных
    $pdo = new PDO($dsn, $user, $pass, $options);
    
    // Получение данных от Angular
    $inputData = json_decode(file_get_contents('php://input'), true);
    
    // Логирование входящего POST запроса
    $logMessage = "Received POST Request: " . json_encode($inputData) . " at " . date('Y-m-d H:i:s') . PHP_EOL;
    file_put_contents($logFile, $logMessage, FILE_APPEND);

    // Подготовка SQL-запроса на основе данных от пользователя
    // Например: "INSERT INTO users (email, password) VALUES (:email, :password)"
    $stmt = $pdo->prepare("ВАШ SQL ЗАПРОС ЗДЕСЬ"); 
    
    // Привязка полученных значений к параметрам запроса
    foreach ($inputData as $key => $value) {
        $stmt->bindValue(':'.$key, $value);
    }
    
    // Выполнение запроса
    $stmt->execute();
    
    // Логирование успешной регистрации
    $successLogMessage = "Successful Registration: " . $inputData['email'] . " at " . date('Y-m-d H:i:s') . PHP_EOL;
    file_put_contents($logFile, $successLogMessage, FILE_APPEND);
    
    // Отправка ответа обратно в Angular
    echo json_encode(['result' => 'success']);
    
} catch (\PDOException $e) {
    // Логирование ошибки
    $errorLogMessage = "Error: " . $e->getMessage() . " at " . date('Y-m-d H:i:s') . PHP_EOL;
    file_put_contents($logFile, $errorLogMessage, FILE_APPEND);

    // Возврат ошибки
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
