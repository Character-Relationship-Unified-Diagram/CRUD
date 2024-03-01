import { useRef, useEffect } from 'react';
import { ResponsiveNetwork } from '@nivo/network';
import { useSelector } from 'react-redux';
import * as d3 from 'd3';
import { ZoomBehavior, ZoomedElementBaseType, zoomIdentity } from 'd3-zoom';

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
    // // Define the SVG element to apply the zoom behavior
    // const svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any> =
    //   d3.select(svgRef.current);

    // // Define the width and height of the SVG for zoom scaling limits
    // const width: number = +svg.attr('width');
    // const height: number = +svg.attr('height');

    // // Create a zoom handler
    // const zoomHandler: ZoomBehavior<Element, unknown> = d3
    //   .zoom<ZoomedElementBaseType, unknown>()
    //   .scaleExtent([1, 8]) // Set the scale extent to control zoom levels
    //   .on('zoom', (event) => {
    //     // This function defines what happens during the zoom event
    //     // For example, scaling and translating an SVG group (<g>)
    //     svg.selectAll('g').attr('transform', event.transform.toString());
    //   });
    // // Apply the zoom behavior to the SVG element
    // svg
    //   .call(zoomHandler)
    //   .call(zoomHandler.transform, zoomIdentity) // Optionally set an initial zoom state
    // const zoomHandler: d3.ZoomBehavior<Element, unknown> = d3.zoom().on('zoom', (event) => {
    //   svgElement.attr('transform', event.transform);
    // });
    // svgElement.call(zoomHandler);
    function zoomed(event: any) {
      console.log(event);
      svgElement.attr('transform', event.transform);
    }
    const zoom = d3.zoom().on('zoom', zoomed) as any;
    svgElement.call(zoom);
    return () => {
      svgElement.on('.zoom', null);
    };
  }, []); // empty dependency array to run the effect only once

  return (
    <div
      ref={svgRef}
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
