document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Empêche la soumission du formulaire par défaut

    const email = document.getElementById('email').value; // Récupère l'email de l'utilisateur
    const password = document.getElementById('password').value; // Récupère le mot de passe de l'utilisateur

    try {
      // Envoie une requête POST à l'API backend pour l'authentification
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password }) // Envoie les données de l'utilisateur en tant que JSON
      });

      if (response.ok) {
        const data = await response.json(); // Parse la réponse JSON
        setCookie('jwt', data.token, 1); // Stocke le JWT dans un cookie pour 1 jour
        window.location.href = 'index.html'; // Redirige vers la page index.html après une connexion réussie
      } else {
        const errorData = await response.json(); // Parse la réponse JSON en cas d'erreur
        document.getElementById('error-message').innerText = errorData.message; // Affiche le message d'erreur
      }
    } catch (error) {
      console.error('Error:', error);
      document.getElementById('error-message').innerText = 'An error occurred. Please try again.'; // Affiche un message d'erreur générique en cas d'exception
    }
  });

  // Fonction pour définir un cookie
  function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000)); // Définit l'expiration du cookie
    const expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/"; // Définit le cookie
  }

  // Fonction pour récupérer un cookie
  function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  // Fonction pour effacer un cookie
  function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999;'; // Définit le cookie avec une date d'expiration passée pour le supprimer
  }
});

