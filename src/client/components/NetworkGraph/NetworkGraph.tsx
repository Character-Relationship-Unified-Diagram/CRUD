import { ResponsiveNetwork } from '@nivo/network';
import { useSelector } from 'react-redux';

export const NetworkGraph = () => {
  const nodes = useSelector((state: any) => state.main.networkData.nodes);
  console.log(nodes);
  const links = useSelector((state: any) => state.main.networkData.links);
  if (!nodes.length || !links.length) return null;
  const data = {
    nodes,
    links,
  };
  return (
    <ResponsiveNetwork
      data={data}
      margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
      repulsivity={6}
      iterations={60}
      nodeColor={'#d3d3d3'}
      nodeBorderWidth={1}
      nodeBorderColor={{ from: 'color', modifiers: [['darker', 0.8]] }}
      linkThickness={3}
      linkColor={'#d3d3d3'}
      distanceMin={10}
      distanceMax={200}
      theme={{
        tooltip: {
          container: {
            background: '#333',
          },
        },
      }}
    />
  );
};
