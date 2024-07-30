document.addEventListener('DOMContentLoaded', async function() {
  const placeId = getQueryParameter('id'); // Récupère l'ID du lieu depuis les paramètres de l'URL
  if (!placeId) {
      document.body.innerHTML = '<p>Place ID is missing from the URL.</p>';
      return;
  }

  const placeDetailsContainer = document.getElementById('placeDetailsContainer');
  const reviewsContainer = document.getElementById('reviewsContainer');
  const addReviewButton = document.getElementById('addReviewButton');

  // Récupère les détails du lieu
  async function fetchPlaceDetails() {
      try {
          const response = await fetch(`/api/places/${placeId}`);
          if (!response.ok) throw new Error('Failed to fetch place details');
          const place = await response.json();

          displayPlaceDetails(place);
          fetchReviews(); // Récupère les avis après avoir affiché les détails du lieu
      } catch (error) {
          console.error('Error:', error);
          placeDetailsContainer.innerHTML = '<p>Unable to load place details. Please try again later.</p>';
      }
  }

  // Récupère les avis pour le lieu
  async function fetchReviews() {
      try {
          const response = await fetch(`/api/places/${placeId}/reviews`);
          if (!response.ok) throw new Error('Failed to fetch reviews');
          const reviews = await response.json();

          displayReviews(reviews);
      } catch (error) {
          console.error('Error:', error);
          reviewsContainer.innerHTML = '<p>Unable to load reviews. Please try again later.</p>';
      }
  }

  // Affiche les détails du lieu
  function displayPlaceDetails(place) {
      placeDetailsContainer.innerHTML = `
          <img src="${place.imageUrl}" alt="${place.name}" class="place-image-large">
          <h1>${place.name}</h1>
          <p><strong>Host:</strong> ${place.host}</p>
          <p><strong>Price:</strong> $${place.price} per night</p>
          <p><strong>Location:</strong> ${place.location}</p>
          <p><strong>Description:</strong> ${place.description}</p>
          <div class="place-info">
              <h3>Amenities</h3>
              <ul>
                  ${place.amenities.map(amenity => `<li>${amenity}</li>`).join('')}
              </ul>
          </div>
      `;
  }

  // Affiche les avis
  function displayReviews(reviews) {
      reviewsContainer.innerHTML = '';
      if (reviews.length === 0) {
          reviewsContainer.innerHTML = '<p>No reviews yet.</p>';
          return;
      }

      reviews.forEach(review => {
          const reviewCard = document.createElement('div');
          reviewCard.className = 'review-card';
          reviewCard.innerHTML = `
              <p><strong>${review.userName}</strong> (${review.rating} stars)</p>
              <p>${review.comment}</p>
          `;
          reviewsContainer.appendChild(reviewCard);
      });
  }

  // Récupère un paramètre de la requête URL
  function getQueryParameter(name) {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(name);
  }

  // Affiche le bouton "Add Review" seulement si l'utilisateur est connecté
  function checkUserLoggedIn() {
      const token = getCookie('jwt');
      if (token) {
          addReviewButton.style.display = 'block'; // Affiche le bouton si l'utilisateur est connecté
          addReviewButton.href = `add_review.html?placeId=${placeId}`; // Lien vers le formulaire d'ajout d'avis
      } else {
          addReviewButton.style.display = 'none'; // Masque le bouton si l'utilisateur n'est pas connecté
      }
  }

  // Récupère un cookie par son nom
  function getCookie(name) {
      const nameEQ = name + "=";
      const ca = document.cookie.split(';');
      for(let i = 0; i < ca.length; i++) {
          let c = ca[i];
          while (c.charAt(0) === ' ') c = c.substring(1, c.length);
          if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
      }
      return null;
  }

  // Initialisation
  fetchPlaceDetails();
  checkUserLoggedIn();
});
