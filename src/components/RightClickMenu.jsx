import scrapeGoogle from "../Algo/scrap";
import { useNavigate } from 'react-router-dom';

export default function RightClickMenu({ x, y, visible, onOptionClick }) {
  let navigate = useNavigate()
  function handleclick(e){
    navigate(`/page?t=${onOptionClick[0].name}&r=${onOptionClick[0].DisplayName}`)
  }
  if (!visible) return null;
    const listStyle = {
      listStyleType: "none",
      margin: 0,
      padding: 0,
    };

  return (
    <div className={`
    bg-[#FAFAFA] border border-[#DEDEDE] rounded-[5px]
    z-[5] box-border text-[#333333] block 
    font-[300] font-[Cabin,Helvetica,Arial,sans-serif]
    text-[16px] leading-[24px]
    absolute h-[90px] w-fit
  `}// h 134
  style={{
    left: x,
    top: y,
    tabSize: 4,
    textSizeAdjust: '100%',
    fontFeatureSettings: 'normal'
  }} ><ul style={listStyle}>
      <li  className={`
    text-black text-left px-2.5 py-2.5
    list-none list-outside
    font-[300] font-[Cabin,Helvetica,Arial,sans-serif]
    text-[16px] leading-[24px]
    h-[44px] w-full
    unicode-bidi-isolate
  `}
  style={{
    fontFeatureSettings: 'normal',
    tabSize: 4,
    textSizeAdjust: '100%',
    backgroundColor: "rgb(4, 133, 203)",  color: "rgb(255, 255, 255)"}}>
        <span>{onOptionClick[0].DisplayName}</span></li>
        {/* <li  className={`
    text-black text-left px-2.5 py-2.5
    list-none list-outside
    font-[300] font-[Cabin,Helvetica,Arial,sans-serif]
    text-[16px] leading-[24px]
     cursor-pointer
    h-[44px] w-full
    unicode-bidi-isolate
  `}
  style={{
    fontFeatureSettings: 'normal',
    tabSize: 4,
    textSizeAdjust: '100%',
    backgroundColor: "rgb(161, 161, 161)"
  }}>
      <a href="#">Info</a>
      </li> */}
      <li onClick={handleclick} className={`
    text-black text-left px-2.5 py-2.5
    list-none list-outside
    font-[300] font-[Cabin,Helvetica,Arial,sans-serif]
    text-[16px] leading-[24px]
     cursor-pointer
    h-[44px] w-full
    unicode-bidi-isolate
  `}
  style={{
    fontFeatureSettings: 'normal',
    tabSize: 4,
    textSizeAdjust: '100%',
    backgroundColor: "rgb(255, 255, 255)"
  }} ><a >Deeper</a>
      </li>
      </ul>
      </div>
  )
};