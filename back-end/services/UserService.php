<?php
require_once '../models/User.php';
require_once 'DatabaseService.php';

class UserService {
    private $dbService;

    public function __construct() {
        $this->dbService = new DatabaseService();
    }

    public function getUsers($role) {
        $pdo = $this->dbService->getConnection();
        $sql = "SELECT Id_person AS id, name, e_mail AS email, role FROM person";
        if ($role) {
            $sql .= " WHERE role = :role";
        }

        $stmt = $pdo->prepare($sql);
        if ($role) {
            $stmt->bindParam(':role', $role, PDO::PARAM_STR);
        }
        $stmt->execute();

        $users = [];
        while ($row = $stmt->fetch()) {
            $row['availableTimes'] = ['10:00 - 11:00', '14:00 - 15:00'];
            $users[] = new User($row['id'], $row['name'], $row['email'], $row['role'], $row['availableTimes']);
        }

        return $users;
    }
}
?>
