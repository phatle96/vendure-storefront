const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env
dotenv.config();

// Define environment values with .env overrides or default values
const production = process.env.APP_ENV || false;
const apiHost = process.env.API_HOST ||  '';
const apiPort = process.env.API_PORT ||  '';
const shopApiPath = process.env.SHOP_API_PATH || '';
const baseHref = process.env.BASE_HREF || '';
const tokenMethod = process.env.TOKEN_METHOD || '';
const novuApplicationIdentifier = process.env.NOVU_APP_IDENTIFIER || '';
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY || '',
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.FIREBASE_PROJECT_ID || '',
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.FIREBASE_APP_ID || '',
    measurementId: process.env.FIREBASE_MEASUREMENT_ID || ''
};
const vapid = process.env.VAPID || '';
const pushProviderIdentifier = process.env.PUSH_PROVIDER_IDENTIFIER || '';

// Create the environment.ts content
const envFileContent = `
export const environment = {
    production: ${production},
    apiHost: '${apiHost}',
    apiPort: ${apiPort},
    shopApiPath: '${shopApiPath}',
    baseHref: '${baseHref}',
    tokenMethod: '${tokenMethod}',
    novuApplicationIdentifier: '${novuApplicationIdentifier}',
    firebaseConfig: {
        apiKey: '${firebaseConfig.apiKey}',
        authDomain: '${firebaseConfig.authDomain}',
        projectId: '${firebaseConfig.projectId}',
        storageBucket: '${firebaseConfig.storageBucket}',
        messagingSenderId: '${firebaseConfig.messagingSenderId}',
        appId: '${firebaseConfig.appId}',
        measurementId: '${firebaseConfig.measurementId}'
    },
    vapid: '${vapid}',
    pushProviderIdentifier: '${pushProviderIdentifier}'
};
`;

// Define the path to the environment.js file
const targetPath = path.resolve(__dirname, 'src/environments/environment.ts');

// Write the environment file
fs.writeFileSync(targetPath, envFileContent);
console.log(`Environment file generated at ${targetPath}`);