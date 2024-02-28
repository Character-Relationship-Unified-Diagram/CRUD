import { ResponsiveNetworkCanvas } from '@nivo/network';

export const NetworkGraph = ({ data }) => {
  <ResponsiveNetworkCanvas
    nodes={data.nodes}
    links={data.links}
    margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
    repulsivity={6}
    iterations={60}
    nodeColor={'#d3d3d3'}
    nodeBorderWidth={1}
    nodeBorderColor={{ from: 'color', modifiers: [['darker', 0.8]] }}
    linkThickness={function (e) {
      return 2 * (1 - e.source.depth / 10);
    }}
    linkColor={'#d3d3d3'}
    motionStiffness={160}
    motionDamping={12}
    distanceMin={10}
    distanceMax={200}
    theme={{
      tooltip: {
        container: {
          background: '#333',
        },
      },
    }}
  />;
};
