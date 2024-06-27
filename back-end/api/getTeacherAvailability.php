<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once '../controllers/TeacherAvailabilityController.php';

$teacherAvailabilityController = new TeacherAvailabilityController();
$teacher_id = isset($_GET['teacher_id']) ? $_GET['teacher_id'] : null;

if ($teacher_id) {
    $availability = $teacherAvailabilityController->getAvailability($teacher_id);
    echo json_encode($availability);
} else {
    echo json_encode(["message" => "Teacher ID is required"]);
}
?>
