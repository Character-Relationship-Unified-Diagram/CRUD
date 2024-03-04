import { useContext, createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
export const AuthContext = createContext({});

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  // Set to true to bypass authentication
  const devBypass = true;

  useEffect(() => {
    verifyUser();
  }, []);

  function verifyUser() {
    if (devBypass) {
      return setUser({ username: 'dev' });
    } else {
      fetch('/verifyUser', {
        method: 'GET',
        credentials: 'include',
      })
        .then((res) => {
          if (res.status !== 200) {
            return navigate('/login');
          }
          return res.json();
        })
        .then((data) => {
          if (data) {
            setUser(data);
          }
        })
        .catch((err) => {
          navigate('/login');
          console.log(err);
        });
    }
  }

  return (
    <AuthContext.Provider value={{ verifyUser, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
