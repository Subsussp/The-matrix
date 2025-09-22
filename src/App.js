import { Route, Routes, useLocation } from 'react-router-dom';
import NetworkVisual from './components/NetworkVisualization';
import SearchBar from './components/SearchBar';
import {Topicpage} from './components/Topicpage.jsx';
import { useEffect, useRef, useState } from 'react';
import Testcomp from './components/testcomp';
import Loader from './components/Waiting.jsx';

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




function About() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true); // trigger fade after component mounts
  }, []);

  return (
    <div
      className={`min-h-screen select-none text-white flex items-center justify-center px-6 py-12 transition-colors duration-1000 ${
        loaded ? "bg-black" : "bg-transparent"
      }`}
    >
      <div className={`max-w-3xl text-center `}> 
        <h1 className={`text-5xl font-[NeueRegrade] font-extrabold tracking-wide mb-4 transition-colors duration-1000 ${loaded ? "text-white " : "text-black"}`}>
          About This Project
        </h1>
        <div className="w-24 h-[2px] bg-white mx-auto mb-8 "></div>

        <p className={`text-xl font-[NeueRegrade] t leading-relaxed mb-6 ransition-colors duration-1000 ${loaded ? "text-gray-300 " : "text-black"}`}>
          When I first started building this, I knew it would become something special. 
          I created it as a way to{" "}
          <span className="text-white font-semibold font-[NeueRegrade]">
            Visualize topics that are linked to each other
          </span>{" "}
          and dig deeper — literally, to get to the bottom of things.
        </p>

        <p className={`text-xl leading-relaxed mb-6 font-[NeueRegrade] transition-colors duration-1000 ${loaded ? "text-gray-300 " : "text-black"}`}>
          With more efficient AI models and a stronger backend, this project could grow into 
          something massive, something that no one could fully control.
        </p>

        <p className={`text-xl leading-relaxed mb-6 font-[NeueRegrade] transition-colors duration-1000 ${loaded ? "text-gray-300 " : "text-black"}`}>
          I built it on my own — a one-person project.
        </p>

        <p className="text-xl text-gray-400 leading-relaxed italic">
          So if you have any suggestions or you have an idea message me and maybe you can add it yourself.
        </p>
      </div>
    </div>
  );
}




 const Idk = () => {
  return (
    <div>Idk</div>
  )
}

function Intro() {
  const Ref = useRef();
  const [letterStates, setLetterStates] = useState([]); // track states for each letter
  const letters = ["A", "Σ","E"]; // your logo letters
  const introRef = useRef();

  useEffect(() => {
    sessionStorage.setItem("introShown", "false");
    // 1) show letters one by one
    letters.forEach((_, idx) => {
      setTimeout(() => {
        setLetterStates((prev) => {
          const newStates = [...prev];
          newStates[idx] = "active";
          return newStates;
        });
      }, (idx + 1) * 400);
    });
    
    // 2) fade letters one by one
    setTimeout(() => {
      letters.forEach((_, idx) => {
        setTimeout(() => {
          setLetterStates((prev) => {
            const newStates = [...prev];
            newStates[idx] = "fade";
            return newStates;
          });
        }, (idx + 1) * 50);
      });
    }, 2000);
    
    // 3) hide intro screen
    setTimeout(() => {
      if (introRef.current) introRef.current.style.top = "-100vh";
    }, 2200);
  }, []);
  return (
    <div ref={introRef} className={`intro`}>
    <h1 className="absolute top-[45%] left-1/2 cancel -translate-x-1/2 -translate-y-1/2 text-[#000]" ref={Ref}>
    <span
    className={`letter ${
      letterStates[0] == "active"
      ? "active"
      : ""
      } ${letterStates[0] == "fade"? "fade" : ""}`}
      >
      A
      </span>
      <span
      className={`letter ${
        letterStates[1] == "active"
        ? "active"
        : ""
        } ${letterStates[1] == "fade" ?"fade" : ""}`}
        >
        Σ
        </span>
        <span
        className={`letter ${
            letterStates[2] == "active"
              ? "active"
              : ""
          } ${letterStates[2] == "fade" ?"fade" : ""}`}
        >
          E
        </span>
        <br />
      </h1>
    </div>
  );
}


function App() {
  let Searchdata = useRef([])
  let [prevsearchparam,setPrevsearchparam] = useState()
  const [searchparam, setSearchparam] = useState('');
  const [searchTrigger, setSearchTrigger] = useState(0);
  const [Searching, setSearching] = useState(false);
  const DirectionForward = useRef(true);
  const searchpass = useRef();
  const [dmode,setdmode] = useState(true);
  const Location = useLocation();
  console.log(sessionStorage.getItem("introShown") )
  console.log(sessionStorage.getItem("introShown") )
  useEffect(() => {
    sessionStorage.setItem("introShown", "true");
    }, []);
  useEffect(() => {
    document.getElementById('style1') &&  document.getElementById('style1').remove()
  }, [Location]);

  return (
    // <div>
    <>
      <div className={Location.pathname == '/' ? "block" : "hidden"}>
        <NetworkVisual Searchdata={Searchdata} DirectionForward={DirectionForward} Searching={Searching} prevsearchparam={prevsearchparam} setPrevsearchparam={setPrevsearchparam}  setSearching={setSearching} dmode={dmode} searchpass={searchpass} searchTrigger={searchTrigger} searchparam={searchparam}/>
      {/* <Testcomp/> */}
      </div>
    {!['/page'].includes(Location.pathname) && <SearchBar DirectionForward={DirectionForward} Searchdata={Searchdata} setPrevsearchparam={setPrevsearchparam} setSearching={setSearching} dmode={dmode} setdmode={setdmode} searchpass={searchpass} setSearchparam={setSearchparam} setSearchTrigger={setSearchTrigger} searchparam={searchparam} Location={Location.pathname}/>}
<Routes>
    <Route index element={sessionStorage.getItem("introShown") == "false" ? <></> : <Intro/>}/>
    <Route path='/page' element={<Topicpage/>}/>
    <Route path='/about' element={<About/>}/>
    <Route path='/Idk'  element={<Idk/>} />
  </Routes>
    </>
    // </div>
  );
} 


export default App;