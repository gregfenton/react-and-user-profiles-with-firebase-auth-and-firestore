A super-simple React app for use with Firebase Authentication, Firestore and (optionally) other Firebase services.

This code uses React's Context API to make both Firebase services and Authentication objects (user, profile,
etc.) available to the rest of the application.

To use:

1. `git clone ...`
2. `npm install`
3.  Add your Firebase project's values to `firebaseConfig` in FirebaseProvider.js 
4. `npm run start`

Things you might also try:
- edit values in FirebaseProvider.js's `useEffect()` to enable use of the Firebase Emulator
