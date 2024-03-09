import { useContext, createContext, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  init,
  setAllSelectedMapData,
  setIsLoading,
  setSelectedMapData,
} from '../redux/mainSlice';
import { useDispatch } from 'react-redux';
import { formatAll } from '../util/formatters';

interface AuthContextProps {
  verifyUser: () => void;
  fetchMap: (body: any) => void;
}

export const AuthContext = createContext<AuthContextProps>({
  verifyUser: () => {},
  fetchMap: () => {},
});

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
            dispatch(
              init({
                user: { user_id: data.user_id, username: data.username },
                allMaps: data.maps_info,
              }),
            );
          }
        })
        .catch((err) => {
          navigate('/login');
          console.log(err);
        });
    }
  }

  function fetchMap(body: any) {
    dispatch(setIsLoading(true));
    fetch('/maps/getMap', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch(setIsLoading(false));
        const {
          nodes,
          links,
          factions,
          characters,
          charRelationships,
          factionRelationships,
        } = formatAll(data);

        // console.log(data, nodes, links);

        dispatch(setAllSelectedMapData(data));
        dispatch(setSelectedMapData({ nodes, links }));
        dispatch(
          setAllSelectedMapData({
            factions,
            characters,
            charRelationships,
            factionRelationships,
          }),
        );
      })
      .catch((err) => {
        console.log(err);
        dispatch(setIsLoading(false));
      });
  }

  return (
    <AuthContext.Provider value={{ verifyUser, fetchMap }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
