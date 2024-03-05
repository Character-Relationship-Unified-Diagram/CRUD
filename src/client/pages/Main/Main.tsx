import { Outlet } from 'react-router-dom';
import { NavBar } from '../../components/NavBar';
import { ToolsDrawer } from '../../components/Drawer';

export const Main = () => {
  return (
    <>
      {/* <NavBar /> */}
      <ToolsDrawer />
      <main>
        <Outlet />
      </main>
    </>
  );
};
