<?php
require_once '../config/db.php';
require_once '../helpers/response.php';

class AuthController {
    private $db;

    public function __construct(Database $database) {
        $this->db = $database::connect();
    }

    public function login($email, $password) {
        $query = "SELECT * FROM users WHERE email = ?";
        $stmt = $this->db->prepare($query);
        $stmt->bind_param('s', $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($user = $result->fetch_assoc()) {
            if ($user['password'] === $password) {
                respond('success', 'Connexion réussie', ['user_id' => $user['id']]);
            } else {
                respond('error', 'Mot de passe incorrect');
            }
        } else {
            respond('error', "L'utilisateur n'existe pas");
        }
    }
}

// Ensure the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';

    $authController = new AuthController(new Database());
    $authController->login($email, $password);
} else {
    respond('error', 'Méthode non autorisée');
}

