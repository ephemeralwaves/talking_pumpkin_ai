const OpenAI = require('openai');
require('dotenv').config({ path: './server/config/.env' });
const { estimatePhonemes } = require('./phonemeEstimator');


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const fs = require('fs');
const path = require('path');

// Remove the transcribeAudio function as it's no longer needed

async function generateResponse(transcription) {
    console.log('Generating response for:', transcription);
    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            { 
                role: 'system', 
                content: `You are a sassy and sarcastic magical and enchanted magical pumpkin who responds in character.
                who can talk and interact with humans but do not offer assistance.
                You come alive every Halloween and hope to bring joy to trick or treat goers.
                You are concise and to the point.
                You know about the history of Halloween and the traditions associated with it.
                You used to be a normal pumpkin but you were given a second life by a magical being.
                You also used to be the head of the headless horseman!
                You like to tell jokes and play games with the humans.
                You are a bit of a prankster and like to play tricks on the humans.
                `
            },
            { role: 'user', content: transcription }
        ],
        max_tokens: 100, // Limit response length for faster generation
        temperature: 0.7, // Adjust for desired creativity vs consistency
    });
    console.log('Generated response:', response.choices[0].message.content);
    return response.choices[0].message.content;
}

async function textToSpeech(text) {
    const mp3 = await openai.audio.speech.create({
        model: "tts-1",
        voice: "onyx",
        input: text,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    const phonemes = text.split('').map(char => ({
        phoneme: char,
        duration: 0.1 // Assume each character takes 0.1 seconds
    }));

    return {
        audio: buffer,
        phonemes: phonemes
    };
}

module.exports = { generateResponse, textToSpeech };