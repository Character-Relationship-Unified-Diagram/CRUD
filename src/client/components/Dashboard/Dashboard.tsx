import { useSelector } from 'react-redux';
import { NetworkGraph } from '../NetworkGraph/';
import { MapSelector } from '../MapSelector';

export const Dashboard = () => {
  // make fetch here
  // format data then dispatch to redux
  const selection = useSelector((state: any) => state.main.selectedMap);
  console.log(selection);
  return (
    <>
      {selection === null && <MapSelector />}
      <NetworkGraph />
    </>
  );
};
