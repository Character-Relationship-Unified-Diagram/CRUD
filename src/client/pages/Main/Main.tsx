import { Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { NavBar } from '../../components/NavBar';
import { RootState } from '../../redux/store';
import { MapSelector } from '../../components/MapSelector';
import {
  NewCharacter,
  NewRelationship,
  NewDiagram,
  NewFaction,
} from '../../components/CreateNew';
import {
  DeleteCharacter,
  DeleteDiagram,
  DeleteNew,
  DeleteNewButton,
  DeleteRelationship,
} from '../../components/Delete';
import { Share } from '../../components/Share';
import { useEffect, useState, ReactNode } from 'react';
import { ShareModal } from '../../components/Share/Share';

export const Main = () => {
  const renderNav =
    useLocation().pathname !== '/login' &&
    useLocation().pathname !== '/signup' &&
    useLocation().pathname !== '/view';
  const selectedMap = useSelector((state: RootState) => state.main.selectedMap);
  const modalNum = useSelector((state: RootState) => state.main.activeModal);
  const [currentModal, setCurrentModal] = useState<ReactNode | null>(null);

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
        setCurrentModal(<DeleteCharacter />);
        break;
      case 4:
        setCurrentModal(<ShareModal />);
        break;
      case 5:
        setCurrentModal(<NewRelationship />);
        break;
      case 6:
        setCurrentModal(<NewCharacter />);
        break;
      case 7:
        setCurrentModal(<DeleteRelationship />);
        break;
      case 8:
        setCurrentModal(<DeleteDiagram />);
        break;
      case 9:
        setCurrentModal(<NewFaction />);
        break;
      default:
        setCurrentModal(null);
    }
  }, [modalNum]);

  return (
    <>
      {renderNav && <NavBar />}
      <main>
        {renderNav && currentModal}
        <Outlet />
      </main>
    </>
  );
};
