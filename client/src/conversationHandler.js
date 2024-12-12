import { initializeWakeWordDetection, stopWakeWordDetection, resetWakeWordDetection } from './wakeWordDetection';
import { animateMouth } from './lipSyncAnimation';
import { gsap } from 'gsap';
import { visemeToMouthShape } from './phonemeVisemeMapper'; // Correct import

export async function handleConversation(wakeWordTranscript) {
    console.log('Handling conversation with wake word:', wakeWordTranscript);

    try {
        // Remove wake-word-detected class and add processing class
        const halAnimation = document.getElementById('hal-animation');
        halAnimation.classList.remove('wake-word-detected');
        window.setHALProcessing();

        // Stop wake word detection while processing and speaking
        stopWakeWordDetection();

        await sendTranscriptToServer(wakeWordTranscript);
    } catch (error) {
        console.error('Error handling conversation:', error);
    } finally {
        console.log('Restarting wake word detection');
        resetWakeWordDetection();
    }
}

async function sendTranscriptToServer(transcript) {
    try {
        const response = await fetch('/api/transcribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ transcript }),
        });

        if (response.ok) {
            const { audio, visemes } = await response.json();
            if (!visemes || visemes.length === 0) {
                console.error('No visemes received from the server');
                return; // Exit the function if no visemes are available
            }
            const audioBuffer = Uint8Array.from(atob(audio), c => c.charCodeAt(0));
            const audioBlob = new Blob([audioBuffer], { type: 'audio/wav' });
            const audioUrl = URL.createObjectURL(audioBlob);
            const audioElement = new Audio(audioUrl);
            
            window.setHALSpeaking();
            
            const timeline = animateMouth(visemes);
            
            audioElement.play();
            timeline.play();

            console.log('Visemes received:', visemes);

            audioElement.onended = () => {
                console.log('Audio ended');
                const mouth = document.getElementById('kal-mouth'); // Now correctly imported
                console.log('Mouth element:', mouth);
                
                if (timeline) {
                    timeline.pause();
                }
                
                if (mouth) {
                    gsap.to(mouth, { height: visemeToMouthShape[0].height, duration: 0.2 });
                }
                
                window.toggleHALListening(true);
                resetWakeWordDetection();
            };
        } else {
            console.error('Server error:', response.statusText);
        }
    } catch (error) {
        console.error('Failed to send transcript to server:', error);
    } finally {
        window.toggleHALListening(true);
        resetWakeWordDetection();
    }
}