document.addEventListener('DOMContentLoaded', () => {
  const placesContainer = document.getElementById('placesContainer');
  const countryFilter = document.getElementById('countryFilter');

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
          const response = await fetch('http://127.0.0.1:5001/places', {
              headers: {
                  'Authorization': `Bearer ${token}` // Include the JWT token in the request
              }
          });
          if (!response.ok) throw new Error('Failed to fetch places');
          const places = await response.json();

          populateCountryFilter(places);
          displayPlaces(places);
      } catch (error) {
          console.error('Error:', error);
          placesContainer.innerHTML = '<p>Unable to load places. Please try again later.</p>';
      }
  }

  // Function to populate country filter options
  function populateCountryFilter(places) {
      const countries = new Set(places.map(place => place.country_name));
      countries.forEach(country => {
          const option = document.createElement('option');
          option.value = country;
          option.textContent = country;
          countryFilter.appendChild(option);
      });
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

  // Event listener for country filter change
  countryFilter.addEventListener('change', () => {
      const selectedCountry = countryFilter.value;
      fetchPlaces().then(() => {
          const placeCards = document.querySelectorAll('.place-card');
          placeCards.forEach(card => {
              const countryName = card.querySelector('p:nth-of-type(2)').textContent.split(', ')[1];
              if (selectedCountry === 'All' || selectedCountry === countryName) {
                  card.style.display = 'block';
              } else {
                  card.style.display = 'none';
              }
          });
      });
  });

  fetchPlaces();  // Fetch and display places on page load
});
