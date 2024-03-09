import { useSelector, useDispatch } from 'react-redux';
import { NetworkGraph } from '../NetworkGraph/';
import { setActiveModal, setAllMaps } from '../../redux/mainSlice';
import { RootState } from '../../redux/store';
import { useEffect } from 'react';
import { useLocation } from 'react-router';

export const ReadOnlyDashboard = () => {
  return (
    <>
      <NetworkGraph readOnlyMode={true} />
    </>
  );
};
