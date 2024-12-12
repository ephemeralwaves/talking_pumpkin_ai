export function initializeHALAnimation() {
  const halEye = document.getElementById('hal-animation');
  let currentState = 'idle';

  function updateAnimation(state) {
    halEye.classList.remove('listening', 'processing', 'speaking');
    if (state !== 'idle') {
      halEye.classList.add(state);
    }
    currentState = state;
  }

  window.toggleHALListening = function(listening) {
    updateAnimation(listening ? 'listening' : 'idle');
  }

  window.setHALProcessing = function() {
    updateAnimation('processing');
  }

  window.setHALSpeaking = function() {
    updateAnimation('speaking');
  }

  updateAnimation('idle');
}