import { useContext, createContext, useEffect, useState } from 'react';
export const AuthContext = createContext({});

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    verifyUser();
  }, []);

  function verifyUser() {
    fetch('/api/verifyUser', {
      method: 'GET',
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setUser(data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <AuthContext.Provider value={{ verifyUser, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
