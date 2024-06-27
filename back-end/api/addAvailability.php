<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once '../controllers/TeacherAvailabilityController.php';

$data = json_decode(file_get_contents("php://input"));

$controller = new TeacherAvailabilityController();
$result = $controller->addAvailability($data);

if ($result) {
    echo json_encode(["message" => "Availability added successfully."]);
} else {
    echo json_encode(["message" => "Failed to add availability."]);
}
?>
