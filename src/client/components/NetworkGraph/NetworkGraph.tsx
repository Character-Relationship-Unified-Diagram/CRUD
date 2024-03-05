//Updated Tool Tip Code
import { ResponsiveNetworkCanvas } from '@nivo/network';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import ToolTip from './ToolTip';

export const NetworkGraph = () => {
  const nodes = useSelector((state: any) => state.main.networkData.nodes);
  console.log('these are the nodes: ', nodes);
  const links = useSelector((state: any) => state.main.networkData.links);
  const [tooltip, setTooltip] = useState<React.ReactNode | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const handleNodeClick = (node: any, event: React.MouseEvent<SVGCircleElement, MouseEvent>) => {
    // const rect = event.currentTarget.getBoundingClientRect();
    const tooltipX = event.clientX;
    const tooltipY = event.clientY; // Adjust this value as needed
  
    setTooltipPosition({ x: tooltipX, y: tooltipY });
  
    const toolTipContent: React.ReactNode = (
      <ToolTip>
        Node Name={node.id}
        {Object.entries(node).map(([key, value]: [string, any]) => (
          <div key={key}>
            <strong>{key}:</strong> {isObject(value) ? JSON.stringify(value) : value}
          </div>
        ))}
      </ToolTip>
    );
  
    setTooltip(toolTipContent);
  };
  
  const isObject = (value: any) => typeof value === 'object' && value !== null;
  

  const closeTooltip = () => {
    setTooltip(null);
  };

  return (
    <>
      <ResponsiveNetworkCanvas
        data={{ nodes, links }}
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
           repulsivity={1000}
           iterations={60}
           nodeColor={'#808080'}
           nodeBorderWidth={2}
           nodeBorderColor={{ from: 'color', modifiers: [['darker', 0.8]] }}
           linkThickness={3}
           linkColor={'#d3d3d3'}
           distanceMin={10}
           distanceMax={200}
           onClick={(node, event: any) => handleNodeClick(node, event)}
      />
      {tooltip && (
        <div
          style={{
            position: 'absolute',
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            zIndex: 9999,
          }}
          onMouseLeave={closeTooltip}
        >
          {tooltip}
        </div>
      )}
    </>
  );
};







// import { ResponsiveNetworkCanvas } from '@nivo/network';
// import { useSelector } from 'react-redux';
// import { useState } from 'react';
// import ToolTip from './ToolTip';

// export const NetworkGraph = () => {
//   const nodes = useSelector((state: any) => state.main.networkData.nodes);
//   console.log(nodes);
//   const links = useSelector((state: any) => state.main.networkData.links);
//   if (!nodes.length || !links.length) {
//     return <div>Loading...</div>;
//   }


//   const data = {
//     nodes,
//     links,
//   };
// //Need to figure out why the component dissapears when I add a div??
//   const [tooltip, setTooltip] = useState<React.ReactNode | null>(null);

//   const handleNodeClick = (node: any) => {
//     // Customize tooltip data based on passed-in node data
//     const toolTipContent: React.ReactNode = (
//       <ToolTip>
//       {Object.entries(node).map(([key, value]: [string, any]) => (
//         <div key={key}>
//           <strong>{key}:</strong> {typeof value === 'object' ? 'Object' : value}
//         </div>
//       ))}
//     </ToolTip>
//     );
  
//     //Set the tooltip content in state
//     setTooltip(toolTipContent);
//   };

//     const handleNodeHover = (node: any) => {
//       console.log("Node hovered", node);
//     }

//   return (
//    <>
//     <ResponsiveNetworkCanvas
//       data={data}
//       margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
//       repulsivity={1000}
//       iterations={60}
//       nodeColor={'#d3d3d3'}
//       nodeBorderWidth={1}
//       nodeBorderColor={{ from: 'color', modifiers: [['darker', 0.8]] }}
//       linkThickness={3}
//       linkColor={'#d3d3d3'}
//       distanceMin={10}
//       distanceMax={200}
//       onClick={(node) => handleNodeClick(node)}
//       // theme={{
//       //   tooltip: {
//       //     container: {
//       //       background: '#333',
//       //       fontSize: '14px',
//       //     },
//       //   },
//       // }}
//     />
//     {tooltip}
//     </> 
//   );
// };