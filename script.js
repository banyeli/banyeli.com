const form = document.querySelector('.thought-form');
const thought = document.querySelector('#thought');
const reply = document.querySelector('.reply');
const sound = document.querySelector('.sound');
const video = document.querySelector('.chief-video');

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!thought.value.trim()) return;
  reply.textContent = 'Banyeli is holding that with you.';
  thought.value = '';
});

sound?.addEventListener('click', () => {
  video.muted = !video.muted;
  video.play();
  sound.textContent = video.muted ? 'sound off' : 'sound on';
});
