<?php
require_once __DIR__ . '/DatabaseService.php';
require_once __DIR__ . '/../models/TeacherAvailability.php';

class TeacherAvailabilityService {
    private $dbService;

    public function __construct() {
        $this->dbService = new DatabaseService();
    }

    public function addAvailability(TeacherAvailability $availability) {
        $pdo = $this->dbService->getConnection();

        $sql = "INSERT INTO teacher_availability (teacher_id, available_date, available_time) VALUES (:teacher_id, :available_date, :available_time)";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':teacher_id', $availability->teacher_id);
        $stmt->bindParam(':available_date', $availability->available_date);
        $stmt->bindParam(':available_time', $availability->available_time);

        return $stmt->execute();
    }
}
?>
