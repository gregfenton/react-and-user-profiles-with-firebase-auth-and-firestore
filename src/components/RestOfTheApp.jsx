import {useAuthContext} from '../providers/AuthProvider';
import {Login} from './Login';

const styleBottomCenter = {
  position: 'absolute',
  bottom: '10px',
  width: '90%',
  textAlign: 'center',
  color: 'magenta',
  font: 'italic bold 20px arial,serif',
};

export const RestOfTheApp = () => {
  const {profile, logout} = useAuthContext();

  if (!profile) {
    return <Login />;
  } else {
    return (
      <div>
        <h1>Hello, {profile.displayName}</h1>
        <button onClick={logout}>Logout</button>

        <div style={styleBottomCenter}>your email: {profile.email}</div>
      </div>
    );
  }
};
