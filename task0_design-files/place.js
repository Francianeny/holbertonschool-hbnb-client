document.addEventListener('DOMContentLoaded', function() {
  const token = getCookie('jwt');
  if (!token) {
      window.location.href = 'login.html';
      return;
  }

  const countryFilter = document.getElementById('countryFilter');
  const placesContainer = document.getElementById('placesContainer');

  fetchPlaces();

  countryFilter.addEventListener('change', function() {
      fetchPlaces();
  });

  function fetchPlaces() {
      const selectedCountry = countryFilter.value;
      fetch('/api/places', {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${token}`
          }
      })
      .then(response => response.json())
      .then(data => {
          displayPlaces(data, selectedCountry);
          populateCountryFilter(data);
      })
      .catch(error => console.error('Error fetching places:', error));
  }

  function displayPlaces(places, country) {
      placesContainer.innerHTML = '';
      const filteredPlaces = country === 'All' ? places : places.filter(place => place.country === country);
      filteredPlaces.forEach(place => {
          const placeElement = document.createElement('div');
          placeElement.className = 'place';
          placeElement.innerHTML = `
              <h2>${place.name}</h2>
              <p>Price per night: $${place.price}</p>
              <p>Location: ${place.location}</p>
              <button onclick="viewDetails('${place.id}')">View Details</button>
          `;
          placesContainer.appendChild(placeElement);
      });
  }

  function populateCountryFilter(places) {
      const countries = new Set(places.map(place => place.country));
      countryFilter.innerHTML = '<option value="All">All</option>';
      countries.forEach(country => {
          const option = document.createElement('option');
          option.value = country;
          option.textContent = country;
          countryFilter.appendChild(option);
      });
  }

  window.viewDetails = function(placeId) {
      window.location.href = `place_details.html?id=${placeId}`;
  };
});
