import {motion,AnimatePresence} from 'framer-motion'
import {ChevronDown} from 'lucide-react'
import  {useEffect, useRef, useState}  from 'react';
import { Link } from 'react-router-dom';

export default function SearchBar ({dmode,setdmode, setSearchTrigger, setSearchparam,searchpass ,Location}) {
  const [visible, setVisible] = useState(true);
  const [value, setValue] = useState();
  const inputRef = useRef(null);
  const handleSubmit= (e)=>{
    e.preventDefault(); // ❌ Prevent refresh
    setSearchparam(value)
    searchpass.current = true
    setSearchTrigger(prev => prev + 1)
  }
  useEffect(() => {
    // Focus the input once after mount
    inputRef.current?.focus();
  }, []);

  return (
    <div style={{
  pointerEvents: visible ? "auto" : "none"
}} className={`flex items-center justify-center h-16 w-full fixed left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center top-10 `}>

    <motion.div
        animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
        className='rounded-full'
          style={{
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            pointerEvents: visible ? "auto" : "none",
          }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
      >
        <div className="w-[90vw] max-w-md flex flex-row items-center justify-evenly px-8 h-12 bg-white/70 backdrop-blur rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.15)] space-x-8">
          <Link style={{fontFamily:'NeueRegrade'}} className="relative text-center text-sm font-medium transition-colors hover:text-gray-500 text-gray-700" to="/">Home</Link>
<form  onSubmit={handleSubmit}>
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
          {Location != '/' && <a className="relative text-center text-sm font-medium transition-colors hover:text-gray-700 text-gray-800/60" style={{fontFamily:'NeueRegrade'}} href='https://api.whatsapp.com/send?phone=01091244232' target='_blank'>Suggestions?</a>}
          {Location != '/about' && <Link className="relative text-center text-sm font-medium transition-colors hover:text-gray-500 text-gray-700" style={{fontFamily:'NeueRegrade'}} to="/about">About</Link>}
          </div>
        
      </motion.div>

      <motion.button
      style={{
  pointerEvents: "auto" 
}}
        onClick={() => setVisible(!visible)}
        animate={{ rotate: visible ? 0 : 180, y: visible ? 0 : -76 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className="mt-2"
      >
        <ChevronDown className="w-6 h-6 text-gray-600" />
      </motion.button>
    </div>
  );
};

