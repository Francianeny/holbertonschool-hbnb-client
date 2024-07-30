// Fonction pour obtenir un cookie par son nom
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

// Fonction pour afficher un message de confirmation générique
function showAlert(message) {
  alert(message);
}

// Fonction pour gérer les erreurs d'API de manière cohérente
function handleApiError(error) {
  console.error('API Error:', error);
  showAlert('Une erreur est survenue lors de la communication avec le serveur.');
}

// Fonction pour vérifier si un utilisateur est connecté (vérifie la présence du token)
function checkAuth() {
  const token = getCookie('jwt');
  return !!token; // Renvoie true si le token est présent, sinon false
}

// Fonction pour afficher des messages d'erreur dans un élément spécifié
function showErrorMessage(elementId, message) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
      errorElement.innerText = message;
      errorElement.style.display = 'block';
  }
}

// Fonction pour initialiser les boutons de formulaire avec une logique commune
function initializeFormButtons() {
  const buttons = document.querySelectorAll('button[type="submit"]');
  buttons.forEach(button => {
      button.addEventListener('click', () => {
          showAlert('Form submitted');
      });
  });
}

// Fonction pour valider les entrées de formulaire communes
function validateFormInputs(inputs) {
  return inputs.every(input => input.value.trim() !== '');
}

// Fonction pour afficher un message d'erreur dans un élément spécifié
function showErrorMessage(elementId, message) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
      errorElement.innerText = message;
      errorElement.style.display = 'block';
  }
}

// Fonction pour configurer la redirection après une connexion réussie
function redirectAfterLogin(url) {
  window.location.href = url;
}

// Fonction pour ajouter un token JWT aux cookies
function setJwtCookie(token) {
  document.cookie = `jwt=${token}; path=/; secure; HttpOnly`;
}

// Fonction pour récupérer un token JWT depuis les cookies
function getJwtToken() {
  return getCookie('jwt');
}

// Appeler les fonctions d'initialisation lorsque le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
  initializeFormButtons();
});
