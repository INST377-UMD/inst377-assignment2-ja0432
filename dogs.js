async function loadDogImages() {
  const carousel = document.getElementById('dogCarousel');
  for (let i = 0; i < 10; i++) {
    const res = await fetch('https://dog.ceo/api/breeds/image/random');
    const data = await res.json();
    const img = document.createElement('img');
    img.src = data.message;
    carousel.appendChild(img);
  }
  simpleslider.getSlider();
}

async function loadDogBreeds() {
  const res = await fetch('https://api.thedogapi.com/v1/breeds');
  const data = await res.json();
  const buttonsDiv = document.getElementById('breedButtons');
  data.forEach(breed => {
    const btn = document.createElement('button');
    btn.textContent = breed.name;
    btn.setAttribute('class', 'dog-button');
    btn.addEventListener('click', () => showBreedInfo(breed));
    buttonsDiv.appendChild(btn);
  });
}

function showBreedInfo(breed) {
  document.getElementById('breedName').textContent = breed.name;
  document.getElementById('breedDescription').textContent = breed.temperament || 'No description available';
  document.getElementById('minLife').textContent = breed.life_span.split(' - ')[0] || 'Unknown';
  document.getElementById('maxLife').textContent = breed.life_span.split(' - ')[1] || 'Unknown';
  document.getElementById('breedInfo').style.display = 'block';
}

function setupVoiceCommands(breeds) {
  if (annyang) {
    const commands = {};
    breeds.forEach(breed => {
      commands[`load dog breed ${breed.name.toLowerCase()}`] = () => showBreedInfo(breed);
    });
    annyang.addCommands(commands);
    document.getElementById('turnOnAudio').onclick = () => annyang.start();
    document.getElementById('turnOffAudio').onclick = () => annyang.abort();
  }
}

window.onload = async () => {
  await loadDogImages();
  const res = await fetch('https://api.thedogapi.com/v1/breeds');
  const breeds = await res.json();
  setupVoiceCommands(breeds);
  loadDogBreeds();
};