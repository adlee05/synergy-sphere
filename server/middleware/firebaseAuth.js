import admin from '../config/firebase.js';
import User from '../models/User.js';
import sequelize from '../config.js';

const UserModel = User(sequelize);

export const verifyFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    console.log('Firebase Auth Middleware - Token received:', token ? 'Yes' : 'No');

    if (!token) {
      console.log('Firebase Auth Middleware - No token provided');
      return res.status(401).json({ error: 'Access token required' });
    }

    // Verify Firebase token
    console.log('Firebase Auth Middleware - Verifying token...');
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log('Firebase Auth Middleware - Token verified for UID:', decodedToken.uid);
    
    // Get or create user in database
    let user = await UserModel.findOne({ 
      where: { firebase_uid: decodedToken.uid } 
    });

    if (!user) {
      console.log('Firebase Auth Middleware - Creating new user in database');
      // Create new user if doesn't exist
      user = await UserModel.create({
        firebase_uid: decodedToken.uid,
        email: decodedToken.email,
        display_name: decodedToken.name,
        photo_url: decodedToken.picture,
        email_verified: decodedToken.email_verified,
        first_name: decodedToken.name ? decodedToken.name.split(' ')[0] : null,
        last_name: decodedToken.name ? decodedToken.name.split(' ').slice(1).join(' ') : null
      });
    } else {
      console.log('Firebase Auth Middleware - Updating existing user');
      // Update user info if exists
      await UserModel.update({
        email: decodedToken.email,
        display_name: decodedToken.name,
        photo_url: decodedToken.picture,
        email_verified: decodedToken.email_verified,
        first_name: decodedToken.name ? decodedToken.name.split(' ')[0] : user.first_name,
        last_name: decodedToken.name ? decodedToken.name.split(' ').slice(1).join(' ') : user.last_name,
        updated_at: new Date()
      }, {
        where: { firebase_uid: decodedToken.uid }
      });
    }

    req.user = user;
    req.firebaseUser = decodedToken;
    console.log('Firebase Auth Middleware - Authentication successful');
    next();
  } catch (error) {
    console.error('Firebase auth error:', error);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};
