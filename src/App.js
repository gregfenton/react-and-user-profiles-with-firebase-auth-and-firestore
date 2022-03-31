import React from "react";
import { AuthProvider } from "./AuthProvider";
import { FirebaseProvider } from "./FirebaseProvider";
import { RestOfTheApp } from "./RestOfTheApp";

export const App = () => {

  return (
    <FirebaseProvider>
      <AuthProvider>
    
        <RestOfTheApp />

      </AuthProvider>
    </FirebaseProvider>
  );
};

export default App;