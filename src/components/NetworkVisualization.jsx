import RightClickMenu from "./RightClickMenu";
import SearchBar from "./SearchBar";
import { Children, useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { GoogleGenAI } from "@google/genai";
import data from '../data/data.json'
export default function NetworkVisual({Searchdata,DirectionForward,searchparam,searchTrigger,setSearching,Searching,searchpass,dmode,setPrevsearchparam,prevsearchparam }) {
  const initialTopics = data
  const ai = new GoogleGenAI({ apiKey: process.env.REACT_APP_API_KEY });
  const zoomTransformRef = useRef(d3.zoomIdentity);
  const containerRef = useRef();
  const svgRef = useRef();
  let currzoom = useRef(d3.zoomIdentity)
  let zoomon = useRef(false)
  const [nodes, setNodes] = useState([]);
  const [x, setx] = useState();
  const [y, sety] = useState();
  const [menuvis, setmenuvis] = useState(false);
  const [menuoption, setmenuoption] = useState(false);
  const [links, setLinks] = useState([]);
  const initialnet = useRef({});
  const width = window.innerWidth;
  const height = window.innerHeight;
  const initialproccess = useRef(false);
  const [loading, setLoading] = useState(false);

  // fetching initial data 
  useEffect(() => {


    const fetchInitialNet = async () => {
      initialproccess.current = true 
      try {
        let text = `Give me the most 5-7 known related subtopics for all of these \"${nodes.map((value)=>value.name).join(' , ')}\" . Return the result strictly as JSON with this format:

{
  "TopicName": ["Subtopic1", "Subtopic2", "Subtopic3", ...],
  "AnotherTopic": ["Subtopic1", "Subtopic2", ...]
}

No explanations, no numbering, only valid JSON.`;
 
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.REACT_APP_OPENROUTER_API_KEY}`,
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
    const relatedTopics = JSON.parse(response.choices[0].message.content)
    initialnet.current = relatedTopics;
      } catch (error) {
        console.log('this is error')
        console.log(error);
      }finally{
        initialproccess.current = false

      } 
      };

       const start =async () => {
      if ((initialnet.current.length === 0 || initialnet.current.entries?.length == undefined) && nodes.length > 0 && initialproccess.current != true) {
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
      i = i + 10
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
  node.familytree = [node];
  return node  }
)
    setNodes(initialNodes);
    setLinks([]);
  }, []);

useEffect(() => {
  if(zoomon && containerRef.current){containerRef.current.interrupt('search-zoom')}
  if (nodes.length === 0) return;

  const svg = d3.select(svgRef.current);
  svg.selectAll("*").remove();

  const container = svg.append("g").attr("class", "container");
  containerRef.current = container

  const zoom = d3.zoom()
    .scaleExtent([0.12, 10])
    .on("zoom", (event) => {
      zoomTransformRef.current = event.transform;
      currzoom.current = event.transform;
      container.attr("transform", event.transform);
      setmenuvis(false);
      updateVisibleElements();
    });

    svg.call(zoom);
    svg.on("dblclick.zoom", null);
    container.attr("transform", zoomTransformRef.current);

  const nodeById = new Map(nodes.map(n => [n.id, n]));
  links.forEach(link => {
    link.source = typeof link.source === "string" ? nodeById.get(link.source) : link.source;
    link.target = typeof link.target === "string" ? nodeById.get(link.target) : link.target;
  });
  const simulation = d3.forceSimulation(nodes);
  if (!Searching) {
    simulation
      .force("link", d3.forceLink(links).distance(100).id(d => d.id))
      .force("repulse", d3.forceManyBody().strength(-120))
      .force("center", d3.forceCenter());
}

  function getVisibleNodes(nodes, width, height) {
    const transform = currzoom.current; 
    const topLeft = transform.invert([0, 0]);
    const bottomRight = transform.invert([width, height]);
    return nodes.filter(d => {
      const halfW = (d.labelWidth || 0) / 2;
      const halfH = (d.labelHeight || 14) / 2;
      const left = d.x - halfW;
      const right = d.x + halfW;
      const top = d.y - halfH;
      const bottom = d.y + halfH;

      return right >= topLeft[0] &&
        left <= bottomRight[0] &&
        bottom >= topLeft[1] &&
        top <= bottomRight[1];
    });
  }

  function updateVisibleElements() {
    if (searchparam.length > 1 && searchpass.current) {
      searchpass.current = false;
      let texts = simulation.nodes();
    // New search term
    if (prevsearchparam !== searchparam) {
        Searchdata.current = texts.filter(b =>
          b.DisplayName.toLowerCase().includes(searchparam.toLowerCase())
        );
    } else {
        // Rotate current list
          const d = Searchdata.current[DirectionForward.current ? 0 : Searchdata.current.length]; // Current focused node
          const existingIds = new Set(Searchdata.current.map(n => n.id));
          for (let i = 0; i < texts.length; i++) {
            const b = texts[i];
            const isMatch = b.DisplayName.toLowerCase().includes(searchparam.toLowerCase());
            const isNew = !existingIds.has(b.id);
            const isNotCurrent = b?.id !== d?.id;
            if (isMatch && isNew && isNotCurrent) {
              Searchdata.current.push(b);
            }
          }
    }
    if (Searchdata.current?.length > 0) {
      let tx, ty, k ;
      if(Object.keys(currzoom.current).length > 0 ){
          let {x:a, y:b, k:c} = currzoom.current
          tx = a
          ty = b
          k = c
        }
        else{let {x:a, y:b, k:c} = zoomTransformRef.current 
          tx = a
          ty = b
          k = c
      }
        const cx = (width / 2 - tx) / k;
        const cy = (height / 2 - ty) / k;
        const r = height / k;
        let currentTransform = [cx, cy, r];
        let d;
        if(DirectionForward.current ){
          d = Searchdata.current.shift();
          Searchdata.current.push(d);
        }else{
          console.log([...Searchdata.current])
          let last  = Searchdata.current.pop();
          d = Searchdata.current.pop();
          Searchdata.current.unshift(last);
          Searchdata.current.push(d);
        }
        setSearching(!Searching)
        const i = d3.interpolateZoom(currentTransform, [d.x, d.y, 300]);
        container.transition("search-zoom")
          .duration(2000)
          .tween("search-zoom", () => t => {
            currentTransform = i(t);
            const k = height / currentTransform[2];
            const tx = width / 2 - currentTransform[0] * k;
            const ty = height / 2 - currentTransform[1] * k;
            currzoom.current = d3.zoomIdentity.translate(tx, ty).scale(k);
            zoomon.current = true
            container.attr("transform", `translate(${tx}, ${ty}) scale(${k})`);
          })
         .on("end", () => {
          zoomon.current = false
          const [x, y, r] = i(1);
          const k = height / r;
          const tx = width / 2 - x * k;
          const ty = height / 2 - y * k;
          currzoom.current = d3.zoomIdentity.translate(tx, ty).scale(k);
          svg.call(zoom.transform, currzoom.current);
          setSearching(false)
          setPrevsearchparam(prevsearchparam)
        })
      } else {
        console.log('Not found');
      }
    }

    const transform = d3.zoomTransform(svg.node());

    const visibleNodes = getVisibleNodes(nodes, width, height);
    const visibleLinks = links.filter(
      l => visibleNodes.includes(l.source) || visibleNodes.includes(l.target)
    );
    const linkSelection = container.selectAll("line.link")
      .data(visibleLinks, d => `${d.source.id}-${d.target.id}`);

    linkSelection.enter()
      .append("line")
      .attr("class", "link")
      .attr("stroke", "#aaa")
      .merge(linkSelection)
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

    linkSelection.exit().remove();

    const labelSelection = container.selectAll("text.label")
      .data(visibleNodes, d => d.id);

    const labelEnter = labelSelection.enter()
      .append("text")
      .attr("class", "label")
      .text(d => d.DisplayName)
      .attr("fill", dmode ? "#374151" : "#FFF")
      .attr("text-anchor", "middle")
      .style("cursor", "pointer")
      .style("user-select", "none")
      .on("click", (event, d) => {
        event.stopPropagation();
        handleNodeClick(d);
      })
      .on("contextmenu", (event, d) => {
        event.preventDefault();
        setmenuvis(true);
        setmenuoption([d]);
        setx(event.x);
        sety(event.y);
      })
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    labelEnter.each(function(d) {
      const bbox = this.getBBox();
      d.labelWidth = bbox.width;
      d.labelHeight = bbox.height;
    });

    labelEnter.merge(labelSelection)
      .attr("x", d => d.x)
      .attr("y", d => d.y)
      .attr("font-size", d => d.config?.size / 2)
      .attr("font-weight", d => Math.floor(d.config?.size * 20));

    labelSelection.exit().remove();
  }

  simulation.on("tick", () => {
    if(zoomon.current){
      console.log('zoom on')
    }
    updateVisibleElements();
  });

  function dragstarted(event, d) {
    setmenuvis(false);
    setmenuoption({});
    setx(0);
    sety(0);
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
    const transform = d3.zoomTransform(svg.node());
    const zoomScale = transform.k;
    const baseFontSize = 15;
    const visibleFontSize = baseFontSize * zoomScale;
    if (visibleFontSize < 7) {
      zoomToLabel(d.x, d.y);
      event.on("drag", null);
      event.on("end", null);
      d3.select(this).style("cursor", "pointer");
      return;
    }
    d3.select(this).style("cursor", "grabbing");
  }

  function zoomToLabel(x, y) {
    const svg = d3.select(svgRef.current);
    const zoomAmount = 2;
    svg.transition()
      .duration(600)
      .call(
        zoom.transform,
        d3.zoomIdentity
          .translate(width / 2, height / 2)
          .scale(zoomAmount)
          .translate(-x, -y)
      );
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
  return () => simulation.stop();
}, [nodes, links, searchparam, searchTrigger, dmode]);


  const generateRelatedTopics = async (topic) => {
    let Ntopic = [...new Set(topic.name.split(' '))];
    console.log(initialnet.current)
    console.log(initialnet.current?.keys)
    if(initialnet.current != null){
      console.log(initialnet.current)
     console.log(topic.name)
    Object.hasOwn(initialnet.current,topic.name)
     const string = initialnet.current?.[topic.name]
     console.log(string)
     if(string){
        console.log('went with initials')
        let relatedTopics = string.filter((value)=> value != topic.DisplayName).slice(Math.random() * (string.length - 7),Math.floor(Math.random() * 3 + 4))       
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
        Authorization: `Bearer ${process.env.REACT_APP_OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",
        messages: [
          { role: "system", content: "" },
          { role: "user", content: `Give me the most 5-7 known related subtopics for "${Ntopic.map((value, index) => (index != 0 ? ('and ') : '') + value).join(' ')}" . Return only the topic names separated by commas, no explanations or numbering at all.` },
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
        console.log(relatedTopics)
        console.log(topic.DisplayName)
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
        className={`hover:cursor-grab active:cursor-grabbing ${dmode ? "bg-white":'bg-[#000814]'}`}/>
    
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