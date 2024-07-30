<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Login - hbnb</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <div class="logo">
            <img src="logo.png" alt="hbnb">
        </div>
        <div class="login">
            <a href="login.html">Login</a>
        </div>
    </header>
    <main>
        <div class="login-container">
            <h2>Login</h2>
            <form id="login-form">
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required>
                <label for="password">Mot de passe:</label>
                <input type="password" id="password" name="password" required>
                <button type="submit">Se connecter</button>
                <p id="error-message" style="color:red;"></p> <!-- Message d'erreur -->
            </form>
        </div>
    </main>
    <script src="login.js"></script>
</body>
</html>
