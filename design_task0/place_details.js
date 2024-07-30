document.addEventListener('DOMContentLoaded', function() {
  const token = getCookie('jwt');
  const placeDetailsContainer = document.querySelector('.place-details');
  const reviewsContainer = document.getElementById('reviewsContainer');
  const addReviewContainer = document.querySelector('.add-review');
  const reviewForm = document.getElementById('reviewForm');
  const loginButton = document.querySelector('.login-button');

  // Obtenir l'ID du lieu depuis l'URL
  const urlParams = new URLSearchParams(window.location.search);
  const placeId = urlParams.get('id');

  // Charger les détails du lieu
  fetch(`/api/places/${placeId}`, {
      method: 'GET',
      headers: {
          'Authorization': `Bearer ${token}`
      }
  })
  .then(response => response.json())
  .then(data => {
      displayPlaceDetails(data);
      displayReviews(data.reviews); // Ajouter les avis
      if (token) {
          addReviewContainer.style.display = 'block';
          loginButton.style.display = 'none'; // Cacher le bouton de connexion si l'utilisateur est authentifié
      } else {
          addReviewContainer.style.display = 'none'; // Cacher la section d'ajout d'avis si l'utilisateur n'est pas authentifié
          loginButton.style.display = 'block'; // Afficher le bouton de connexion si l'utilisateur n'est pas authentifié
      }
  })
  .catch(error => console.error('Error fetching place details:', error));

  // Afficher les détails du lieu
  function displayPlaceDetails(place) {
      document.getElementById('placeImage').src = place.imageUrl || 'default-image.jpg'; // Assurez-vous que l'URL de l'image est correcte
      const placeInfo = document.getElementById('placeInfo');
      placeInfo.innerHTML = `
          <h2>${place.name}</h2>
          <p>Price per night: $${place.price}</p>
          <p>Location: ${place.location}</p>
          <p>Description: ${place.description}</p>
          <p>Amenities: ${place.amenities.join(', ')}</p>
          <p>Host: ${place.host}</p>
      `;
  }

  // Afficher les avis
  function displayReviews(reviews) {
      reviewsContainer.innerHTML = '';
      if (reviews && reviews.length > 0) {
          reviews.forEach(review => {
              const reviewCard = document.createElement('div');
              reviewCard.className = 'review-card';
              reviewCard.innerHTML = `
                  <h3>${review.userName}</h3>
                  <p>Rating: ${review.rating}</p>
                  <p>${review.comment}</p>
              `;
              reviewsContainer.appendChild(reviewCard);
          });
      } else {
          reviewsContainer.innerHTML = '<p>No reviews yet.</p>';
      }
  }

  // Gérer l'envoi du formulaire de commentaire
  reviewForm.addEventListener('submit', function(event) {
      event.preventDefault();
      const reviewText = document.getElementById('reviewText').value;
      if (reviewText) {
          submitReview(reviewText);
      } else {
          alert('Please write a review before submitting.');
      }
  });

  // Envoyer le commentaire à l'API
  function submitReview(reviewText) {
      fetch(`/api/places/${placeId}/reviews`, {
          method: 'POST',
          headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ text: reviewText })
      })
      .then(response => {
          if (response.ok) {
              alert('Review submitted successfully!');
              document.getElementById('reviewText').value = '';
              // Recharger les avis après l'ajout
              fetch(`/api/places/${placeId}`, {
                  method: 'GET',
                  headers: {
                      'Authorization': `Bearer ${token}`
                  }
              })
              .then(response => response.json())
              .then(data => displayReviews(data.reviews))
              .catch(error => console.error('Error fetching updated reviews:', error));
          } else {
              response.json().then(data => alert(`Error: ${data.message}`));
          }
      })
      .catch(error => console.error('Error submitting review:', error));
  }
});
