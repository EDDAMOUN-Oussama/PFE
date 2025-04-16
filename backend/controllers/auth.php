<?php
require_once '../config/db.php';
require_once '../helpers/response.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';

    $query = "SELECT * FROM users WHERE email = '$email'";
    $result = mysqli_query($conn, $query);

    if ($user = mysqli_fetch_assoc($result)) {
        if ($user['password'] === $password) {
            respond('success', 'Connexion réussie', ['user_id' => $user['id']]);
        } else {
            respond('error', 'Mot de passe incorrect');
        }
    } else {
        respond('error', "L'utilisateur n'existe pas");
    }
}
else {
    respond('error', 'Méthode non autorisée');
}


