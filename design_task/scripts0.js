document.addEventListener('DOMContentLoaded', function() {
  const placesContainer = document.getElementById('placesContainer');

  // Function to fetch and display places
  async function fetchPlaces() {
      try {
          const response = await fetch('/api/places');  // Endpoint pour récupérer les lieux
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
              <p>${place.price} per night</p>
              <p>${place.location}</p>
              <a href="place.html?id=${place.id}" class="details-button">View Details</a>
          `;

          placesContainer.appendChild(placeCard);
      });
  }

  fetchPlaces();  // Fetch and display places on page load

  // Helper function to get the JWT token from cookies
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

  // Redirect to login if not authenticated
  const token = getCookie('jwt');
  if (!token) {
      window.location.href = 'login.html';
  }
});
