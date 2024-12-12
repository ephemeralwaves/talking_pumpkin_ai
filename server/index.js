const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const {generateResponse, textToSpeech } = require('./services/openai');
const { textToSpeechWithVisemes } = require('./services/speechService');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// Serve static files from the 'client/public' directory
app.use(express.static(path.join(__dirname, '../client/public')));

app.use(express.json());

// Handle POST requests to /api/transcribe
app.post('/api/transcribe', express.json(), async (req, res) => {
    try {
        const { transcript } = req.body;
        const response = await generateResponse(transcript);
        const { audio, visemes } = await textToSpeechWithVisemes(response);

        res.json({
            audio: Buffer.from(audio).toString('base64'),
            visemes: visemes
        });
    } catch (error) {
        console.error('Error processing transcript:', error);
        res.status(500).send(error.message);
    }
});

// Handle all GET requests by serving index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/public/index.html'));
});

const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};

const PORT = process.env.PORT || 3000;
//app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
https.createServer(options, app).listen(PORT, '0.0.0.0', () => {
    console.log(`HTTPS Server running on port ${PORT}`);
});