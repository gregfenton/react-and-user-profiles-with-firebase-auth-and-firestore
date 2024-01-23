import { Link } from 'react-router-dom';
import { useAuthContext } from '../providers/AuthProvider';

const styleBottomCenter = {
  position: 'absolute',
  bottom: '10px',
  width: '90%',
  textAlign: 'center',
  color: 'magenta',
};

export const RestOfTheApp = () => {
  const { profile, logout } = useAuthContext();

  // this is not the cleanest way to handle "authentication routing" but works for now
  if (!profile) {
    return (
      <div>
        <h1>Hello</h1>
        <p>
          Please <Link to='/login'>log in here</Link>
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1>Hello, {profile.displayName}</h1>
      <button onClick={logout}>Logout</button>

      <div style={styleBottomCenter}>your email: {profile.email}</div>
    </div>
  );
};
