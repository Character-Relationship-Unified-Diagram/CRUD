import { useContext, createContext, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { setUser, setMain } from '../redux/mainSlice';
import { useDispatch } from 'react-redux';
export const AuthContext = createContext({});

export const AuthProvider = ({ children }: any) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Set to true to bypass authentication
  const devBypass = false;

  useEffect(() => {
    verifyUser();
  }, []);

  function verifyUser() {
    if (devBypass) {
      return dispatch(setUser({ id: '', username: 'dev' }));
    } else {
      fetch('/users/verifyUser', {
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
            dispatch(setUser(data));
            return navigate('/');
          }
        })
        .catch((err) => {
          navigate('/login');
          console.log(err);
        });
    }
  }

  return (
    <AuthContext.Provider value={{ verifyUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
