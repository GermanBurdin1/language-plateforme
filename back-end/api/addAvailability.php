<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

require_once '../controllers/TeacherAvailabilityController.php';

$data = json_decode(file_get_contents("php://input"));

if ($data) {
    $controller = new TeacherAvailabilityController();
    $response = $controller->addAvailability($data);
    echo json_encode($response);
} else {
    echo json_encode(["message" => "Invalid input."]);
}
?>
