document.addEventListener('DOMContentLoaded', () => {
  const placesContainer = document.getElementById('placesContainer');

  // Helper function to get the JWT token from localStorage
  function getToken() {
      return localStorage.getItem('access_token');
  }

  // Redirect to login if not authenticated
  const token = getToken();
  if (!token) {
      window.location.href = 'login.html';
      return; // Prevent further execution if not authenticated
  }

  // Function to fetch and display places
  async function fetchPlaces() {
      try {
          const response = await fetch('http://127.0.0.1:5001/places', { // Ensure this URL matches your Flask endpoint
              headers: {
                  'Authorization': `Bearer ${token}` // Include the JWT token in the request
              }
          });
          if (!response.ok) throw new Error('Failed to fetch places');
          const places = await response.json();

          displayPlaces(places);
      } catch (error) {
          console.error('Error:', error);
          placesContainer.innerHTML = '<p>Unable to load places. Please try again later.</p>';
      }
  }

  // Function to display places
  function displayPlaces(places) {
      placesContainer.innerHTML = ''; // Clear previous content
      places.forEach(place => {
          const placeCard = document.createElement('div');
          placeCard.className = 'place-card';

          placeCard.innerHTML = `
              <img src="${place.imageUrl}" alt="${place.name}" class="place-image">
              <h3>${place.name}</h3>
              <p>${place.price_per_night} per night</p>
              <p>${place.city_name}, ${place.country_name}</p>
              <a href="place.html?id=${place.id}" class="details-button">View Details</a>
          `;

          placesContainer.appendChild(placeCard);
      });
  }

  fetchPlaces();  // Fetch and display places on page load
});
