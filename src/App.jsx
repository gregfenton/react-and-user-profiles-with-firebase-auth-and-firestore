import { MainRouter } from './components/MainRouter';
import { AuthProvider } from './providers/AuthProvider';
import { FirebaseProvider } from './providers/FirebaseProvider';

export const App = () => {
  return (
    <FirebaseProvider>
      <AuthProvider>
        <MainRouter />
      </AuthProvider>
    </FirebaseProvider>
  );
};

export default App;
