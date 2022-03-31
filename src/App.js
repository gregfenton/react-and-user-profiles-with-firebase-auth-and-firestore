import React from "react";
import { AuthProvider } from "./components/AuthProvider";
import { FirebaseProvider } from "./components/FirebaseProvider";
import { RestOfTheApp } from "./components/RestOfTheApp";

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