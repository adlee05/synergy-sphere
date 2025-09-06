import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; // Backend URL

const authService = {
  // Get current user profile from backend
  getProfile: async (token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch profile' };
    }
  },

  // Update user profile
  updateProfile: async (token, userData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/auth/me`, userData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update profile' };
    }
  },

  // Get user by ID
  getUserById: async (token, userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch user' };
    }
  },

  // Sync user with backend (called automatically by AuthContext)
  syncUser: async (token, userData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/sync-user`, userData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to sync user' };
    }
  }
};

export default authService;
