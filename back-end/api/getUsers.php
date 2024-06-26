<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once '../controllers/UserController.php';

$role = isset($_GET['role']) ? $_GET['role'] : '';
$userController = new UserController();
$users = $userController->getUsers($role);

echo json_encode($users);
?>
