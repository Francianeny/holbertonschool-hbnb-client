document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const errorMessage = document.getElementById('error-message');

  loginForm.addEventListener('submit', async (event) => {
      event.preventDefault(); // Empêche le rechargement de la page

      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      try {
          const response = await fetch('http://127.0.0.1:5001/login', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ email, password })
          });

          if (!response.ok) {
              throw new Error('Login failed');
          }

          const data = await response.json();

          // Stocker le token JWT dans un cookie
          document.cookie = `jwt=${data.access_token}; path=/`;

          // Rediriger vers la page d'accueil ou une autre page
          window.location.href = 'index.html';
      } catch (error) {
          console.error('Error:', error);
          errorMessage.textContent = 'Email ou mot de passe incorrect';
      }
  });
});
