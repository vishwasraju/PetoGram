# PetoGram - Pet Social Media Web App

A beautiful, responsive web application for pet lovers to share photos, videos, and connect with other pet owners.

## Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Social Feed**: Share and view pet photos and videos
- **Interactive Features**: Like, comment, and share posts
- **User Profiles**: Customizable profiles with pet information
- **Modern UI**: Clean, Instagram-inspired design
- **Mock Authentication**: Demo authentication system for testing

## Tech Stack
 
- **Framework**: React with TypeScript
- **Routing**: React Router
- **Styling**: CSS-in-JS with design tokens
- **Icons**: Lucide React
- **Fonts**: Inter & Poppins (Google Fonts)
- **State Management**: Local state with localStorage

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to the provided URL

## Demo Credentials

For testing the authentication system, you can use:
- **Email**: john@example.com
- **Password**: Any password (demo mode)

Or create a new account through the signup flow.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components
│   ├── blocks/         # Complex component blocks
│   ├── feed/           # Feed-related components
│   └── layout/         # Layout components
├── pages/              # Page components
├── utils/              # Utility functions
├── design-system/      # Design tokens and system
└── lib/                # Library utilities
```

## Features Implemented

- ✅ Responsive sidebar navigation
- ✅ Social media feed with posts
- ✅ Like/unlike functionality
- ✅ Comment system
- ✅ Video post support
- ✅ User profiles and verification badges
- ✅ Search functionality
- ✅ Mobile-responsive design
- ✅ Create post interface
- ✅ Mock authentication system
- ✅ Profile creation flow
- ✅ Pet management

## Development Notes

This is a demo application with mock authentication and data storage using localStorage. In a production environment, you would integrate with a real backend service and database.

## Future Enhancements

- Real backend integration
- Real-time messaging
- Pet service booking
- Advanced search and filters
- Push notifications
- Video upload and processing
- Social features (following, followers)