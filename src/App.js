import { Route, Routes, useLocation } from 'react-router-dom';
import NetworkVisual from './components/NetworkVisualization';
import SearchBar from './components/SearchBar';
import React, { useRef, useState } from 'react';
import Testcomp from './components/testcomp';

// const NetworkVisualization = () => {
//   const ai = new GoogleGenAI({ apiKey: "AIzaSyAnzX5YcIF-SRBw0_TgDpnO1cT_iWyVEO8" });
//     // Initial abstract topics
//     const initialTopics = [
//       "Sport", "Food", "Music", "Technology", "Art", "Science",
//       "Travel", "Health", "Education", "Nature"
//     ];
//   const svgRef = useRef();
//   const [nodes, setNodes] = useState([]);
//   const [links, setLinks] = useState([]);
//   const [initialnet, setinitialnet] = useState([]);
//   const [loading, setLoading] = useState(false);
//   useEffect(() => {
//   const fetchInitialNet = async () => {
//     try {
//       let text = `Give me the most 5-7 known related subtopics for all of these "Sport, Food, Music, Technology, Art, Science,
//       Travel, Health, Education, Nature" . Return only the topic names separated by commas, and the different topics names separated by '-' , no explanations or numbering.`;

//       const response = await ai.models.generateContent({
//         model: "gemini-2.0-flash-exp",
//         contents: text,
//       });

//       const relatedTopics = response.text
//         .split('-')
//         .map(topic => topic.trim())
//         .filter(topic => topic.length > 0);

//       setinitialnet(relatedTopics);
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setLoading(false);
//     }

//   };

//   if (initialnet.length === 0) {
//     fetchInitialNet();
//   }
// }, []); // ← Only runs on mount

//   // Generate related topics using Gemini AI
//   const generateRelatedTopics = async (topic) => {
//     let Ntopic = [...new Set(topic.name.split(' '))]
//     try {
//       // setLoading(true);
//       const response = await ai.models.generateContent({
//         model: "gemini-2.0-flash-exp",
//         contents: `Give me the most 5-7 known related subtopics for "${Ntopic.map((value,index)=> (index !=0 ? ('and ') : '') + value ).join(' ')}" . Return only the topic names separated by commas, no explanations or numbering.`,
//       });

//       const relatedTopics = response.text
//         .split(',')
//         .map(topic => topic.trim())
//         .filter(topic => topic.length > 0)
//         .slice(0, 6); // Limit to 6 topics
//       return relatedTopics;
//     } catch (error) {
//       console.error('Error generating topics:', error);
//       // Fallback topics if API fails
//       return [`${topic} Basics`, `${topic} Advanced`, `${topic} History`];
//     } finally {
//       // setLoading(false);
//     }
//   };

//   // Initialize with random selection of topics


//   // Handle node click to expand topics
//   const handleNodeClick = async (clickedNode) => {
//     if (clickedNode.expanded || loading) return;
//     let relatedTopics = []
//     console.log(initialnet.length > 0);
//     if(initialnet.length > 0){
//       let idk = initialnet.filter((topic) => {topic.includes(topic)});
//       console.log(idk);
//       relatedTopics = initialnet[initialnet.indexOf(clickedNode.name)];
//     }
//     relatedTopics = await generateRelatedTopics(clickedNode);
//     console.log(relatedTopics)
//     // Create new nodes for related topics
//     const newNodes = relatedTopics.map((topic, index) => ({
// 			id: `${clickedNode.id}-sub-${index}`,
// 			DisplayName: topic,
// 			name: clickedNode.name + " " + topic,
// 			type: "sub",
// 			parent: clickedNode.id,
// 			expanded: false,
// 			x: clickedNode.x + (Math.random() - 0.5) * 200,
// 			y: clickedNode.y + (Math.random() - 0.5) * 200
// 		}));
    
//     // Create links from parent to children
//     const newLinks = newNodes.map(node => ({
//       source: clickedNode.id,
//       target: node.id,
//       type: 'parent-child'
//     }));
    
//     // Update state
//     setNodes(prevNodes => [
//       ...prevNodes.map(node =>
//         node.id === clickedNode.id ? { ...node, expanded: true } : node
//       ),
//       ...newNodes
//     ]);

