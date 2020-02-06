import React, {useState, useEffect, useRef} from 'react';

const getStyle = () => ({
  userSelect: "none",
  cursor: 'ew-resize',
  width: '6px',
  width: 'rgba(0, 0, 0, 0.1)',
});

function ColumnResizer({index, refs, setRefs}) {
  const resizer = useRef();

  const [state, setState] = useState({
    startPos: 0,
    startWidthPrev: 0,
    startWidthNext: 0,
  });

  const startDrag = (e) => {
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', function() {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', this)
    });

    const startPos = e.touches ? e.touches[0].screenX : e.screenX;
    setState(prev => ({
      ...prev,
      startPos: startPos,
      startWidthPrev: 0,
      startWidthNext: 0,
    }));
    
    const currentElem = resizer.current;

    if (currentElem) {
      if (currentElem.previousSibling) {
        setState(prev => ({
          ...prev,
          startWidthPrev: currentElem.previousSibling.clientWidth,
        }));
      }
  
      if (currentElem.nextSibling) {
        setState(prev => ({
          ...prev,
          startWidthNext: currentElem.nextSibling.clientWidth,
        }));
      }
    }
  }

  const onMouseMove = (e) => {
    const mouseX = e.touches ? e.touches[0].screenX : e.screenX;
    const moveDiff = state.startPos - mouseX;
    
    const newPrev = state.startWidthPrev - moveDiff;
    const currentElem = resizer.current;

    if(newPrev < parseInt(currentElem.previousSibling.style.minWidth)||
      newPrev > parseInt(currentElem.previousSibling.style.maxWidth)) {
      return;
    }

    refs[index].forEach(ref => {
      ref.previousSibling.style.width = newPrev + 'px';
    });
  }

  useEffect(() => {
    setRefs(prev => (
      prev.map((refList, refIndex) => (
        refIndex===index ? [...refList, resizer.current] : [...refList]
      ))
    ))
  }, []);

  return (
    <td
      ref={resizer}
      style={getStyle()}
      onMouseDown={startDrag}
      onTouchStart={startDrag} 
    />
  )
}

export default ColumnResizer;
