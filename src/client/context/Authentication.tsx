import { useContext, createContext, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { init } from '../redux/mainSlice';
import { useDispatch } from 'react-redux';
export const AuthContext = createContext({});

export const AuthProvider = ({ children }: any) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Set to true to bypass authentication
  const devBypassAuthentication = false;

  useEffect(() => {
    verifyUser();
  }, []);

  function verifyUser() {
    if (devBypassAuthentication) {
      return dispatch(init({ user: { id: '', username: 'dev' }, allMaps: [] }));
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
            console.log(data);
            dispatch(
              init({
                user: { user_id: data.user_id, username: data.username },
                allMaps: data.maps_info,
              }),
            );
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
