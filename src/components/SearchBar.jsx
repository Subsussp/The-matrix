import {motion,AnimatePresence} from 'framer-motion'
import {ChevronDown, ChevronLeft, ChevronRight} from 'lucide-react'
import  {useEffect, useRef, useState}  from 'react';
import { Link } from 'react-router-dom';
export default function SearchBar ({dmode,DirectionForward,Searchdata,setdmode,setSearching,searchparam,setPrevsearchparam, setSearchTrigger, setSearchparam,searchpass ,Location}) {
  const [visible, setVisible] = useState(true);
  const [secvisible, setsecVisible] = useState(true);
  const [value, setValue] = useState();
  const inputRef = useRef(null);
  
  const handleSubmit= (e,i)=>{
    e.preventDefault(); 
    DirectionForward.current = i
    setPrevsearchparam(searchparam);
    setSearchparam(value)
    searchpass.current = true
    setSearchTrigger(prev => prev + 1)
    setSearching(true)
  }
  useEffect(() => {
    // Focus the input once after mount
    sessionStorage.setItem("introShown", "false");
    inputRef.current?.focus();
  }, []);

  return (
    <div style={{
  pointerEvents: visible ? "auto" : "none"
}} className={`flex items-center justify-center h-16 w-full fixed left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center top-10 `}>

    <motion.div
        animate={{ y:Location == '/' ? (visible && secvisible) ? 0 :(!visible & secvisible) ? -60 : -149 :visible ? 0 : -149, opacity: secvisible ? 1 : 0 }}
        className='rounded-full'
          style={{
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            pointerEvents: visible || secvisible ? "auto" : "none",
          }}
        transition={{ duration: 1.0, ease: 'easeInOut' }}
      >

        <div className='flex flex-col items-center justify-evenly'>
  <motion.div
        animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
        className='rounded-full'
          style={{
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            pointerEvents: visible ? "auto" : "none",
          }}
        transition={{ duration: 1.0, ease: 'easeInOut' }}
      >
        <div className="w-[90vw] mt-10 max-w-md flex flex-row items-center justify-evenly px-8 h-12 bg-white/70 backdrop-blur rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.15)] space-x-8">
          <Link style={{fontFamily:'NeueRegrade'}} className="relative text-center text-sm font-medium transition-colors hover:text-gray-500 text-gray-700" to="/">Home</Link>
<form onSubmit={(e)=>handleSubmit(e,true)}>
        {Location == '/' ? <input ref={inputRef}
          className="text-center w-full hover:placeholder-gray-700 bg-transparent outline-none border-none text-gray-800 placeholder-gray-500 text-base placeholder:tracking-widest placeholder:text-lg placeholder:font-light"
          placeholder="Explore Topics"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          style={{
            fontFamily:
            'NeueRegrade,-apple-system, BlinkMacSystemFont, "Helvetica Neue", "Segoe UI", Roboto, sans-serif',
          }}
          />
          :  <></> }
         
          </form>
          {Location != '/' && <a className="relative text-center text-sm font-medium transition-colors hover:text-gray-700 text-gray-800/60" style={{fontFamily:'NeueRegrade'}} href='https://api.whatsapp.com/send?phone=201091244232' target='_blank'>Suggestions?</a>}
          {Location != '/about' && <Link className="relative text-center text-sm font-medium transition-colors hover:text-gray-500 text-gray-700" style={{fontFamily:'NeueRegrade'}} to="/about">About</Link>}
          </div>
          </motion.div>
{/* Mini search navigation bar */}
{Location == '/' &&
<div className="flex items-center justify-between mt-2 bg-white/60 backdrop-blur px-3 py-2 rounded-full shadow-md w-full max-w-md">
  {/* Prev button */}
  <button
    onClick={(e) => {
      if (Searchdata.current.length > 0) {
        handleSubmit(e, false)
      }
    }}
    className="p-2 rounded-full hover:bg-gray-200 transition shrink-0"
  >
    <ChevronLeft className="w-5 h-5 text-gray-700" />
  </button>

  {/* Labels */}
  <div className="flex items-center flex-1 justify-center space-x-2 overflow-hidden">
    <span className="text-gray-400 text-sm max-w-[6rem] truncate text-right">
      {Searchdata.current[Searchdata.current.length - 2]?.DisplayName}
    </span>

    <span className="font-semibold min-w-[6rem] text-gray-900 bg-gray-200 px-3 py-1 rounded-full text-sm max-w-[10rem] truncate">
      {Searchdata.current[Searchdata.current.length - 1]?.DisplayName}
    </span>

    <span className="text-gray-400 text-sm max-w-[6rem] truncate text-left">
      {Searchdata.current[0]?.DisplayName}
    </span>
  </div>

  {/* Next button */}
  <button
    onClick={(e) => {
      if (Searchdata.current.length > 0) {
        handleSubmit(e, true)
      }
    }}
    className="p-2 rounded-full hover:bg-gray-200 transition shrink-0"
  >
    <ChevronRight className="w-5 h-5 text-gray-700" />
  </button>
</div>}


          </div>
        
      </motion.div>

      <motion.button
      style={{
  pointerEvents: "auto" 
}}
        onClick={() => {
          if(Location == '/'){
          if(!visible & !secvisible){
          setVisible(true) 
          setsecVisible(true)
        }else if(!visible & secvisible){
          setsecVisible(false)
        }else{
          setVisible(!visible)
        }
          }else{
            setVisible(!visible)
          }
        }    
          }
        animate={{ rotate: visible ? 0 : Location == '/' ? (secvisible? 90: 180) : 180, y:Location == '/' ? ((visible && secvisible) ? 0 :(!visible & secvisible) ? -60 : -129) :visible ? 0: -90 }}
        transition={{ duration: 1.0, ease: 'easeInOut' }}
        className="mt-2"
      >
        <ChevronDown className="w-6 h-6 text-gray-600" />
      </motion.button>
    </div>
  );
};

