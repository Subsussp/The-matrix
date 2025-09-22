import { ArrowBigUp } from "lucide-react";
import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Typewriter } from 'react-simple-typewriter'
import Loader from "./Waiting";

export const Topicpage = () => {
const [searchParams] = useSearchParams();
const [Data,setData] = useState([])
const hide = useRef(false)
const toggleHide = () => {
  hide.current = !hide.current;
};
  const topic = searchParams.get('t'); 
  const Rtopic = searchParams.get('r'); 
  useEffect(()=>{
    let o = new Set(topic.split(' '))
    let param = ''
    o.forEach((value)=>param = param + value + " " )
    console.log(param)
    console.log(Rtopic)
    console.log(process.env.REACT_APP_BACKEND)
    fetch(`${process.env.REACT_APP_BACKEND}/api/search/${param}/${Rtopic}`).then(async (res)=>{
      let jso = await res.json()
      console.log(jso)
      setData(jso)
    })
  },[])
if(Data.length < 1){
  return <Loader status={true}/>
}
  document.getElementById('style1') && document.getElementById('style1').remove()
const style = document.createElement("style");
style.id = 'style1'
    style.textContent =`
    @import url('https://fonts.googleapis.com/css2?family=Inconsolata:wght@200..900&family=Source+Code+Pro:ital,wght@0,200..900;1,200..900&display=swap');
    @import url('https://unpkg.com/marx-css/css/marx.min.css');
    @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css');
    @import url('https://fonts.googleapis.com/css2?family=Ubuntu+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap');

    * {
      font-family: 'Inconsolata', monospace;
      font-optical-sizing: auto;
      font-weight: 300;
      font-style: normal;
      font-variation-settings:
        "wdth" 100;
      background-color: var(--white);
    }
      
    #root{
      overflow-y: scroll ;
    }
    button:focus {
      outline: none;
      box-shadow: none;
    }
    strong {
      font-weight: 900 !important;
    }

    em {
      font-family: "Ubuntu Mono", monospace;
      font-style: italic;
    }

    .vlist:has(span:empty):not(:has(:not(span:empty))) {
      display: none !important;
    }

    .katex * {
      font-family: "Computer Modern Serif";
    }

    .y::marker {
      content: "• ";        /* replace the default disc with arrow */
      color: rgba(255, 255, 255, 0.8);  /* your bullet color */
    }

    .greek {
      font-family: 'Source Code Pro', monospace;
      font-optical-sizing: auto;
      font-weight: 400;
      font-style: normal;
    }

    h1 .greek {
      font-size: calc(var(--font-size-h1) - 3.5px);
    }

    h2 .greek {
      font-size: calc(var(--font-size-h2) - 2px);
    }

    /* On deskotp */
    #nav-desk {
      position:fixed;
      width:20vw;
      right: 4%;
      }

    #content {
    float:left;
      padding-top: 5vh;
      padding-bottom: 0;
      min-height: 93vh;
    }

    #nav-mob {
      display: none;
    }

    pre * {
      background-color: #1e1e2e;
    }

    .footer {
      position: relative;
      border-top: var(--border);
      padding: var(--md-pad) 0;
      text-align: center;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0;
      height: 7vh;
    }

    .searchResultsItems-mob,
    .search-results__items {
      margin-top: 1vh;
    }

    .searchResultsItems-mob li,
    .search-results__items li {
      padding-bottom: 1vh;
      margin-bottom: 1vh;
      border-bottom: solid 2px var(--black);
      list-style-type: none;
    }
    .subredd{
      color:#F1F3FF;
      }
    .footnote-definition-label {
      float: left;
      margin-right: 0.5em;
    }
      .logoD {
      text-align:center;
      }
    /* On mobile */
    @media screen and (max-width: 1134px) {
      #content {
        padding-top: 0;
        padding-bottom: 0;
      }

      #nav-desk {
        display: none;
      }

      #nav-mob {
        display: block;
      }
      #logo img {
        margin-left: 0;
        padding-left: 0;
        margin-right: 4vw;
      }

      #logo {
        width: 80vw;
        align-items: center;
        display: flex;}

      #nav-mob ul {
        padding-left: 5vw;
        display: flex;
        align-items: center;
      }

      .hide-mob {
        display: none;
      }

      #search-icon {
        margin-right: 5vw;
        margin-left: 3vw;
      }

      #search-mob {
        width: 60vw;
        margin: auto;
      }
    }
    #search{
          font-size: calc(.9rem);
    }
    /* Dark mode */
    @media (prefers-color-scheme: dark) {
      :root {
        --primary-400: #FAC35F;
        --primary: #F5B83B;
        --primary-600: #EBAF26;
        --accent: #FF8A63;
        --grey: #FAF9F7;
        --white: #000000;
        --black: #ffffff;

        --text: rgba(255, 255, 255, 0.8);
        --secondary: rgba(255, 255, 255, 0.54);
        --disabled: rgba(255, 255, 255, 0.38);
        --dividers: rgba(255, 255, 255, 0.12);
      }

      .invert {
        filter: invert(1);
      }
    }`
    document.head.appendChild(style);

return ( <>
<Loader status={false}/>
<Desknav Data={Data}/> <nav id="nav-mob">
    <ul>
      <li id="logo">
        {/* <img src="Logo.png" alt="logo" width="50" id="logo-mob"/> */}
        <h2>A<span className="greek">Σ</span>E</h2>
      </li>
      <li>
        <Link to="/">Home</Link>
      </li>
    </ul>
   <Searchcontainer />
  </nav>
<main className="section" id="content">
    <div className="container">
<h1 className="title">
  #{Rtopic}
</h1>
<h2 className="title" style={{'userSelect':'none'}}>
  Small brief
</h2>
<Typewriter          
className="title"
        words={[Data.SmallBrief]}
cursor
        cursorStyle="|"
        typeSpeed={40}
        deleteSpeed={50}
        delaySpeed={1000}/>
        <SimplefiedConcept text={Data.SimplefiedConcept}/>
           <ul className="tp-list">
        {Data.Links.Websites.map((res, i) => {
          const host = res.link;
          return (
            <li key={res.link || i} className="tp-card">
              <div className="tp-meta">
                {host && (
                  <img
                    className="tp-favicon"
                    src={`https://www.google.com/s2/favicons?domain=${host}`}
                    alt=""
                    width="16"
                    height="16"
                    loading="lazy"
                  />
                )}
                <span className="tp-domain">{host || "unknown"}</span>
              </div>
<br/>
              <a
                href={res.link}
                target="_blank"
                rel="noopener noreferrer"
                className="tp-link"
                title={res.title}
              >
                {res.title}
              </a>

              {res.snippet && <p className="tp-snippet">{res.snippet}</p>}

              <div className="tp-foot">
                <span className="tp-badge">
                  {res.source || "Web"}
                </span>
                <span className="tp-muted">
                  {res.date ? `Indexed: ${res.date}` : "Indexed: N/A"}
                </span>
                {typeof res.score !== "undefined" && (
                  <span className="tp-muted">Score: {res.score}</span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
<h2 style={{'userSelect':'none'}}>
<a className="title"                 target="_blank"
                rel="noopener noreferrer" href={`https://www.reddit.com/search/?q=${Data.config.Redditfinding ? topic : Rtopic}`}> Blog Posts </a>
</h2>
<ul style={{'padding':'0','margin':'0'}} >
  {[...Data.Links.Reddit] 
  .sort((a, b) => b.score - a.score) 
  .map((post)=>{
  return <React.Fragment key={post.url}><li>
      <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
    <a href={post.url} rel="noopener noreferrer" target="_blank">    
    <span className="subredd">r/{post.subreddit}</span>: {post.title}</a>
    
<div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
  <ArrowBigUp 
    size={16} 
    strokeWidth={2} 
    style={{ 
      color: "rgba(255,255,255,0.9)", 
      flexShrink: 0,
    }} 
  />   
  {post.score}
</div>

    </span>
     <span style={{ fontSize: "12px",width:'300px', color: "rgba(255,255,255,0.7)" }}>
    {post.created }
  </span>
    </li>
    <br/></React.Fragment>
})}
</ul>
    </div>
  </main>

  <div className="footer">
    <div>© 2025 Subsussp</div>
  </div>
  
</>

)
}

function SimplefiedConcept(text){
  const [open, setOpen] = useState(false);
  const [alreadyopen, setalreadyOpen] = useState(false);
  return <section >
      <div>
        <h2 className="title" style={{'userSelect':'none'}}>Simplefied Concept     
          <button
          onClick={() => setOpen((s) => !s)}
          aria-expanded={open}
          aria-controls="small-brief-panel"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "transparent",
            border: "none",
            padding: "6px 10px",
            cursor: "pointer",
            fontFamily: "Inconsolata, monospace",
            fontSize: 14,
            color: "rgba(255,255,255,0.9)",
            borderRadius: 6,
           outline: "none",        
          userSelect: "none",      
    WebkitTapHighlightColor: "transparent",
            transition: "background .15s ease",
          }}
  onFocus={(e) => (e.currentTarget.style.outline = "none")}
  onBlur={(e) => (e.currentTarget.style.outline = "none")}
        >
          <code
            style={{
              display: "inline-block",
              padding: "2px 6px",
              background: "rgba(0,0,0,0.25)",
              borderRadius: 4,
              fontWeight: 300,
              fontSize: 13,
              lineHeight: 1,
              transform: open ? "rotate(90deg)" : "rotate(0deg)",
              transition: "transform .18s ease",
            }}
          >
            ➜
          </code>
        </button></h2>
 
      </div>

      <div
        id="small-brief-panel"
        role="region"
        aria-hidden={!open}
        style={{
          maxHeight: open ? 400 : 0,
          overflow: "hidden",
          transition: "max-height .35s ease, opacity .25s ease",
          opacity: open ? 1 : 0,
        }}
      >
    {open && (
    <div
      style={{
        padding: "12px 14px",
        background: "rgba(255,255,255,0.02)",
        borderRadius: 8,
        fontFamily: "Inconsolata, monospace",
        fontSize: 16,
        lineHeight: "1.6",
      }}
    >
     {alreadyopen ? <p>{text.text}</p> : <Typewriter
        words={[text.text]}
        cursor
        cursorStyle="_"
        typeSpeed={70}
        delaySpeed={1000}
        onType={(e)=>console.log(this)}
        onLoopDone={() => setalreadyOpen(true)}
      />}
    </div>
  )}

      </div>
    </section>

}
const Desknav = ({Data})=>{

  let [search,setSearch] = useState('')
  let [data,setdata] = useState(Data.Links.Wiki.query.search)
  useEffect(()=>{
    sessionStorage.setItem("introShown", "false");
  },[])
  useEffect(()=>{
    console.log(Data.Links.Wiki.query.search)
    function htmlToText(html) {
  const temp = document.createElement("div");
  temp.innerHTML = html;
  return temp.textContent || temp.innerText || "";
}
    let data = Data.Links.Wiki.query.search.filter((value)=>value.title.toLowerCase().includes(search.toLowerCase()) || htmlToText(value.snippet.toLowerCase()).includes(search.toLowerCase()) )
    setdata(data)
  },[search])
  return  <nav id="nav-desk">
    <ul>
      <Link to={'/'}>
      <li className="logoD" >
        <img src="Logo.png" alt="logo" width="200"/>
        </li>
      </Link>
            <li>
        <div className="search-container">
          <input id="search" type="search" value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search by name or content..."/>

          <div className="search-results">
            <div className="search-results__items"></div>
          </div>
        </div>
      </li>
    <li>
    <h3 ><span>Wiki</span></h3>
    <ul style={{'padding':'0'}}>
      {data.map((link, index) => (
        <li className="y" key={index}>
          <a href={`https://en.wikipedia.org/?curid=${link.pageid}`} rel="noopener noreferrer" target="_blank" dangerouslySetInnerHTML={{ __html: link.title }} />
        </li>
      ))}
    </ul>
  </li>

    </ul>
  </nav>
}
const Searchcontainer = () => {
  return (
        <div id="search-mob">
      <div className="search-container">
        <input id="searchInput-mob" type="search" placeholder="Search..."/>

        <div className="searchResults-mob">
          <div className="searchResultsItems-mob"></div>
        </div>
      </div>
    </div>
  )
}
