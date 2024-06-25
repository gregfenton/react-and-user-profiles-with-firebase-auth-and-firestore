import { useState } from 'react';
import { useAuthContext } from '../providers/AuthProvider';
import { Register } from './Register';

export const Login = () => {
  const { login, authErrorMessages } = useAuthContext();

  const [email, setEmail] = useState(''); // input field value cannot be null
  const [password, setPassword] = useState(''); // input field value cannot be null

  const [loginRunning, setLoginRunning] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  const handleButtonClick = async () => {
    setLoginRunning(true);
    let success = await login(email, password);
    setLoginRunning(false);
    if (!success) {
      setErrorMessage('Registration failed!');
    }
  };

  const toggleShowRegisterScreen = () => {
    setShowRegisterForm((currVal) => !currVal);
  };

  if (showRegisterForm) {
    return (
      <div>
        <Register />
        <br />
        <br />
        <button onClick={toggleShowRegisterScreen}>
          Sign In To Existing Account
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2>Sign In To Existing Account</h2>
      <table className='center-table'>
        <tbody>
          <tr>
            <td>
              <label>email:</label>
            </td>
            <td>
              <input
                type='text'
                name='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </td>
          </tr>
          <tr>
            <td>
              <label>password:</label>
            </td>
            <td>
              <input
                type='password'
                name='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </td>
          </tr>
          <tr>
            {!loginRunning ? (
              <td colSpan={2} style={{ textAlign: 'center' }}>
                <button style={{ width: '75%' }} onClick={handleButtonClick}>
                  Login
                </button>
                {(errorMessage || authErrorMessages) && (
                  <>
                    <br />
                    <h3 style={{ color: 'red' }}>{errorMessage}</h3>
                    {authErrorMessages?.map((errorLine, idx) => (
                      <h4 key={`errmsg-${idx}`} style={{ color: 'red' }}>
                        {errorLine}
                      </h4>
                    ))}
                  </>
                )}
              </td>
            ) : (
              <td>
                <h6 style={{ color: 'green' }}>
                  <em>logging in...</em>
                </h6>
              </td>
            )}
          </tr>
        </tbody>
      </table>
      <br />
      <br />
      <button onClick={toggleShowRegisterScreen}>Register New Account</button>
    </div>
  );
};
