import { useRef, useEffect } from 'react';
import { ResponsiveNetwork } from '@nivo/network';
import { useSelector } from 'react-redux';
import * as d3 from 'd3';
import { ZoomBehavior, ZoomedElementBaseType, zoomIdentity } from 'd3-zoom';
import './NetworkGraph.css';

export const NetworkGraph = () => {
  const nodes = useSelector((state: any) => state.main.networkData.nodes);
  const links = useSelector((state: any) => state.main.networkData.links);
  const svgRef = useRef(null);

  if (!nodes.length || !links.length) return null;

  const data = {
    nodes,
    links,
  };

  useEffect(() => {
    const svgElement = d3.select(svgRef.current);
    function zoomed(event: any) {
      // console.log(event);
      svgElement.selectAll('g').attr('transform', event.transform.toString());
    }
    
    const zoom = d3.zoom().on('zoom', zoomed) as any;
    svgElement.call(zoom);
    return () => {
      svgElement.on('.zoom', null);
      svgElement.on('.drag', null);
    };
  }, []); // empty dependency array to run the effect only once

  return (
    <div
      ref={svgRef}
      id="network-graph-container"
      style={{ width: '100%', height: '100%', position: 'relative' }}
    >
      <ResponsiveNetwork
        data={data}
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        repulsivity={100}
        iterations={60}
        nodeColor={'#d3d3d3'}
        nodeBorderWidth={1}
        nodeBorderColor={{ from: 'color', modifiers: [['darker', 0.8]] }}
        linkThickness={3}
        linkColor={'#d3d3d3'}
        nodeSize={15}
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
    </div>
  );
};
