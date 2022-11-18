import React from "react";
import { AuthProvider } from "./providers/AuthProvider";
import { FirebaseProvider } from "./providers/FirebaseProvider";
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