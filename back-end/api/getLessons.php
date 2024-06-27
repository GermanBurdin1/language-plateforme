<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once '../controllers/LessonController.php';

$lessonController = new LessonController();
$lessonController->getLessons();