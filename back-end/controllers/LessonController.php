<?php
require_once __DIR__ . '/../services/LessonService.php';

class LessonController {
    private $lessonService;

    public function __construct() {
        $this->lessonService = new LessonService();
    }

    public function bookLesson($data) {
        if (isset($data['teacher_id']) && isset($data['student_id']) && isset($data['lesson_time'])) {
            return $this->lessonService->bookLesson($data['teacher_id'], $data['student_id'], $data['lesson_time']);
        } else {
            return null;
        }
    }
}
?>
