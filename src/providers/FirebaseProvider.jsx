import {initializeApp} from 'firebase/app';
import {connectAuthEmulator, getAuth} from 'firebase/auth';
import {connectFirestoreEmulator, getFirestore} from 'firebase/firestore';
import {connectStorageEmulator, getStorage} from 'firebase/storage';
import {createContext, useContext, useEffect, useState} from 'react';

import myFirebaseConfig from './firebaseConfig.json';

const myApp = initializeApp(myFirebaseConfig);

const myFS = getFirestore(myApp);
const myStorage = getStorage(myApp);

// separated `myAuth` because in Expo/RN we do more work setting up Auth
const myAuth = getAuth(myApp);

export const FirebaseContext = createContext({});

export const FirebaseProvider = (props) => {
  const {children} = props;

  if (!myFirebaseConfig?.projectId || myFirebaseConfig.projectId.includes('>> YOUR_PROJECT')) {
    console.error('Invalid Firebase configuration in src/providers/firebaseConfig.json');
  }

  const [firebaseInitializing, setFirebaseInitializing] = useState(true);
  const [usingEmulators, setUsingEmulators] = useState(false);
  const [emulatorsConfig, setEmulatorsConfig] = useState(false);

  useEffect(() => {
    const shouldUseEmulator = false; // or true :)

    if (shouldUseEmulator && myAuth && myFS && myStorage) {
      let mapEmulators = {};

      let FS_HOST = 'localhost';
      let FS_PORT = 5002;

      if (FS_HOST && FS_PORT) {
        connectFirestoreEmulator(myFS, FS_HOST, FS_PORT);
        console.log(`firestore().useEmulator(${FS_HOST}, ${FS_PORT})`);
        mapEmulators.FS_HOST = FS_HOST;
        mapEmulators.FS_PORT = FS_PORT;
      }

      let AUTH_HOST = 'localhost';
      let AUTH_PORT = 9099; // or whatever you set the port to in firebase.json
      if (AUTH_HOST && AUTH_PORT) {
        let AUTH_URL = `http://${AUTH_HOST}:${AUTH_PORT}`;
        console.log(`connectAuthEmulator(${AUTH_URL}, {disableWarnings: true})`);
        //    warns you not to use any real credentials -- we don't need that noise :)
        connectAuthEmulator(myAuth, AUTH_URL, {disableWarnings: true});

        mapEmulators.AUTH_HOST = AUTH_HOST;
        mapEmulators.AUTH_PORT = AUTH_PORT;
        mapEmulators.AUTH_URL = AUTH_URL;
      }

      let STORAGE_HOST = 'localhost';
      let STORAGE_PORT = 5004; // or whatever you have it set to in firebase.json
      if (STORAGE_HOST && STORAGE_PORT) {
        console.log(`connectStorageEmulator(${STORAGE_HOST}, ${STORAGE_PORT})`);
        connectStorageEmulator(myStorage, STORAGE_HOST, STORAGE_PORT);

        mapEmulators.STORAGE_HOST = STORAGE_HOST;
        mapEmulators.STORAGE_PORT = STORAGE_PORT;
      }

      setUsingEmulators(true);
      setEmulatorsConfig(mapEmulators);

      console.log(
        'FIREBASE STARTUP: using Firebase emulator:',
        JSON.stringify(mapEmulators, null, 2),
      );
    }

    setFirebaseInitializing(false);
  }, [myAuth, myFS, myStorage]);

  if (firebaseInitializing) {
    return null;
  }

  const theValues = {
    emulatorsConfig,
    myApp,
    myAuth,
    myFS,
    myStorage,
    usingEmulators,
  };

  return <FirebaseContext.Provider value={theValues}>{children}</FirebaseContext.Provider>;
};

/**
 * A hook that returns the FirebaseContext's values.
 *
 * @typedef {Object} FirebaseContextValues
 * @property {import('firebase/app').FirebaseApp} myApp - the Firebase app instance
 * @property {import('firebase/auth').Auth} myAuth - the Firebase Auth instance
 * @property {import('firebase/firestore').Firestore} myFS - the Firestore instance
 * @property {import('firebase/storage').FirebaseStorage} myStorage - the Firebase Cloud Storage instance
 * @property {boolean} usingEmulators - true if using emulators, false otherwise
 * @property {object} emulatorsConfig - configuration for the emulators if `usingEmulators` is true
 *
 * @returns {FirebaseContextValues}
 */
export const useFirebaseContext = () => {
  // get the context
  const context = useContext(FirebaseContext);

  // if `undefined`, throw an error
  if (context === undefined) {
    throw new Error('useFirebaseContext was used outside of its Provider');
  }

  return context;
};
