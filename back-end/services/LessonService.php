<?php
require_once __DIR__ . '/../models/Lesson.php';
require_once __DIR__ . '/DatabaseService.php';

class LessonService {
    private $dbService;

    public function __construct() {
        $this->dbService = new DatabaseService();
    }

    public function bookLesson($teacher_id, $student_id, $lesson_time) {
        $pdo = $this->dbService->getConnection();
        $sql = "INSERT INTO lesson (teacher_id, student_id, lesson_time) VALUES (:teacher_id, :student_id, :lesson_time)";

        $dateTime = DateTime::createFromFormat('H:i - H:i', $lesson_time);
        if (!$dateTime) {
            return null;
        }
        $formattedTime = $dateTime->format('Y-m-d H:i:s');

        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':teacher_id', $teacher_id, PDO::PARAM_INT);
        $stmt->bindParam(':student_id', $student_id, PDO::PARAM_INT);
        $stmt->bindParam(':lesson_time', $formattedTime, PDO::PARAM_STR);

        if ($stmt->execute()) {
            return new Lesson($pdo->lastInsertId(), $teacher_id, $student_id, $formattedTime);
        } else {
            return null;
        }
    }

		public function getLessons() {
			$pdo = $this->dbService->getConnection();
			$sql = "SELECT l.id, l.teacher_id, l.student_id, l.lesson_time, u.name as teacher_name 
							FROM lesson l 
							JOIN person u ON l.teacher_id = u.Id_person";
			$stmt = $pdo->prepare($sql);
			$stmt->execute();
			$lessons = [];
			while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
					$lessons[] = new Lesson(
							$row['id'],
							$row['teacher_id'],
							$row['student_id'],
							$row['lesson_time'],
							$row['teacher_name']
					);
			}
			return $lessons;
	}
}
?>
