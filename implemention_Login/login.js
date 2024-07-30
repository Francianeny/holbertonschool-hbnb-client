document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');

  if (loginForm) {
      loginForm.addEventListener('submit', async (event) => {
          event.preventDefault();

          const email = document.getElementById('email').value;
          const password = document.getElementById('password').value;

          try {
              const response = await fetch('https://your-api-url/login', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({ email, password })
              });

              if (response.ok) {
                  const data = await response.json();
                  setCookie('token', data.access_token, 1); // Stocke le token dans un cookie qui expire dans 1 jour
                  window.location.href = 'index.html'; // Redirige vers la page principale
              } else {
                  const errorData = await response.json();
                  displayError('Échec de la connexion: ' + (errorData.message || response.statusText));
              }
          } catch (error) {
              displayError('Erreur lors de la connexion: ' + error.message);
          }
      });
  }
});

// Fonction pour définir un cookie
function setCookie(name, value, days) {
  const d = new Date();
  d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "expires=" + d.toUTCString();
  document.cookie = name + "=" + (value || "") + ";" + expires + ";path=/";
}

// Fonction pour afficher un message d'erreur
function displayError(message) {
  const errorMessageElement = document.getElementById('error-message');
  if (errorMessageElement) {
      errorMessageElement.textContent = message;
      errorMessageElement.style.display = 'block'; // Affiche l'élément du message d'erreur
  }
}
