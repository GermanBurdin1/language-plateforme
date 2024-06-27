<?php
require_once '../services/TeacherAvailabilityService.php';
require_once '../models/TeacherAvailability.php';

class TeacherAvailabilityController {
    private $service;

    public function __construct() {
        $this->service = new TeacherAvailabilityService();
    }

    public function addAvailability($data) {
        $availability = new TeacherAvailability();
        $availability->teacher_id = $data->teacher_id;
        $availability->available_date = $data->available_date;
        $availability->available_time = $data->available_time;

        return $this->service->addAvailability($availability);
    }

		public function getAvailability($teacher_id) {
			return $this->service->getAvailability($teacher_id);
	}
}
?>

