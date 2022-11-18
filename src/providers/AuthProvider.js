import React, { createContext, useContext, useEffect, useState } from 'react';

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';

import { FirebaseContext } from './FirebaseProvider';

export const AuthContext = createContext({});

const PROFILE_COLLECTION = 'users'; // name of the FS collection of user profile docs

export const AuthProvider = (props) => {
  const children = props.children;

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authErrorMessages, setAuthErrorMessages] = useState();

  const { myAuth, myFS } = useContext(FirebaseContext);

  const registerFunction = async (email, password, displayName = '') => {
    let userCredential;
    try {
      userCredential = await createUserWithEmailAndPassword(
        myAuth,
        email,
        password
      );
    } catch (ex) {
      console.error(`registerFunction() failed with: ${ex.message}`);
      setAuthErrorMessages([
        ex.message,
        'Did you enable the Email Provider in Firebase Auth?',
      ]);
      return false;
    }

    try {
      let user = userCredential.user;

      let userDocRef = doc(myFS, 'users', user.uid);
      let userDocData = {
        uid: user.uid,
        email: email,
        displayName: displayName,
        dateCreated: serverTimestamp(),
      };

      await setDoc(userDocRef, userDocData);
      return true;
    } catch (ex) {
      console.error(`registerFunction() failed with: ${ex.message}`);
      setAuthErrorMessages([
        ex.message,
        'Did you enable the Firestore Database in your Firebase project?',
      ]);
      return false;
    }
  };

  const loginFunction = async (email, password) => {
    try {
      let userCredential = await signInWithEmailAndPassword(
        myAuth,
        email,
        password
      );

      let user = userCredential.user;
      if (!user?.uid) {
        let msg = `No UID found after signIn!`;
        console.error(msg);
      }
      if (user) {
        console.log(`Logged in as uid(${user.uid}) email(${user.email})`);
      }
      setUser(user);
      return true;
    } catch (ex) {
      let msg = `Login failure for email(${email}: ${ex.message})`;
      console.error(msg);
      setAuthErrorMessages([ex.message]);
      return false;
    }
  };

  const logoutFunction = async () => {
    try {
      setUser(null); // shut down the listeners
      await signOut(myAuth);
      console.log('Signed Out');
      return true;
    } catch (ex) {
      console.error(ex);
      setAuthErrorMessages([ex.message]);
      return false;
    }
  };

  // hook into Firebase Authentication
  useEffect(() => {
    if (myAuth) {
      let unsubscribe = onAuthStateChanged(myAuth, (user) => {
        // if user is null, then we force them to login
        console.log('onAuthStateChanged(): got user', user);
        if (user) {
          setUser(user);
        }

        setAuthLoading(false);
      });

      return unsubscribe;
    }
  }, [myAuth]);

  // listen to the user profile (FS User doc)
  useEffect(() => {
    let unsubscribe = null;
    const listenToUserDoc = async (uid) => {
      try {
        let docRef = doc(myFS, PROFILE_COLLECTION, uid);
        unsubscribe = await onSnapshot(
          docRef,
          (docSnap) => {
            let profileData = docSnap.data();
            console.log('Got user profile:', profileData, docSnap);
            if (!profileData) {
              setAuthErrorMessages([
                `No profile doc found in Firestore at: ${docRef.path}`,
              ]);
            }
            setProfile(profileData);
          },
          (firestoreErr) => {
            console.error(
              `onSnapshot() callback failed with: ${firestoreErr.message}`,
              firestoreErr
            );
            setAuthErrorMessages([
              firestoreErr.message,
              'Have you initialized your Firestore database?',
            ]);
          }
        );
      } catch (ex) {
        console.error(
          `useEffect() calling onSnapshot() failed with: ${ex.message}`
        );
        setAuthErrorMessages([ex.message]);
      }
    };

    if (user?.uid) {
      listenToUserDoc(user.uid);

      return () => {
        unsubscribe && unsubscribe();
      };
    } else if (!user) {
      setAuthLoading(true);
      setProfile(null);
      setAuthErrorMessages(null);
    }
  }, [user, setProfile, myFS]);

  if (authLoading) {
    return <h1>Loading</h1>;
  }

  const theValues = {
    authErrorMessages,
    authLoading,
    profile,
    user,
    login: loginFunction,
    logout: logoutFunction,
    register: registerFunction,
  };

  return (
    <AuthContext.Provider value={theValues}>{children}</AuthContext.Provider>
  );
};
