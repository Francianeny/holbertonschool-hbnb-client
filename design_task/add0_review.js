document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('reviewForm');
  const placeId = getQueryParameter('placeId'); // Récupère l'ID du lieu depuis les paramètres de l'URL

  // Vérifie si l'utilisateur est connecté
  if (!getCookie('jwt')) {
      alert('You must be logged in to add a review.');
      window.location.href = 'login.html'; // Redirige vers la page de connexion si l'utilisateur n'est pas connecté
      return;
  }

  form.addEventListener('submit', async function(event) {
      event.preventDefault();

      const comment = document.getElementById('comment').value;
      const rating = document.getElementById('rating').value;
      const token = getCookie('jwt'); // Récupère le JWT du cookie

      try {
          const response = await fetch(`/api/places/${placeId}/reviews`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({ comment, rating })
          });

          if (!response.ok) throw new Error('Failed to submit review');

          alert('Review added successfully!');
          window.location.href = `place_details.html?id=${placeId}`; // Redirige vers les détails du lieu après l'ajout de l'avis
      } catch (error) {
          console.error('Error:', error);
          alert('There was a problem adding your review. Please try again later.');
      }
  });

  // Fonction pour obtenir un paramètre de la requête URL
  function getQueryParameter(name) {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(name);
  }

  // Fonction pour obtenir un cookie par son nom
  function getCookie(name) {
      const nameEQ = name + "=";
      const ca = document.cookie.split(';');
      for (let i = 0; i < ca.length; i++) {
          let c = ca[i];
          while (c.charAt(0) === ' ') c = c.substring(1, c.length);
          if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
      }
      return null;
  }
});
