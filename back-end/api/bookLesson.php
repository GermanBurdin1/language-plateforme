<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once __DIR__ . '/../controllers/LessonController.php';

$input = json_decode(file_get_contents('php://input'), true);
$lessonController = new LessonController();
$lesson = $lessonController->bookLesson($input);

if ($lesson) {
    echo json_encode(['message' => 'Lesson booked successfully', 'lesson' => $lesson]);
} else {
    echo json_encode(['error' => 'Failed to book lesson']);
}
?>
