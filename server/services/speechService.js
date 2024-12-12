const sdk = require('microsoft-cognitiveservices-speech-sdk');
require('dotenv').config();

const speechConfig = sdk.SpeechConfig.fromSubscription(process.env.AZURE_SPEECH_KEY, process.env.AZURE_SPEECH_REGION);
speechConfig.speechSynthesisVoiceName = "en-US-AndrewNeural";

async function textToSpeechWithVisemes(text) {
    return new Promise((resolve, reject) => {
        const synthesizer = new sdk.SpeechSynthesizer(speechConfig);
        
        let audioData = [];
        let visemeData = [];

        synthesizer.visemeReceived = (s, e) => {
            visemeData.push({
                visemeId: e.visemeId,
                audioOffset: e.audioOffset / 10000 // Convert to milliseconds
            });
        };

        synthesizer.synthesisCompleted = (s, e) => {
            const audioDataArray = new Uint8Array(e.result.audioData);
            resolve({ audio: audioDataArray, visemes: visemeData });
        };

        synthesizer.synthesisStarted = (s, e) => {
            console.log("Synthesis started");
        };

        synthesizer.synthesisCanceled = (s, e) => {
            console.error("Synthesis canceled, error: " + e.errorDetails);
            reject(e);
        };

        synthesizer.speakTextAsync(text);
    });
}

module.exports = { textToSpeechWithVisemes };