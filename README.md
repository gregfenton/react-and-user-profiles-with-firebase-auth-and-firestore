# Simple React App with User Profiles using Firebase Auth + Firestore

This repository is a Vite & React (v18) project that uses a simple, _reusable_ pattern for connecting to Firebase services and leveraging Firebase Authentication and Firestore for user registration, login, logout and "dynamically watching" user profile data in real-time.

This project was created with `npx create-vite`.

NOTE: minimal (no?) time was spent on styling in order to focus on Firebase functionality, so the UI is extremely basic (ie: ugly).

## &lt;FirebaseProvider /&gt;

This component configures the app with your Firebase project's configuration information (the _firebaseConfig_), and gets the various Firebase services available for the rest of the app to use. The component uses React's Context API to make the services available.

## &lt;AuthProvider /&gt;

This component uses the Auth service (it gets from the &lt;FirebaseProvider /&gt;) to enable the AuthStateChanged listener, makes available functions: `login()`, `logout()` and `register()`, upon successful registration stores "user profile" data to Firestore, and upon a successful login fetches the "user profile" data for the currently logged in user.

## To Run This Project

1. `git clone https://github.com/gregfenton/react-and-firebase-auth-and-firestore.git`
1. `cd react-and-firebase-auth-and-firestore`
1. `npm install` to install the NPM dependencies
1. Open your favourite code editor (e.g. `code .` to run VSCode on this project)
1. Ensure your Firebase project has enabled the Email/Password sign-in provider:
   - Firebase Console >> YOUR_PROJECT >> Authentication >> Sign-In Method
   - If "Email/Password" is not listed under Sign-In Providers, click _Add New Provider_ and add it
   - Ensure that Email/Password is _Enabled_
1. Ensure your Firebase project has enabled the Firestore Database:
   - Firebase Console >> YOUR_PROJECT >> Firestore Database
   - if you see a _Create Database_ button, click it
      - if prompted for Security Rules, choose to go with ***test mode*** for now
1. Edit the file `FirebaseProvider.jsx` and update the values in `firebaseConfig` with those of your Firebase project (see comments in the code)
1. `npm run dev`

Now your browser should automatically open to http://localhost:3000/

1. If you have an existing account in your Firebase Authentication the enter the email, password and click the Login button.
1. If you'd like to register a new account, click the Register New Account button.
1. Once logged in, you will be presented with the `displayName` and `email` values that are in Firestore >> `users` >> [the UID from Firebase Auth]

You might also keep the "Hello" page showing and use Firebase Console >> Firestore to change the `displayName` of the user document. You will see the React app update its UI in real-time.

## To Use This Project In Your Own React App

The main parts of this app that is _reusable_ are `FirebaseProvider` and `AuthProvider`, both located in `src/providers`.

To use them, copy these two files into your React app, and somewhere near the top of your app's component tree "wrap" the parts of your app you want to use Firebase in with these two providers.

From `App.jsx`:

```js
return (
  <FirebaseProvider>
    <AuthProvider>

      <RestOfTheApp />

    </AuthProvider>
  </FirebaseProvider>
);
```

where `<RestOfTheApp />` represents the rest of your app (could be one component, or it could be a long list of JSX code).

Then in components `<RestOfTheApp />` or its descendants you can use the hooks:

- `useFirebaseContext()` to access the various handles to Firebase services: `myApp`, `myAuth`, `myFS`, `myStorage` and emulator settings `usingEmulators` and `emulatorsConfig`.
- `useAuthContext()` to access the `login()`, `logout()` and `register()` functions, the `profile` object that contains the `displayName` and `email` values from the user's Firestore "user profile" document, and the `user` object from Firebase Auth that is set when the user login process completes successfully (i.e. it is set by the onAuthStateChanged() listener)
