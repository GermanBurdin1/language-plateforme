<?php
class Lesson {
    public $id;
    public $teacher_id;
    public $student_id;
    public $lesson_time;

    public function __construct($id, $teacher_id, $student_id, $lesson_time) {
        $this->id = $id;
        $this->teacher_id = $teacher_id;
        $this->student_id = $student_id;
        $this->lesson_time = $lesson_time;
    }
}
?>
