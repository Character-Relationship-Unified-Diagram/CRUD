import { Outlet, useLocation } from 'react-router-dom';
import { NavBar } from '../../components/NavBar';
import { Login } from '../Login';
import { Signup } from '../Signup';

export const Main = () => {
  const renderNav =
    useLocation().pathname !== '/login' && useLocation().pathname !== '/signup';
  const login = useLocation().pathname === '/login';
  const signup = useLocation().pathname === '/signup';
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
      }}
    >
      {renderNav && <NavBar />}
      <main>
        {login && <Login />}
        {signup && <Signup />}
        <Outlet />
      </main>
    </div>
  );
};
