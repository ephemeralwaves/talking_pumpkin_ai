import { initializeWakeWordDetection, stopWakeWordDetection } from './wakeWordDetection';
import { initializeHALAnimation } from './halAnimation';
import { handleConversation } from './conversationHandler';
import { gsap } from 'gsap';

document.addEventListener('DOMContentLoaded', () => {
    console.log('index.js loaded');
    console.log('KAL 9000 initialized');

    const startButton = document.getElementById('start-button');
    const stopButton = document.getElementById('stop-button');
    const fullscreenButton = document.getElementById('fullscreen-button'); // New button

    startButton.addEventListener('click', async () => {
        console.log('Start button clicked');
        try {
            await initializeWakeWordDetection();
            console.log('Wake word detection initialized successfully');
           
            window.toggleHALListening(true);
        } catch (error) {
            console.error('Error initializing:', error);
        }
    });

    stopButton.addEventListener('click', () => {
        console.log('Stop button clicked');
        stopWakeWordDetection();
        window.toggleHALListening(false);
        
        // Reset HAL animation to idle state
        const halAnimation = document.getElementById('hal-animation');
        halAnimation.classList.remove('listening', 'processing', 'speaking', 'wake-word-detected');
        
        console.log('HAL 9000 deactivated');
    });

    fullscreenButton.addEventListener('click', () => { // New event listener
        const app = document.getElementById('app');
        if (app.requestFullscreen) {
            app.requestFullscreen();
        } else if (app.mozRequestFullScreen) { // Firefox
            app.mozRequestFullScreen();
        } else if (app.webkitRequestFullscreen) { // Chrome, Safari and Opera
            app.webkitRequestFullscreen();
        } else if (app.msRequestFullscreen) { // IE/Edge
            app.msRequestFullscreen();
        }
    });

    initializeHALAnimation();
});