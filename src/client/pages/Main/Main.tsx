import { Outlet, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { NavBar } from '../../components/NavBar';
import { RootState } from '../../redux/store';
import { MapSelector } from '../../components/MapSelector';
import {
  NewCharacter,
  NewRelationship,
  NewDiagram,
} from '../../components/CreateNew';
import { Delete } from '../../components/Delete';
import { Share } from '../Share';
import { useEffect, useState, ReactNode } from 'react';

export const Main = () => {
  const renderNav =
    useLocation().pathname !== '/login' && useLocation().pathname !== '/signup';
  const [currentModal, setCurrentModal] = useState<ReactNode | null>(null);
  const selectedMap = useSelector((state: RootState) => state.main.selectedMap);
  const modalNum = useSelector((state: RootState) => state.main.activeModal);

  useEffect(() => {
    if (!selectedMap) {
      setCurrentModal(<MapSelector />);
    }
    switch (modalNum) {
      case 1:
        setCurrentModal(<MapSelector />);
        break;
      case 2:
        setCurrentModal(<NewDiagram />);
        break;
      case 3:
        setCurrentModal(<Delete />);
        break;
      case 4:
        setCurrentModal(<Share />);
        break;
      case 5:
        setCurrentModal(<NewRelationship />);
        break;
      case 6:
        setCurrentModal(<NewCharacter />);
        break;
      default:
        setCurrentModal(null);
    }
  }, [modalNum]);

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
        {renderNav && currentModal}
        <Outlet />
      </main>
    </div>
  );
};
