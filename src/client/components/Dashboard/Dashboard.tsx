import { useSelector, useDispatch } from 'react-redux';
import { NetworkGraph } from '../NetworkGraph/';
import { setActiveModal, setAllMaps } from '../../redux/mainSlice';
import { RootState } from '../../redux/store';
import { useEffect } from 'react';

export const Dashboard = () => {
  // make fetch here
  // format data then dispatch to redux
  const dispatch = useDispatch();
  const selection = useSelector((state: RootState) => state.main.selectedMap);

  useEffect(() => {
    if (!selection) {
      dispatch(setActiveModal(1));
    }
  }, [selection]);
  return (
    <>
      <NetworkGraph />
    </>
  );
};
