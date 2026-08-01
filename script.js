document.querySelectorAll('.side-nav a, .primary-action, .continue-button').forEach((item) => {
  item.addEventListener('click', (event) => {
    if (item.matches('.side-nav a')) {
      document.querySelector('.side-nav .active')?.classList.remove('active');
      item.classList.add('active');
    }
    if (item.matches('button')) {
      event.preventDefault();
      document.querySelector('.chief-card').scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
});

const chiefForm = document.querySelector('.chief-form');
const chiefInput = document.querySelector('#chief-input');
const chiefResponse = document.querySelector('.chief-response');
const voiceToggle = document.querySelector('.voice-toggle');
const chiefVideo = document.querySelector('.chief-video');

chiefForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const thought = chiefInput.value.trim();
  if (!thought) return;
  chiefResponse.textContent = 'Banyeli received: “' + thought + '” — let’s turn it into the next clear move.';
  chiefInput.value = '';
});

voiceToggle?.addEventListener('click', () => {
  chiefVideo.muted = !chiefVideo.muted;
  chiefVideo.play();
  voiceToggle.textContent = chiefVideo.muted ? 'Enable voice' : 'Voice on';
});
