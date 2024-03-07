import { useSelector } from 'react-redux';
import { NetworkGraph } from '../NetworkGraph/';
import { MapSelector } from '../MapSelector';
import { RootState } from '../../redux/store';

export const Dashboard = () => {
  // make fetch here
  // format data then dispatch to redux
  const selection = useSelector((state: RootState) => state.main.selectedMap);
  console.log(selection);
  return (
    <>
      {selection === null && <MapSelector />}
      <NetworkGraph />
    </>
  );
};
