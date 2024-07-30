document.addEventListener('DOMContentLoaded', function() {
  const token = getCookie('jwt');
  if (!token) {
      window.location.href = 'login.html';
  }

  const placesContainer = document.getElementById('placesContainer');

  fetch('/api/places', {
      method: 'GET',
      headers: {
          'Authorization': `Bearer ${token}`
      }
  })
  .then(response => response.json())
  .then(data => {
      displayPlaces(data);
  })
  .catch(error => console.error('Error fetching places:', error));

  function displayPlaces(places) {
      places.forEach(place => {
          const placeCard = document.createElement('div');
          placeCard.classList.add('place-card');

          placeCard.innerHTML = `
              <img src="${place.image_url}" alt="${place.name}" class="place-image">
              <div class="place-details">
                  <h2>${place.name}</h2>
                  <p>Price per night: $${place.price}</p>
                  <p>Location: ${place.location}</p>
              </div>
              <a href="place_details.html?id=${place.id}" class="details-button">Voir les détails</a>
          `;

          placesContainer.appendChild(placeCard);
      });
  }
});
