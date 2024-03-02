import { Outlet, useLocation } from 'react-router-dom';
import { NavBar } from '../../components/NavBar';

export const Main = () => {
  const renderNav =
    useLocation().pathname !== '/login' && useLocation().pathname !== '/signup';
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
    }}>
      {renderNav && <NavBar />}
      <main>
        <Outlet />
      </main>
    </div>
  );
};
