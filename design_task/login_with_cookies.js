document.getElementById('login-form').addEventListener('submit', async function(event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
      const response = await fetch('http://localhost:3000/api/users/login', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
      });

      if (response.ok) {
          const data = await response.json();
          document.cookie = `jwt=${data.token}; path=/; secure; HttpOnly`;
          window.location.href = 'list.html'; // Rediriger vers la liste des lieux après la connexion
      } else {
          const errorData = await response.json();
          document.getElementById('error-message').innerText = errorData.message;
          document.getElementById('error-message').style.display = 'block';
      }
  } catch (error) {
      document.getElementById('error-message').innerText = 'Une erreur est survenue. Veuillez réessayer plus tard.';
      document.getElementById('error-message').style.display = 'block';
  }
});
