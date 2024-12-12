
import { handleConversation } from './conversationHandler';

let recognition = null;

export function initializeWakeWordDetection() {
    if (!('webkitSpeechRecognition' in window)) {
        console.error('Web Speech API is not supported in this browser');
        return;
    }

    if (recognition) {
        console.log('Wake word detection already initialized');
        return;
    }

    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = handleRecognitionResult;
    recognition.onerror = handleRecognitionError;
    recognition.onend = handleRecognitionEnd;

    startRecognition();
}
function handleRecognitionResult(event) {
    for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
            const transcript = event.results[i][0].transcript.trim().toLowerCase();
            console.log('Heard:', transcript);
            const wakeWords = ['hey pumpkin', 'hey pump', 'hey umkin', 'pumpkin'];
            if (wakeWords.some(word => transcript.includes(word))) {
                console.log('Wake word detected:', transcript);
                const halAnimation = document.getElementById('hal-animation');
                halAnimation.classList.add('wake-word-detected');
                
                // Reset the recognition immediately
                resetWakeWordDetection();
                
                console.log('Handling conversation...');
                handleConversation(transcript);
                
                // Break the loop to prevent multiple detections
                break;
            }
        }
    }
}

async function sendTranscriptToServer(transcript) {
    try {
        const response = await fetch('/api/generate-response', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ transcript }),
        });
        
        if (response.ok) {
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedResponse = '';
            
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                const chunk = decoder.decode(value);
                accumulatedResponse += chunk;
                
                // Start TTS as soon as we have some content
                if (accumulatedResponse.length > 20) {
                    speakResponse(accumulatedResponse);
                    accumulatedResponse = '';
                }
            }
            
            // Speak any remaining content
            if (accumulatedResponse) {
                speakResponse(accumulatedResponse);
            }
        } else {
            console.error('Server error:', response.statusText);
        }
    } catch (error) {
        console.error('Failed to send transcript to server:', error);
    } finally {
        initializeWakeWordDetection();
    }
}




function handleRecognitionError(event) {
    console.error('Speech recognition error:', event.error);
}

function handleRecognitionEnd() {
    console.log('Speech recognition ended');
    if (recognition) {
        startRecognition();
    }
}

function startRecognition() {
    recognition.start();
    console.log('Wake word detection started');
}

export function stopWakeWordDetection() {
    if (recognition) {
        recognition.abort();
        recognition.onresult = null;
        recognition.onerror = null;
        recognition.onend = null;
        recognition = null;
        console.log('Wake word detection stopped and cleaned up');
    }
}
export function resetWakeWordDetection() {
    stopWakeWordDetection();
    setTimeout(() => {
        initializeWakeWordDetection();
    }, 100); // Short delay to ensure clean restart
}