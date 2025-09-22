import { useEffect, useRef, useState } from "react";

function Loader({status}) {
    const Ref = useRef();
    const [letterStates, setLetterStates] = useState([]); // track states for each letter
    const letters = ["A", "Σ","E"]; // your logo letters
    const introRef = useRef();
    const timers = useRef([]);

    function Something() {
        // 1) show letters one by one
    letters.forEach((_, idx) => {
       timers.current.push( 
 setTimeout(() => {
        setLetterStates((prev) => {
          const newStates = [...prev];
          newStates[idx] = "active";
          return newStates;
        });
      }, (idx + 1) * 400));
    });
    
    // 2) fade letters one by one
    timers.current.push(setTimeout(() => {
      letters.forEach((_, idx) => {
           timers.current.push( setTimeout(() => {
          setLetterStates((prev) => {
            const newStates = [...prev];
            newStates[idx] = "fade";
            return newStates;
          });
        }, (idx + 1) * 50));
      });
    }, 2000));
    }
  useEffect(() => {
if(status){
    Something()
    timers.current.push(setInterval(Something,2200))
}
else{
if(letterStates.includes('active')){
    letters.forEach((_, idx) => {
              timers.current.push( 
                setTimeout(() => {
            setLetterStates((prev) => {
                const newStates = [...prev];
                newStates[idx] = "fade";
                return newStates;
            });
        }, (idx + 1) * 100));
    });
}      
timers.current.push( 
setTimeout(() => {
      if (introRef.current) introRef.current.style.top = "-100vh";
    }, 900));
}    
    return () => {
      timers.current.forEach((t) => clearTimeout(t));
      timers.current.forEach((t) => clearInterval(t));
      timers.current = [];
    };
  }, [status]);
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
export default Loader