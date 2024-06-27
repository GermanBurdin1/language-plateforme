<?php
class TeacherAvailability {
    public $teacher_id;
    public $available_date;
    public $available_time;

    public function __construct($teacher_id, $available_date, $available_time) {
        $this->teacher_id = $teacher_id;
        $this->available_date = $available_date;
        $this->available_time = $available_time;
    }
}
?>
