import { Outlet, useLocation, Route, Routes } from 'react-router-dom';
import { NavBar } from '../../components/NavBar';

export const Main = () => {
  const renderNav =
    useLocation().pathname !== '/login' && useLocation().pathname !== '/signup';
  const login = useLocation().pathname === '/login';
  const signup = useLocation().pathname === '/signup';
  console.log(login);
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
        <Outlet />
      </main>
    </div>
  );
};
