# Talking Pumpkin

This is a web application that allows users to interact with a magical talking pumpkin. The app listens for a "Hey Pumpkin" wake word, transcribes the user's speech to text, generates a response using OpenAI's GPT-4,  and then speaks the response back to the user. The mouth is animated using Azure Cognitive Services.
This was created to be projected onto a real pumpkin to interact with trick or treaters. In the code the pumpkin is referred to as "Kal" or "Hal".

## Prerequisites

- Node.js (v18 or higher)
- NPM (v6 or higher)
- An OpenAI API key
- An Azure Cognitive Services API key

For Azure Cognitive Services:
1. **Create an Azure Account**:
   - Go to the [Azure Portal](https://portal.azure.com/).
   - Sign up for an account if you don't have one.

2. **Create a Speech Service**:
   - In the Azure Portal, click on "Create a resource."
   - Search for "Speech" and select "Speech" from the list.
   - Click "Create" and fill in the required details (Subscription, Resource Group, Region, etc.).
   - Click "Review + create" and then "Create" to provision the service.

3. **Get Your Azure Key and Region**:
   - After the service is created, go to the resource.
   - Under the "Keys and Endpoint" section, you will find your **Key** and **Region**.
   - Copy these values and add them to your `.env` file as shown below.


Voices can be found here https://speech.microsoft.com/portal/voicegallery

## Installation

1. Clone the repository:

```bash
git clone https://github.com/ephemeralwaves/talking_pumpkin.git
cd talking_pumpkin
```

2. Install the dependencies:

```bash
npm install 
```

3. Create a `.env` file in the `server/config` directory with your OpenAI API key:

```
OPENAI_API_KEY=your_openai_api_key_here
AZURE_SPEECH_KEY=your_azure_speech_key_here
AZURE_REGION=your_azure_region_here
```

### Instructions for Generating and Using `.pem` Files

To run the server with HTTPS, you will need to generate the necessary `.pem` files: `key.pem`, `csr.pem`, and `cert.pem`. Follow the instructions below to create these files.

#### Generating the Necessary `.pem` Files

1. **Prerequisites**

   Make sure you have OpenSSL installed on your system. You can check if it's installed by running:

   ```bash
   openssl version
   ```

   If OpenSSL is not installed, you can download and install it from [OpenSSL's official website](https://www.openssl.org/).

2. **Generating a Private Key (`key.pem`)**

   To generate a private key in PEM format, use the following command:

   ```bash
   openssl genpkey -algorithm RSA -out key.pem -pkeyopt rsa_keygen_bits:2048
   ```
    - This command generates a 2048-bit RSA private key and saves it to `key.pem`.

3. **Generating a Certificate Signing Request (`csr.pem`)**

   Once you have the private key, you can generate a certificate signing request (CSR) using the following command:

   ```bash
   openssl req -new -key key.pem -out csr.pem
   ```

   - This command will prompt you for information such as country, state, organization, and common name (domain name). The generated CSR will be saved as `csr.pem`.

4. **Generating a Self-Signed Certificate (`cert.pem`)**

   If you need a self-signed certificate for testing purposes, you can generate one using the following command:

   ```bash
   openssl req -new -x509 -key key.pem -out cert.pem -days 365
   ```

   - This command uses the private key from `key.pem` to create a self-signed certificate valid for 365 days, saved as `cert.pem`.

#### Using the `.pem` Files in the Application

1. **Place the `.pem` Files**
 Ensure that the generated `.pem` files (`key.pem` and `cert.pem`) are placed in the root directory of your server or in a designated secure directory.

2. **Update the Server Code**

   In your `server/index.js` file, ensure that the options for HTTPS are set to read the `.pem` files correctly:

   ```javascript
   const fs = require('fs');
   const https = require('https');

   const options = {
       key: fs.readFileSync('key.pem'),
       cert: fs.readFileSync('cert.pem')
   };

   const server = https.createServer(options, app);
   ```


4. Build the client-side code:
The client-side code needs to be built before the app can be run. To do this, run the following command in your terminal:

```bash
npm run build
```

5. Start the server:

```bash
npm start
```

or HOST=0.0.0.0 npm start if running on another machine.

6. Access the app:
Open your web browser and navigate to http://localhost:3000 (or whatever port your Express server is configured to use). You should see the Talking Pumpkin web app.

## Usage

1. Click the "Activate" button to begin listening for the wake word.
2. Say "Hey Pumpkin" to activate the AI.
3. Ask your question or give a command.
4. Wait for the pumpkin to respond.
5. Click the "Deactivate" button when you're done.


## License

GPL v3.0