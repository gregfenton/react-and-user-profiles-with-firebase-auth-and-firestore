import { createContext, useContext, useEffect, useState } from "react";

import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

import myFirebaseConfig from "./firebaseConfig.json";

export const FirebaseContext = createContext({});

const FirebaseProvider = (props) => {
  const { children } = props;

  if (
    !myFirebaseConfig?.projectId ||
    myFirebaseConfig.projectId.includes(">> YOUR_PROJECT")
  ) {
    console.error(
      "Invalid Firebase configuration in src/providers/firebaseConfig.json",
    );
  }

  const myApp = initializeApp(myFirebaseConfig);

  const myAuth = getAuth(myApp);
  const myFS = getFirestore(myApp);
  const myStorage = getStorage(myApp);

  const [firebaseInitializing, setFirebaseInitializing] = useState(true);
  const [usingEmulators, setUsingEmulators] = useState(false);
  const [emulatorsConfig, setEmulatorsConfig] = useState(false);

  useEffect(() => {
    const shouldUseEmulator = false; // or true :)

    if (shouldUseEmulator) {
      let mapEmulators = {};

      let FS_HOST = "localhost";
      let FS_PORT = 5002;

      if (FS_HOST && FS_PORT) {
        connectFirestoreEmulator(myFS, FS_HOST, FS_PORT);
        console.log(`firestore().useEmulator(${FS_HOST}, ${FS_PORT})`);
        mapEmulators.FS_HOST = FS_HOST;
        mapEmulators.FS_PORT = FS_PORT;
      }

      let AUTH_HOST = "localhost";
      let AUTH_PORT = 9099; // or whatever you set the port to in firebase.json
      if (AUTH_HOST && AUTH_PORT) {
        let AUTH_URL = `http://${AUTH_HOST}:${AUTH_PORT}`;
        console.log(
          `connectAuthEmulator(${AUTH_URL}, {disableWarnings: true})`,
        );
        //    warns you not to use any real credentials -- we don't need that noise :)
        connectAuthEmulator(myAuth, AUTH_URL, { disableWarnings: true });

        mapEmulators.AUTH_HOST = AUTH_HOST;
        mapEmulators.AUTH_PORT = AUTH_PORT;
        mapEmulators.AUTH_URL = AUTH_URL;
      }

      let STORAGE_HOST = "localhost";
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
        "FIREBASE STARTUP: using Firebase emulator:",
        JSON.stringify(mapEmulators, null, 2),
      );
    }

    setFirebaseInitializing(false);
  }, [myAuth, myFS, myStorage]);

  if (firebaseInitializing) {
    return <h1>Loading</h1>;
  }

  const theValues = {
    emulatorsConfig,
    myApp,
    myAuth,
    myFS,
    myStorage,
    usingEmulators,
  };

  return (
    <FirebaseContext.Provider value={theValues}>
      {children}
    </FirebaseContext.Provider>
  );
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
const useFirebaseContext = () => {
  // get the context
  const context = useContext(FirebaseContext);

  // if `undefined`, throw an error
  if (context === undefined) {
    throw new Error("useFirebaseContext was used outside of its Provider");
  }

  return context;
};

export { FirebaseProvider, useFirebaseContext };
