import { ResponsiveNetworkCanvas } from '@nivo/network';

export const NetworkGraph = ({ data }: any) => {
  if (!data) return null;
  return (
    <ResponsiveNetworkCanvas
      data={data.nodes}
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
