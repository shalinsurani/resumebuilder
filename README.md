
# React Firebase Resume Builder

A professional resume builder application built with React and Firebase, featuring user authentication, cloud storage, and multiple professional templates.

## Features

- **User Authentication**: Complete login and signup system with Firebase Auth
- **Cloud Storage**: Resume data stored securely in Firebase Firestore
- **Photo Upload**: Upload profile photos with Firebase Storage
- **Multiple Templates**: Choose from Modern, Classic, and Creative designs
- **Real-time Preview**: See your resume update instantly as you type
- **Auto-save**: Automatic saving every 30 seconds
- **PDF Export**: Download your resume as a high-quality PDF
- **Responsive Design**: Works seamlessly on all devices

## Tech Stack

- **Frontend**: React 18, React Router 6
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Styling**: Custom CSS with CSS Grid and Flexbox
- **PDF Generation**: jsPDF and html2canvas
- **Icons**: Font Awesome

## Getting Started

### Prerequisites

- Node.js 14 or higher
- npm or yarn
- Firebase project

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd react-firebase-resume-builder
```

2. Install dependencies:
```bash
npm install
```

3. Create a Firebase project:
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create a new project
   - Enable Authentication (Email/Password)
   - Create Firestore database
   - Enable Firebase Storage

4. Configure Firebase:
   - Copy your Firebase configuration
   - Update `src/services/firebase.js` with your config

5. Start the development server:
```bash
npm start
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── components/
│   ├── auth/           # Authentication components
│   ├── common/         # Reusable components
│   ├── resume/         # Resume building components
│   └── templates/      # Resume templates
├── pages/              # Page components
├── services/           # Firebase services
├── contexts/           # React contexts
├── hooks/              # Custom hooks
├── utils/              # Utility functions
└── styles/             # CSS stylesheets
```

## Firebase Configuration

Update `src/services/firebase.js` with your Firebase project configuration:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

## Firebase Security Rules

### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;

      match /resumes/{resumeId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

### Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## Usage

1. **Sign Up**: Create an account with email and password
2. **Build Resume**: Fill out your personal information, experience, education, skills, and projects
3. **Upload Photo**: Add a professional photo to your resume
4. **Choose Template**: Select from Modern, Classic, or Creative templates
5. **Preview**: See real-time preview of your resume
6. **Export**: Download your resume as PDF

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@resumebuilder.com or create an issue in the repository.
