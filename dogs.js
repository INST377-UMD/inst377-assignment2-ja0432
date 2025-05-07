const dogAPI = 'https://dog.ceo/api/breeds/image/random/10';
const breedAPI = 'https://dogapi.dog/api-docs/v2/swagger.json';

let breeds = [];
let carouselImages = [];

document.addEventListener('DOMContentLoaded', () => {
  loadRandomDogImages();
  loadDogBreeds();
  setupVoiceCommands();
});

// Fetch random dog images for the carousel
function loadRandomDogImages() {
  fetch(dogAPI)
    .then(response => response.json())
    .then(data => {
      carouselImages = data.message;
      displayCarousel();
    });
}

// Display images in the carousel
function displayCarousel() {
  const carousel = document.getElementById('dogCarousel');
  carousel.innerHTML = '';
  carouselImages.forEach(imageUrl => {
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = 'Random Dog';
    img.classList.add('carousel-image');
    carousel.appendChild(img);
  });

  // Initialize the carousel (Simple-Slider or similar)
  new SimpleSlider('#dogCarousel');
}

// Fetch dog breeds and create breed buttons dynamically
function loadDogBreeds() {
  fetch(breedAPI)
    .then(response => response.json())
    .then(data => {
      breeds = Object.keys(data.breeds);
      createBreedButtons();
    });
}

// Create buttons for each dog breed
function createBreedButtons() {
  const breedButtonsContainer = document.getElementById('breedButtons');
  breedButtonsContainer.innerHTML = '';

  breeds.forEach(breed => {
    const button = document.createElement('button');
    button.innerText = breed.charAt(0).toUpperCase() + breed.slice(1);
    button.classList.add('breed-button');
    button.addEventListener('click', () => displayBreedInfo(breed));
    breedButtonsContainer.appendChild(button);
  });
}

// Fetch and display breed information
function displayBreedInfo(breed) {
  const breedInfoContainer = document.getElementById('breedInfo');
  const breedName = document.getElementById('breedName');
  const breedDescription = document.getElementById('breedDescription');
  const minLife = document.getElementById('minLife');
  const maxLife = document.getElementById('maxLife');

  // Fetch breed info from an API or hardcoded data
  // For now, we will use some placeholder data
  breedName.innerText = breed.charAt(0).toUpperCase() + breed.slice(1);
  breedDescription.innerText = `Description of ${breed}`;
  minLife.innerText = '10';
  maxLife.innerText = '15';

  breedInfoContainer.style.display = 'block';
}

// Setup voice commands with Annyang
function setupVoiceCommands() {
  if (annyang) {
    const commands = {
      'Load Dog Breed *breed': (breed) => {
        const formattedBreed = breed.toLowerCase();
        if (breeds.includes(formattedBreed)) {
          displayBreedInfo(formattedBreed);
        }
      }
    };

    annyang.addCommands(commands);
    annyang.start();
  }
}

// Toggle audio commands
document.getElementById('turnOnAudio').addEventListener('click', () => {
  if (annyang) {
    annyang.start();
  }
});

document.getElementById('turnOffAudio').addEventListener('click', () => {
  if (annyang) {
    annyang.abort();
  }
});
