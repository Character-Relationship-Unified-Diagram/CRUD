import { useRef, useEffect, useState } from 'react';
import { ResponsiveNetwork } from '@nivo/network';
import { useDispatch, useSelector } from 'react-redux';
import { useColorModeValue } from '@chakra-ui/react';
import * as d3 from 'd3';
import './NetworkGraph.css';
import { LoadingOverlay } from '../LoadingOverlay';
import { formatAll } from '../../util/formatters';
import { Link, Node } from '../../../types/data';
import { setSelectedMapData } from '../../redux/mainSlice';

declare module '@nivo/network' {
  export interface InputLink {
    source: string;
    target: string;
    status?: string;
    distance: number;
  }

  export interface InputNode {
    id: string;
    color: string;
    size: number;
  }
}

export const NetworkGraph = () => {
  interface Data {
    nodes: Node[];
    links: Link[];
  }
  const selectedMap = useSelector((state: any) => state.main.selectedMap);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const data = useSelector((state: any) => state.main.selectedMapData);

  const svgRef = useRef(null);
  const lightGrid =
    'linear-gradient(rgba(0, 0, 0, 0.20) 0.1em,transparent 0.1em),linear-gradient(90deg, rgba(0, 0, 0, 0.20) 0.1em, transparent 0.1em)';
  const darkGrid =
    'linear-gradient(rgba(0, 0, 0, 0.35) 0.1em,transparent 0.1em),linear-gradient(90deg, rgba(0, 0, 0, 0.35) 0.1em, transparent 0.1em)';
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

  useEffect(() => {
    if (selectedMap) {
      setLoading(true);
      fetch('/maps/getMap', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mapID: selectedMap }),
      })
        .then((res) => res.json())
        .then((data) => {
          setLoading(false);
          const { nodes, links } = formatAll(data);
          // console.log(data, nodes, links);
          dispatch(setSelectedMapData({ nodes, links }));
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  }, [selectedMap]);

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
      {loading && <LoadingOverlay size="lg" />}
      <ResponsiveNetwork
        data={data}
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        activeNodeSize={(n) => n.size * 1.5}
        repulsivity={100}
        iterations={60}
        nodeColor={(n) => n.color}
        nodeBorderWidth={2}
        nodeBorderColor={{ from: 'color', modifiers: [['darker', 2.5]] }}
        linkDistance={(n) => n.distance}
        linkThickness={3}
        linkColor={(n) => {
          const status = n.data.status?.toLowerCase();
          if (
            status === 'negative' ||
            status === 'enemies' ||
            status === 'hostile'
          ) {
            return 'red';
          }
          if (
            status === 'positive' ||
            status === 'friends' ||
            status === 'allies'
          ) {
            return 'green';
          }
          return '#d3d3d3';
        }}
        nodeSize={(n) => n.size}
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
