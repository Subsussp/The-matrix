import RightClickMenu from "./RightClickMenu";
import SearchBar from "./SearchBar";
import { Children, useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { GoogleGenAI } from "@google/genai";
import data from '../data/data.json'
export default function NetworkVisual({searchparam,searchTrigger,searchpass,dmode }) {
  let Searchdata = useRef([])
  let [prevsearchparam,setPrevsearchparam] = useState('')
  const initialTopics = data
  const ai = new GoogleGenAI({ apiKey: process.env.REACT_APP_API_KEY });
  const zoomTransformRef = useRef(d3.zoomIdentity);
  const svgRef = useRef();
  const [nodes, setNodes] = useState([]);
  const [x, setx] = useState();
  const [y, sety] = useState();
  const [menuvis, setmenuvis] = useState(false);
  const [menuoption, setmenuoption] = useState(false);
  const [links, setLinks] = useState([]);
  const initialnet = useRef([]);
  const width = window.innerWidth;
  const height = window.innerHeight;
  const initialproccess = useRef(false);
  const [loading, setLoading] = useState(false);

  // fetching initial data 
  useEffect(() => {
    const fetchInitialNet = async () => {
      initialproccess.current = true 
      try {
        let text = `Give me the most 5-7 known related subtopics for all of these \"${nodes.map((value)=>value.name).join(' , ')}\" . Return only the topic names separated by commas, and the different topics names separated by '-' , no explanations or numbering and don't add the main topic name followed by :.`;
        // const response = await ai.models.generateContent({
        //   model: "gemini-2.0-flash-exp",
        //   contents: text,
        // });
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer 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", // 👈 Paste your OpenRouter key
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",
        messages: [
          { role: "system", content: "" },
          { role: "user", content: text },
        ],
      }),
    });

    const response = await res.json();
        console.log(response.choices[0].message.content)
        const relatedTopics = response.choices[0].message.content
         .split('\n')
        .map(topic => topic.trim())
        .filter(topic => topic.length > 1);
        initialnet.current = relatedTopics;
      } catch (error) {
        console.log('this is error')
        console.log(error);
      }finally{
        initialproccess.current = false

      } 
      };
      
       const start =async () => {
      if (initialnet.current.length === 0 && nodes.length > 0 && initialproccess.current != true) {
          await fetchInitialNet();
        }
       }
       start()
      }, [initialnet.current,nodes]);
      
  // handles right click (This right click is for the node data)
 

// const clearHoverPreview = ((d) => {
//   // 1. Clear temp state
  
//   // 2. Select and remove SVG elements related to the preview
//   const svg = d3.select(svgRef.current);
  
