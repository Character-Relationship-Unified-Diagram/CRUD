import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { LoadingOverlay } from '../LoadingOverlay';
import { NetworkGraph } from '../NetworkGraph/';

export const ReadOnlyDashboard = () => {
  const isLoading = useSelector((state: RootState) => state.main.isLoading);
  return (
    <>
      {isLoading && <LoadingOverlay size="lg" />}
      <NetworkGraph readOnlyMode={true} />
    </>
  );
};