//     setLinks(prevLinks => [...prevLinks, ...newLinks]);
//   };

//   // D3 visualization effect
  
//     if (false) {
//       return <div>Loading...</div>;
//     }
//     else{
//   return (
//     <div className="w-full h-screen bg-white relative">
//       <svg
//         ref={svgRef}
//         width="100%"
//         height="100%"
//         style={{ overflow: "visible" }}
//         className="bg-white"
//       />

//       {/* Loading indicator */}
//       {loading && (
//         <div className="absolute top-4 right-4 bg-gray-100 px-4 py-2 rounded-lg shadow-md">
//           <div className="flex items-center space-x-2">
//             <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
//             <span className="text-sm text-gray-600">Exploring topics...</span>
//           </div>
//         </div>
//       )}
//       </div>

//       // {/* Instructions */}
//       // {/* <div className="absolute top-4 left-4 bg-white bg-opacity-90 p-4 rounded-lg shadow-md max-w-sm">
//         // <h3 className="font-bold text-gray-800 mb-2">Explore Knowledge</h3>
//         // <p className="text-sm text-gray-600">
//           // {/* Click on any topic to discover related subtopics. Drag nodes to rearrange them in your space. */}
//         // {/* </p> */}
//       // </div> */}
//   );
// };}



// const NetworkVisual = () => {
//   const initialTopics = [
//     "Sport", "Food", "Music", "Technology", "Art", "Science",
//     "Travel", "Health", "Education", "Nature"
//   ];
  
//   const ai = new GoogleGenAI({ apiKey: "AIzaSyAnzX5YcIF-SRBw0_TgDpnO1cT_iWyVEO8" });
//   const svgRef = useRef();
//   const [nodes, setNodes] = useState([]);
//   const [links, setLinks] = useState([]);
//   const [initialnet, setinitialnet] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const shuffled = [...initialTopics].sort(() => 0.5 - Math.random());
//     const selectedTopics = shuffled.slice(0, 6);

//     const initialNodes = selectedTopics.map((topic, index) => ({
// 			id: `topic-${index}`,
// 			DisplayName: topic,
// 			name: topic,
// 			type: "main",
// 			expanded: false,
//       parent: null
// 		}));
//     console.log(initialNodes)
//     setNodes(initialNodes);
//     setLinks([]);
//   }, []);

//   // useEffect(() => {
//   //   const fetchInitialNet = async () => {
//   //     try {
//   //       let text = `Give me the most 5-7 known related subtopics for all of these \"Sport, Food, Music, Technology, Art, Science,
//   //       Travel, Health, Education, Nature\" . Return only the topic names separated by commas, and the different topics names separated by '-' , no explanations or numbering.`;

//   //       const response = await ai.models.generateContent({
//   //         model: "gemini-2.0-flash-exp",
//   //         contents: text,
//   //       });

//   //       const relatedTopics = response.text
//   //         .split('-')
//   //         .map(topic => topic.trim())
//   //         .filter(topic => topic.length > 0);
//   //       setinitialnet(relatedTopics);
//   //     } catch (error) {
//   //       console.log(error);
//   //     } finally {
//     //       setLoading(false);
//     //     }
//     //   };
    
//     //   if (initialnet.length === 0) {
//       //     fetchInitialNet();
//       //   }
//       // }, [initialnet]);
      
      
//   useEffect(()=>{
//     if (nodes.length === 0) return;
//     const svg = d3.select(svgRef.current);
//     const width = window.innerWidth;
//     const height = window.innerHeight;
    
//     // Create force simulation

//     const simulation = d3.forceSimulation(nodes)
//         .force("link", d3.forceLink(links).id(d => d.id).distance(100).strength(0.3))
//         // .force("charge", d3.forceManyBody().strength(-100))
//         .force("center", d3.forceCenter(width / 2, height / 2))
//         .force("collision", d3.forceCollide().radius(80));
        
        
//     // Clear previous content
//     svg.selectAll("*").remove();

