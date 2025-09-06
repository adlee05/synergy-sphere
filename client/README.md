# SynergySphere - Advanced Team Collaboration Platform

A modern React-based team collaboration platform with authentication, JWT token management, and light/dark theme support.

## Features

- 🔐 **Authentication System**
  - User registration with first name, last name, email, and password
  - User login with email and password
  - JWT token management with automatic session handling
  - Protected routes for authenticated users

- 🎨 **Theme System**
  - Light and dark theme support
  - Persistent theme preference
  - Smooth theme transitions

- 📱 **Responsive Design**
  - Mobile-first approach
  - Modern UI components
  - Beautiful gradients and animations

- 🛡️ **Security**
  - JWT token storage in localStorage
  - Automatic token expiration handling
  - Protected route components

## Tech Stack

- **Frontend**: React 19, Vite
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Authentication**: JWT (jsonwebtoken)
- **Icons**: React Icons
- **Styling**: CSS with CSS Variables for theming

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── ProtectedRoute.jsx
│   └── LoadingSpinner.css
├── contexts/           # React contexts
│   ├── AuthContext.jsx
│   └── ThemeContext.jsx
├── pages/              # Page components
│   ├── LoginPage.jsx
│   ├── SignupPage.jsx
│   ├── DashboardPage.jsx
│   ├── AuthPages.css
│   └── DashboardPage.css
├── services/           # API services
│   └── authService.js
├── App.jsx
├── App.css
├── index.css
└── main.jsx
```

## API Integration

The application is configured to work with a backend API. Update the `API_BASE_URL` in `src/services/authService.js` to point to your backend server.

### Expected API Endpoints

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)
- `POST /api/auth/logout` - User logout (optional)

## Features in Detail

### Authentication Flow

1. **Registration**: Users can create accounts with first name, last name, email, and password
2. **Login**: Users can sign in with email and password
3. **Token Management**: JWT tokens are automatically stored and managed
4. **Session Persistence**: User sessions persist across browser refreshes
5. **Automatic Logout**: Users are automatically logged out when tokens expire

### Theme System

- Toggle between light and dark themes
- Theme preference is saved in localStorage
- Smooth transitions between themes
- CSS variables for consistent theming across components

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Customization

- **Colors**: Modify CSS variables in `src/index.css`
- **Components**: Add new components in `src/components/`
- **Pages**: Add new pages in `src/pages/`
- **API**: Update API configuration in `src/services/`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.