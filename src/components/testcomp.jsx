import React from 'react'
import data from '../data/data.json'
import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const Testcomp = () => {
  const initialTopics = data
  const zoomTransformRef = useRef(d3.zoomIdentity);
  const svgRef = useRef();
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);

      useEffect(() => {
        const shuffled = [...initialTopics];
        let selectedTopics = [] 
        for(let i = 0; i < shuffled.length;){
          selectedTopics = [...selectedTopics,...shuffled.slice(i ,i + 10)]
          i = i + 4000
        }
        const initialNodes = selectedTopics.map((topic, index) => {
        const node = {
          id: `topic-${index}`,
          DisplayName: topic,
          name: topic,
          type: "main",
          config:{size:30},
          degree:1,
          expanded: false,
          parent: null,
          x: Math.random() * window.innerWidth * 10,
          y: Math.random() * window.innerHeight * 13
        }
      node.familytree = [node]; // ✅ now we can reference it
      return node  }
    )
        setNodes(initialNodes);
        setLinks([{source: "topic-0",
    target: "topic-1",
    type: "parent-child"},{source: "topic-1",
    target: "topic-4",
    type: "parent-child"},{source: "topic-1",
    target: "topic-3",
    type: "parent-child"},{source: "topic-1",
    target: "topic-2",
    type: "parent-child"},{source: "topic-3",
    target: "topic-6",
    type: "parent-child"},{source: "topic-3",
    target: "topic-5",
    type: "parent-child"}]);
      }, []);
      useEffect(()=>{
          if (nodes.length === 0) return;
            // Store zoom transform in a ref to persist it
            const svg = d3.select(svgRef.current);
            // Clear previous content
            svg.selectAll("*").remove();
            const container = svg.append("g").attr('class','container');
            
            const zoom = d3.zoom()
            .scaleExtent([0.05, 10])
            .on("zoom", (event) => {
              zoomTransformRef.current = event.transform; // Store current transform
              container.attr("transform", event.transform);
            });
            svg.call(zoom);
            svg.on("dblclick.zoom", null);
            console.log(links)
            console.log(nodes)
        container.attr("transform", zoomTransformRef.current);
        const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).distance(80).id((d)=>d.id))
        .force("repulse", d3.forceManyBody().strength(-120))
        .force("center", d3.forceCenter())


const link = container.append("g")
  .selectAll("line")
  .data(links)
  .join("line")
  .attr("class", "link")
  .attr("stroke", '#aaa')
  .style('stroke-width','3')
          // Create labels
          const labels = container
          .append("g")
          .selectAll("text")
          .data(nodes)
          .join("text")
          .text(d => d.DisplayName)
          .attr("text-anchor", "middle")
          .attr("stroke-width", 3)
          .attr(
            "font-size",
            d => d.config?.size / 2)
            .attr("font-weight", d => Math.floor(d.config?.size * 20))
            .attr("fill", "#374151")
            .attr("text-anchor", "middle")
            .style("z-index", "1")
            .attr('class','label')
            .style("cursor", "pointer")
            .style("user-select", "none")
          .call(
              d3
              .drag()
              .on("start", dragstarted)
              .on("drag", dragged)
              .on("end", dragended)
            )
          simulation.on("tick", () => {
              link
                .attr("x1", d => {
                  const sourceNode = nodes.find(n => n.id === d.source.id || n.id === d.source);
                  return sourceNode ? sourceNode.x : 0;
                })
                .attr("y1", d => {
                  const sourceNode = nodes.find(n => n.id === d.source.id || n.id === d.source);
                  return sourceNode ? sourceNode.y : 0;
                })
                .attr("x2", d => {
                  const targetNode = nodes.find(n => n.id === d.target.id || n.id === d.target);
                  return targetNode ? targetNode.x : 0;
                })
                .attr("y2", d => {
                  const targetNode = nodes.find(n => n.id === d.target.id || n.id === d.target);
                  return targetNode ? targetNode.y : 0;
                }).attr('stroke-width',d => {
                let source = nodes.find(n => n.id === d.source.id || n.id === d.source);
                return source.familytree.length - source.degree})
              ;
              
              // node
              //   .attr("cx", d => d.x)
              //   .attr("cy", d => d.y);
              // node.attr("transform", d => `translate(${d.x - d.width / 2}, ${d.y - d.height / 2})`);
        
              labels
                .attr("x", d => d.x)
                .attr("y", d => d.y);
});
            
              // Drag functions
            function dragstarted(event, d) {
              if (!event.active) simulation.alphaTarget(0.3).restart();
              d.fx = d.x;
              d.fy = d.y;
              const transform = d3.zoomTransform(svg.node());
              const zoomScale = transform.k;
              const baseFontSize = 14;
              const visibleFontSize = baseFontSize * zoomScale;
              if (visibleFontSize < 7) {
                event.on("drag", null); // Detach listener
                event.on("end", null);          // Disable drag end cleanup
              }
              d3.select(this).style("cursor", "grabbing")
            }
        
        
            function dragged(event, d) {
              d.fx = event.x;
              d.fy = event.y;
            }
            
            function dragended(event, d) {
              if (!event.active) simulation.alphaTarget(0);
              d.fx = null;
              d.fy = null;
              d3.select(this).style("cursor", "pointer");
            }
            return () => {
                simulation.stop();
            };
      },[nodes,links])
 return (
     <>
     <div className="w-full h-screen bg-white relative">
       <svg
         ref={svgRef}
         width="100%"
         height="100%"
         style={{ overflow: "visible" }}
         className="bg-white hover:cursor-grab active:cursor-grabbing"/>
     
(
         <div className="absolute top-4 right-4 bg-gray-100 px-4 py-2 rounded-lg shadow-md">
           <div className="flex items-center space-x-2">
             <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
             <span className="text-sm text-gray-600">Exploring topics...</span>
           </div>
          </div> 
       )
     </div>
       </>
   );
}

export default Testcomp