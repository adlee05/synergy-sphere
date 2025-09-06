import admin from 'firebase-admin';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin SDK
try {
  // Option 1: Using service account key file
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      
      // Validate required fields
      if (!serviceAccount.private_key || !serviceAccount.client_email || !serviceAccount.project_id) {
        throw new Error('Missing required fields in service account key');
      }
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log('✅ Firebase Admin initialized with environment variable');
    } catch (parseError) {
      console.error('❌ Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:', parseError.message);
      console.log('🔄 Falling back to application default credentials...');
      
      // Fallback to application default credentials
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId: 'synergysphere-6b287'
      });
      console.log('✅ Firebase Admin initialized with application default credentials');
    }
  } 
  // Option 2: Using service account JSON file
  else if (process.env.FIREBASE_PROJECT_ID) {
    const serviceAccountPath = path.join(__dirname, '..', 'serviceAccount.json');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountPath),
      projectId: process.env.FIREBASE_PROJECT_ID
    });
    console.log('✅ Firebase Admin initialized with service account file');
  } 
  // Option 3: Using application default credentials
  else {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId: 'synergysphere-6b287'
    });
    console.log('✅ Firebase Admin initialized with application default credentials');
  }
} catch (error) {
  console.error('❌ Firebase Admin initialization failed:', error.message);
  console.error('Please check your Firebase configuration');
  console.log('💡 Make sure you have:');
  console.log('   1. A valid .env file with FIREBASE_SERVICE_ACCOUNT_KEY');
  console.log('   2. Or a serviceAccount.json file in the server directory');
  console.log('   3. Or Firebase CLI configured with "firebase login"');
  console.log('');
  console.log('🔧 To fix the service account key issue:');
  console.log('   1. Go to Firebase Console > Project Settings > Service Accounts');
  console.log('   2. Generate a new private key');
  console.log('   3. Copy the entire JSON content');
  console.log('   4. Set it as FIREBASE_SERVICE_ACCOUNT_KEY in your .env file');
}

export default admin;
