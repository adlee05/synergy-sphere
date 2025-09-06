import User from '../models/User.js';
import sequelize from '../config.js';

const UserModel = User(sequelize);

// Sync user with Firebase data
export const syncUser = async (req, res) => {
  try {
    const { uid, email, displayName, photoURL } = req.body;
    const firebaseUser = req.firebaseUser;

    // Check if user already exists
    let user = await UserModel.findOne({ 
      where: { firebase_uid: uid } 
    });

    if (user) {
      // Update existing user
      await UserModel.update({
        email: email,
        display_name: displayName,
        photo_url: photoURL,
        email_verified: firebaseUser.email_verified,
        first_name: displayName ? displayName.split(' ')[0] : user.first_name,
        last_name: displayName ? displayName.split(' ').slice(1).join(' ') : user.last_name,
        updated_at: new Date()
      }, {
        where: { firebase_uid: uid }
      });

      // Get updated user
      user = await UserModel.findByPk(user.id);
    } else {
      // Create new user
      user = await UserModel.create({
        firebase_uid: uid,
        email: email,
        display_name: displayName,
        photo_url: photoURL,
        email_verified: firebaseUser.email_verified,
        first_name: displayName ? displayName.split(' ')[0] : null,
        last_name: displayName ? displayName.split(' ').slice(1).join(' ') : null
      });
    }

    res.json({
      message: 'User synced successfully',
      user: {
        id: user.id,
        firebase_uid: user.firebase_uid,
        email: user.email,
        display_name: user.display_name,
        photo_url: user.photo_url,
        first_name: user.first_name,
        last_name: user.last_name,
        email_verified: user.email_verified,
        role: user.role,
        created_at: user.created_at
      }
    });
  } catch (error) {
    console.error('Sync user error:', error);
    res.status(500).json({ error: 'Failed to sync user' });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = req.user;
    
    res.json({
      user: {
        id: user.id,
        firebase_uid: user.firebase_uid,
        email: user.email,
        display_name: user.display_name,
        photo_url: user.photo_url,
        first_name: user.first_name,
        last_name: user.last_name,
        email_verified: user.email_verified,
        role: user.role,
        created_at: user.created_at
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { first_name, last_name, display_name } = req.body;
    const userId = req.user.id;

    // Update user
    await UserModel.update(
      { 
        first_name, 
        last_name, 
        display_name,
        updated_at: new Date()
      },
      { where: { id: userId } }
    );

    // Get updated user
    const updatedUser = await UserModel.findByPk(userId);

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        firebase_uid: updatedUser.firebase_uid,
        email: updatedUser.email,
        display_name: updatedUser.display_name,
        photo_url: updatedUser.photo_url,
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        email_verified: updatedUser.email_verified,
        role: updatedUser.role,
        created_at: updatedUser.created_at
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await UserModel.findByPk(id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
};