//   // Remove all hover-rendered groups (preview links + labels)
//   svg.selectAll(".hover-circle").remove();
//   svg.selectAll(".hover-link").remove();
//   svg.selectAll(".hover-label").remove();
//   setTempNodes([]);
//   setTempLinks([]);
// })

  useEffect(() => {
    const shuffled = [...initialTopics];
    let selectedTopics = [] 
    for(let i = 0; i < shuffled.length;){
      selectedTopics = [...selectedTopics,...shuffled.slice(i ,i + 10)]
      i = i + 60
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
    setLinks([]);
  }, []);

  useEffect(() => {
    if (nodes.length === 0) return;
    // Store zoom transform in a ref to persist it
    const svg = d3.select(svgRef.current);
    // Clear previous content
    svg.selectAll("*").remove();
    const container = svg.append("g").attr('class','container');
    
    const zoom = d3.zoom()
    .scaleExtent([0.12, 10])
    .on("zoom", (event) => {
      zoomTransformRef.current = event.transform; // Store current transform
      container.attr("transform", event.transform);
      setmenuvis(false)
      setmenuoption({})
      setx(0)
      sety(0)
      updateVisibleLabels()
    });
    svg.call(zoom);
    svg.on("dblclick.zoom", null);
    console.log(links)
    console.log(nodes)
// Create container for all elements
container.attr("transform", zoomTransformRef.current);
// Create force simulation
const simulation = d3.forceSimulation(nodes)
if(searchparam?.length < 1 ){
  simulation
  .force("link", d3.forceLink(links).distance(100).id((d)=>d.id))
  .force("repulse", d3.forceManyBody().strength(-120))
  .force("center", d3.forceCenter())
    }
  // Controls speed/smoothness
function updateVisibleLabels() {
  const transform = d3.zoomTransform(svg.node());

  // Size of the SVG (viewport)
  const viewWidth = width;
  const viewHeight = height;

  const topLeft = transform.invert([0, 0]);
  const bottomRight = transform.invert([viewWidth, viewHeight]);

 labels
    .attr("display", d => {
    const halfW = d.labelWidth / 2 || 0;
    const halfH = d.labelHeight / 2 || 0;

      const left   = d.x - halfW;
      const right  = d.x + halfW;
      const top    = d.y - halfH;
      const bottom = d.y + halfH;

      const isInView =
        right >= topLeft[0] &&
        left <= bottomRight[0] &&
        bottom >= topLeft[1] &&
        top <= bottomRight[1];
      return isInView ? 'block': 'none'; // 👈 this hides off-screen labels
    });
}

 // Create links
 const link = container.append("g")
  .selectAll("line")
  .data(links)
  .join("line")
  .attr("class", "link")
  .style("z-index", "1")
  .attr("stroke",'#aaa')
  .attr("stroke-width", (d=> {
  const source = typeof d.source === 'object' ? d.source : nodes.find(n => n.id === d.source);
  return (source?.familytree?.length || 1) - (source?.degree || 0);
}));
  
  // Create labels
  const labels = container
  .append("g")
  .selectAll("text")
  .data(nodes)
  .join("text")
  .text(d => d.DisplayName)
  .attr("text-anchor", "middle")
  .attr(
    "font-size",
    d => d.config?.size / 2)
    .attr("font-weight", d => Math.floor(d.config?.size * 20))
    .attr("fill", dmode ? "#374151" : "#FFF")
    .attr("text-anchor", "middle")
    .style("z-index", "1")
    .attr('class','label')
    .style("cursor", "pointer")
    .style("user-select", "none")
      .each(function (d) {
    const bbox = this.getBBox();
    d.width = bbox.width;
    d.height = bbox.height;
  })
  .call(
      d3
      .drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended)
    )
    .on("click", (event, d) => {
      event.stopPropagation();
      event.preventDefault(); 
      setmenuvis(false)
      link.attr("stroke-width", (d=> {
  const source = typeof d.source === 'object' ? d.source : nodes.find(n => n.id === d.source);
  return (source?.familytree?.length || 1) - (source?.degree || 0);
  
  }));
      handleNodeClick(d);
    })
  .on("contextmenu", (event, d) => {
    event.preventDefault(); // Prevent the browser context menu
    setmenuvis(true)
    setmenuoption([d])
    setx(event.x)
    sety(event.y)
  });

  // svg.on("mousemove", (event, d) => {
  //   let [mx,my] = d3.pointer(event)
  //   console.log(mx)
  //   console.log(my)
  // })

  let array = {}
  labels.attr('display','none')
  // Search Logic
  console.log(searchparam)
  console.log(searchpass.current)
  console.log(Searchdata)
    if(searchparam.length > 1 && searchpass.current){
      searchpass.current = false
      let texts = labels.nodes()
      let d = ''
      if(prevsearchparam === searchparam){
        if(Searchdata.current?.length > 0){
          d = Searchdata.current.shift()
          for (let i = 0; i < texts.length; i++) {
            let b = d3.select(texts[i]).datum()  
            if(b.DisplayName.toLowerCase().includes(searchparam.toLowerCase()) && !Searchdata.current.find((value)=>value.id == b.id)){
              Searchdata.current.push(b)
            }}
            Searchdata.current.push(d)  
        }}
        else{
          Searchdata.current = []        
          for (let i = 0; i < texts.length; i++) {
            d = d3.select(texts[i]).datum()
            if(searchparam.length > 0 && d.DisplayName.toLowerCase().includes(searchparam.toLowerCase()) && !Searchdata.current.find((value)=>value.id == d.id)){
              Searchdata.current.push(d)
            }
          }}
      if(Searchdata.current?.length > 0){
let { x: tx, y: ty, k } = d3.zoomTransform(svg.node());
// Compute the virtual camera center (in data coords)
const cx = (width / 2 - tx) / k;
const cy = (height / 2 - ty) / k;

// Compute the visible radius r used in interpolateZoom
const r = height / k;

// Now you can plug it into interpolateZoom
let currentTransform = [cx, cy, r];
  const d = Searchdata.current.shift();
  Searchdata.current.push(d);
const radius = 40.42058623404547; // Replace this with the correct radius for your nodes

  const i = d3.interpolateZoom(currentTransform, [d.x, d.y, 300 ]);

  svg.transition()
    .duration(5000)
    .tween("zoom", () => t => {
      currentTransform = i(t);
      const k = height / currentTransform[2];
      const tx = width / 2 - currentTransform[0] * k;
      const ty = height / 2 - currentTransform[1] * k;
      container  // or whatever group you're zooming
      .attr("transform", `translate(${tx}, ${ty}) scale(${k})`);
        const topLeft = [0, 0];
  const bottomRight = [width, height];

  const topLeftData = [
    (topLeft[0] - tx) / k,
    (topLeft[1] - ty) / k,
  ];
  const bottomRightData = [
    (bottomRight[0] - tx) / k,
    (bottomRight[1] - ty) / k,
  ];
  labels.attr("display", d => {
    const halfW = d.labelWidth / 2 || 0;
    const halfH = d.labelHeight / 2 || 0;

    const left   = d.x - halfW;
    const right  = d.x + halfW;
    const top    = d.y - halfH;
    const bottom = d.y + halfH;

    const isInView =
      right >= topLeftData[0] &&
      left <= bottomRightData[0] &&
      bottom >= topLeftData[1] &&
      top <= bottomRightData[1];

    return isInView ? 'block' : 'none';
  })
}
)
.on("end", () => {
    // ✅ Fix the zoom state so dragging doesn't reset
    const [x, y, r] = i(1); // final zoom values
    const k = height / r;
    const tx = width / 2 - x * k;
    const ty = height / 2 - y * k;
    svg.call(zoom.transform, d3.zoomIdentity.translate(tx, ty).scale(k));
  });
}else{
  console.log('Not found')
}
}

  function zoomToLabel(x, y) {
    const svg = d3.select(svgRef.current);  
    const zoomAmount = 2; 
  svg.transition()
    .duration(600)
    .call(
      zoom.transform,
      d3.zoomIdentity
        .translate(width / 2, height / 2) // center the screen
        .scale(zoomAmount)     
        .translate(-x, -y)               // shift scene so label appears centered
    );
}

    
    
// Update positions on simulation tick
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
      updateVisibleLabels()});
    
      // Drag functions
    function dragstarted(event, d) {
      setmenuvis(false)
      setmenuoption({})
      setx(0)
      sety(0)
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
      const transform = d3.zoomTransform(svg.node());
      const zoomScale = transform.k;
      const baseFontSize = 14;
      const visibleFontSize = baseFontSize * zoomScale;
      if (visibleFontSize < 7) {
        zoomToLabel(d.x,d.y)
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
    setPrevsearchparam(searchparam)
    // Cleanup function
    return () => {
      simulation.stop();
    };
    
  }, [nodes, links,searchTrigger,searchparam,dmode]);

  const generateRelatedTopics = async (topic) => {
    let Ntopic = [...new Set(topic.name.split(' '))];
   if(initialnet.current.length > 0 && initialnet.current != null){
     const string = initialnet.current.filter((topics)=>topics.toLowerCase().includes(`${topic.name.toLowerCase()}:`))[0]
     if(string){
        console.log('went with initials')
        let relatedTopics = string.substring(string.indexOf(`${topic.name}:`) + topic.name.length + 2).split(',').filter((value)=> value != topic.DisplayName).slice(0,Math.floor(Math.random() * 3 + 4))       
        return relatedTopics;
      }
      console.log('ignored the initials')
    }
    console.log('ignored the initials')
    try {
      setLoading(true);
      // const response = await ai.models.generateContent({
      //   model: "gemini-2.0-flash-exp",
      //   contents: `Give me the most 5-7 known related subtopics for "${Ntopic.map((value, index) => (index != 0 ? ('and ') : '') + value).join(' ')}" . Return only the topic names separated by commas, no explanations or numbering.`,
      // });
        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer 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", // 👈 Paste your OpenRouter key
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",
        messages: [
          { role: "system", content: "" },
          { role: "user", content: `Give me the most 5-7 known related subtopics for "${Ntopic.map((value, index) => (index != 0 ? ('and ') : '') + value).join(' ')}" . Return only the topic names separated by commas, no explanations or numbering.` },
        ],
      }),
    });
    const response = await res.json();
      // const relatedTopics = response.text
      const relatedTopics = response.choices[0].message.content
        .split(',')
        .map(Atopic => Atopic.trim())
        .filter(Atopic => Atopic.length > 1 && Atopic != topic.DisplayName)
        .slice(0, 6);
        return relatedTopics;
    } catch (error) {
      console.error('Error generating topics:', error);
      return [`${topic.name} Basics`, `${topic.name} Advanced`, `${topic.name} History`];
    } finally {
      setLoading(false);
    }
  };

  const handleNodeClick = async (clickedNode) => {
    if (clickedNode.expanded || loading || clickedNode.processing) return;
    // Set processing flag
    clickedNode.processing = true;

  const relatedTopics = await generateRelatedTopics(clickedNode);

  let newNodes = relatedTopics.map((topic, index) => ({
    id: `${clickedNode.id}-sub-${index}`,
    DisplayName: topic,
    name: `${clickedNode.name} ${topic}`,
    type: 'sub',
    parent: clickedNode.id,
    degree: (clickedNode.familytree.length + 1),
    config:{size:clickedNode.config.size - 3},
    expanded: false,
    x: clickedNode.x + (Math.random() - 0.5) * 200,
    y: clickedNode.y + (Math.random() - 0.5) * 200,
    }));
    clickedNode.childrens = newNodes
    const newLinks = newNodes.map(node => ({
      source: clickedNode.id,
      target: node.id,
      type: 'parent-child'
    }));
    let ids = clickedNode.familytree.map((node)=>node.id)
    newNodes = newNodes.map((node,index)=> {
      return {...node,familytree: [...clickedNode.familytree,node]
}})
    setNodes(prevNodes => [
      ...prevNodes.map(node =>{
        if(node.id === clickedNode.id)  {
          return { ...node,expanded: true }} 
        else if(node.id === clickedNode.parent){
          return {...node,childrens:[...node.childrens.filter((d)=>d.id !=clickedNode.id),clickedNode]}
        }else{
          return node
        }
      }
      ).map((node)=>{
      if(ids.includes(node.id)){
        return {...node,familytree:[...clickedNode.familytree,node]}
      }
      return node
      }),
      ...newNodes
    ]);
      setLinks(prevLinks => [
      ...prevLinks.map((d)=>{
        return {...d,source:d.source.id,target:d.target.id}}),
			...newLinks
		]);
  };
  
  // const handleNodeHover = async (HoverdNode) => {
  //   if (HoverdNode.expanded || loading || tempNodes.length > 0) return;
  //   const relatedTopics = await generateRelatedTopics(HoverdNode);
  //   const newNodes = relatedTopics.map((topic, index) => ({
  //     id: `${HoverdNode.id}-sub-${index}`,
  //     DisplayName: topic,
  //     name: `${HoverdNode.name} ${topic}`,
  //     type: 'sub',
  //     isHovernode:true,
  //     parent: HoverdNode.id,
  //     config:{size:HoverdNode.config.size - 3},
  //     expanded: false,
  //     x: HoverdNode.x + (Math.random() - 0.5) * 200,
  //     y: HoverdNode.y + (Math.random() - 0.5) * 200,
  //   }));

  //   const newLinks = newNodes.map(node => ({
  //     source: HoverdNode.id,
  //     target: node.id,
  //     type: 'parent-child'
  //   }));
  //   setTempNodes(newNodes);
  //   setTempLinks(newLinks);
  // };
  
  // Create elegant connection network
 if(nodes.length < 1){
  return <div className="absolute top-4 right-4 bg-gray-100 px-4 py-2 rounded-lg shadow-md">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
            <span className="text-sm text-gray-600">Exploring topics...</span>
          </div>
         </div> 
 }
  return (
    <>
    <RightClickMenu x={x} y={y} visible={menuvis} onOptionClick={menuoption} />
    <div className='w-full h-screen relative'>
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        style={{ overflow: "visible" }}
        className={`bg-white hover:cursor-grab active:cursor-grabbing ${dmode ? "bg-white":'bg-[#000814]'}`}/>
    
      {loading && (
        <div className="absolute top-4 right-4 bg-gray-100 px-4 py-2 rounded-lg shadow-md">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
            <span className="text-sm text-gray-600">Exploring topics...</span>
          </div>
         </div> 
      )}
    </div>
      </>
  );
};