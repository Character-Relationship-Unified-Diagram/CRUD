import { useRef, useEffect } from 'react';
import { ResponsiveNetwork } from '@nivo/network';
import { useSelector } from 'react-redux';
import { useColorModeValue } from '@chakra-ui/react';
import * as d3 from 'd3';
import './NetworkGraph.css';

declare module '@nivo/network' {
  export interface InputLink {
    source: string;
    target: string;
    status?: string;
  }

  export interface InputNode {
    id: string;
    color: string;
  }
}

export const NetworkGraph = () => {
  const nodes = useSelector((state: any) => state.main.selectedMap.nodes);
  const links = useSelector((state: any) => state.main.selectedMap.links);
  // console.log(nodes, links)
  const svgRef = useRef(null);
  const lightGrid =
    'linear-gradient(rgba(0, 0, 0, 0.20) 0.1em,transparent 0.1em),linear-gradient(90deg, rgba(0, 0, 0, 0.20) 0.1em, transparent 0.1em)';
  const darkGrid =
    'linear-gradient(rgba(0, 0, 0, 0.35) 0.1em,transparent 0.1em),linear-gradient(90deg, rgba(0, 0, 0, 0.35) 0.1em, transparent 0.1em)';

  if (!nodes || !links) return null;
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
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        backgroundImage: useColorModeValue(lightGrid, darkGrid),
      }}
    >
      <ResponsiveNetwork
        data={data}
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        repulsivity={100}
        iterations={60}
        nodeColor={(n) => n.color}
        nodeBorderWidth={1}
        nodeBorderColor={{ from: 'color', modifiers: [['darker', 0.8]] }}
        linkThickness={3}
        linkColor={(n) =>
          n.data.status === 'negative'
            ? 'red'
            : n.data.status === 'positive'
              ? 'green'
              : '#d3d3d3'
        }
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
