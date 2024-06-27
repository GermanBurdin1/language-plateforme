<?php
require_once __DIR__ . '/../services/TeacherAvailabilityService.php';
require_once __DIR__ . '/../models/TeacherAvailability.php';

class TeacherAvailabilityController {
    private $service;

    public function __construct() {
        $this->service = new TeacherAvailabilityService();
    }

    public function addAvailability($data) {
        $availability = new TeacherAvailability(
            $data->teacher_id,
            $data->available_date,
            $data->available_time
        );

        return $this->service->addAvailability($availability);
    }
}
?>
