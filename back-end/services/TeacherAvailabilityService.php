<?php
require_once 'DatabaseService.php';

class TeacherAvailabilityService {
    private $dbService;

    public function __construct() {
        $this->dbService = new DatabaseService();
    }

    public function addAvailability($availability) {
        $pdo = $this->dbService->getConnection();
        $sql = "INSERT INTO teacher_availability (teacher_id, available_date, available_time) VALUES (:teacher_id, :available_date, :available_time)";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':teacher_id', $availability->teacher_id);
        $stmt->bindParam(':available_date', $availability->available_date);
        $stmt->bindParam(':available_time', $availability->available_time);

        if ($stmt->execute()) {
            return ["message" => "Availability added successfully."];
        } else {
            throw new Exception("Failed to add availability.");
        }
    }

		public function getAvailability($teacher_id) {
			$pdo = $this->dbService->getConnection();
			$sql = "SELECT available_date, available_time FROM teacher_availability WHERE teacher_id = :teacher_id";
			$stmt = $pdo->prepare($sql);
			$stmt->bindParam(':teacher_id', $teacher_id, PDO::PARAM_INT);
			$stmt->execute();
			return $stmt->fetchAll(PDO::FETCH_ASSOC);
	}
}
?>

