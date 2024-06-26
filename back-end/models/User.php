<?php
class User {
    public $id;
    public $name;
    public $email;
    public $role;
    public $availableTimes;

    public function __construct($id, $name, $email, $role, $availableTimes = []) {
        $this->id = $id;
        $this->name = $name;
        $this->email = $email;
        $this->role = $role;
        $this->availableTimes = $availableTimes;
    }
}
?>