//     // const zoom = d3.zoom()
//     // .on("zoom", (event) => {
//     //   const { x, k } = event.transform
//     //   console.log(event.transform)
//     //   svg.attr("transform", `translate(${x}, 0) scale(${k}, 1)`)
//     // });
//     // svg.call(zoom)

//     // Create links
//     const link = svg.append("g")
//     .selectAll("line")
//     .data(links)
//     .join("line")
//     .attr("stroke", "#D1D5DB")
//     .attr("stroke-opacity", 0.6)
//     .attr("stroke-width", 2);
    
//     // Create nodes
//     const node = svg.append("g")
//     .selectAll("circle")
//     .data(nodes)
//     .join("circle")
//     .attr("r", d => d.type === 'main' ? 30 : 20)
//     .attr("fill", d => d.type === 'main' ? "#374151" : "#6B7280")
//     .attr("class", "circle")
//     .attr("stroke", d => d.type === 'main' ? "#374151" : "#6B7280")
//     .attr("stroke-width", d => d.type === 'main' ? 3 : 2)
//     .style("cursor", "pointer")
//     .call(d3.drag()
//     .on("start", dragstarted)
//     .on("drag", dragged)
//     .on("end", dragended))
//     .on("click", (event, d) => {
//       event.stopPropagation();
//       handleNodeClick(d,links);
//     });
//     // Create labels
//     const labels = svg.append("g")
//     .selectAll("text")
//     .data(nodes)
//     .join("text")
//     .text(d => d.DisplayName)
//     .attr("font-size", d => d.type === 'main' ? 14 : 12)
//     .attr("font-weight", d => d.type === 'main' ? "bold" : "normal")
//     .attr("fill", "#374151")
//     .attr("text-anchor", "middle")
//     .attr("dy", d => d.type === 'main' ? 45 : 35)
//     .style("cursor", "pointer")
//     .style("user-select", "none")
//     .style("font-family", "system-ui, -apple-system, sans-serif")
//     .call(d3.drag()
//     .on("start", dragstarted)
//     .on("drag", dragged)
//     .on("end", dragended))
//     .on("click", (event, d) => {
//       event.stopPropagation();
//       handleNodeClick(d,links);
//     });
//     // Add hover effects
//     // node
//     // .on("mouseover", function (event, d) {
//     //   d3.select(this)
//     //   .attr("stroke", "#1F2937")
//     //   .attr("stroke-width", d.type === 'main' ? 4 : 3);
//     // })
//     // .on("mouseout", function (event, d) {
//     //   d3.select(this)
//     //   .attr("stroke", d.type === 'main' ? "#374151" : "#6B7280")
//     //   .attr("stroke-width", d.type === 'main' ? 3 : 2);
//     // });
    
//     // Update positions on simulation tick
//     simulation.on("tick", () => {
//       link
//       .attr("x1", d => d.source.x)
//       .attr("y1", d => d.source.y)
//       .attr("x2", d => d.target.x)
//       .attr("y2", d => d.target.y);
      
//       node
//       .attr("cx", d => d.x)
//       .attr("cy", d => d.y);
      
//       labels
//       .attr("x", d => d.x)
//       .attr("y", d => d.y);
//     });
    
//     // Drag functions
//     function dragstarted(event, d) {
//       if (!event.active) simulation.alphaTarget(0.3).restart(); // keep simulation going
//       d.fx = d.x;  // lock x
//       d.fy = d.y;  // lock y
//       d3.select(this).style("cursor", "grabbing");
//     }
    
//     function dragged(event, d) {
//       d.fx = event.x;
//       d.fy = event.y;
//     }
    
//     function dragended(event, d) {
//       if (!event.active) simulation.alphaTarget(0);
//        d.fx = null;
//       d.fy = null;
//       d3.select(this).style("cursor", "pointer");
//     }
    
//     // Cleanup function
//     return () => {
//       simulation.stop();
//     };
    
//   }, [nodes, links]);
  
