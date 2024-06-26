<?php
require_once '../services/UserService.php';

class UserController {
    private $userService;

    public function __construct() {
        $this->userService = new UserService();
    }

    public function getUsers($role) {
        return $this->userService->getUsers($role);
    }
}
?>