//   useEffect(() => {
//     if(nodes.length === 0 & links.length === 0) return;
//     const simulation = d3.forceSimulation(nodes)
//       .force("link", d3.forceLink(links).id(d => d.id).distance(1).strength(0.1))
//       .force("charge", d3.forceManyBody().strength(-0.5))
//       .force("center", d3.forceCenter(0, 0))
//       .force("collision", d3.forceCollide().radius(0.4))
//       .on("tick", () => {
//         setNodes([...simulation.nodes()]);
//       });
//     return () => simulation.stop();
//   }, [nodes.length, links.length]);

//       const generateRelatedTopics = async (topic) => {
//         let Ntopic = [...new Set(topic.name.split(' '))]
//     try {
//       // setLoading(true);
//       const response = await ai.models.generateContent({
//         model: "gemini-2.0-flash-exp",
//         contents: `Give me the most 5-7 known related subtopics for "${Ntopic.map((value,index)=> (index !=0 ? ('and ') : '') + value ).join(' ')}" . Return only the topic names separated by commas, no explanations or numbering.`,
//       });

//       const relatedTopics = response.text
//         .split(',')
//         .map(topic => topic.trim())
//         .filter(topic => topic.length > 0)
//         .slice(0, 6); // Limit to 6 topics
//       return relatedTopics;
//     } catch (error) {
//       console.error('Error generating topics:', error);
//       // Fallback topics if API fails
//       return [`${topic} Basics`, `${topic} Advanced`, `${topic} History`];
//     } finally {
//       // setLoading(false);
//     }
//   };


//   const handleNodeClick = async (clickedNode) => {
//     if (clickedNode.expanded || loading) return;

//     let relatedTopics = [];

//     // if (initialnet.length > 0) {
//     //   relatedTopics = initialnet.filter(topic =>
//     //     topic.toLowerCase().includes(clickedNode.name.toLowerCase())
//     //   );
//       // if (relatedTopics.length === 0) {
//       //   relatedTopics = await generateRelatedTopics(clickedNode);
//       // }
//     // } else
//      {
//       relatedTopics = await generateRelatedTopics(clickedNode);
//     }

//     const newNodes = relatedTopics.map((topic, index) => ({
//       id: `${clickedNode.id}-sub-${index}`,
//       DisplayName: topic,
//       name: `${clickedNode.name} ${topic}`,
//       type: 'sub',
//       parent: clickedNode.id,
//       expanded: false,
//       x: clickedNode.x + (Math.random() - 0.5) * 2,
//       y: clickedNode.y + (Math.random() - 0.5) * 2,
//     }));

//     const newLinks = newNodes.map(node => ({
//       source: clickedNode.id,
//       target: node.id,
//       type: 'parent-child'
//     }));

//     setNodes(prevNodes => [
//       ...prevNodes.map(node =>
//         node.id === clickedNode.id ? { ...node, expanded: true } : node
//       ),
//       ...newNodes
//     ]);

//     setLinks(prevLinks => [...prevLinks, ...newLinks]);
//   };


//   return (
//       <svg
//         ref={svgRef}
//         width="100%"
//         height="100%"
//         style={{ overflow: "visible" }}
//         className="bg-white"
//       />
//   );
// };




 const About = () => {
  return (
    <div>About</div>
  )
}


 const Idk = () => {
  return (
    <div>Idk</div>
  )
}
function App() {
  const [searchparam, setSearchparam] = useState('');
  const [searchTrigger, setSearchTrigger] = useState(0);
  const searchpass = useRef();
  const [dmode,setdmode] = useState(true);
  const Location = useLocation();
  return (
    // <div>
    <>
      <div className={Location.pathname == '/' ? "block" : "hidden"}>
        <NetworkVisual dmode={dmode} searchpass={searchpass} searchTrigger={searchTrigger} searchparam={searchparam}/>
      {/* <Testcomp/> */}
      </div>
    <SearchBar dmode={dmode} setdmode={setdmode} searchpass={searchpass} setSearchparam={setSearchparam} setSearchTrigger={setSearchTrigger} searchparam={searchparam} Location={Location.pathname}/>
<Routes>
    <Route index element={<></>}/>
    <Route path='/about' element={<About/>}/>
    <Route path='/Idk'  element={<Idk/>} />
  </Routes>
    </>
    // </div>
  );
} 


export default App;