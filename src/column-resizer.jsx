//Author: Nik M
//https://github.com/nik-m2/react-column-resizer
//Modified by: Saahil H
//https://github.com/saahilh/react-column-resizer

import React, {useEffect, useRef} from 'react';

const getStyle = () => ({
  userSelect: "none",
  cursor: 'ew-resize',
  width: '6px',
});

function ColumnResizer({index, refs, setRefs}) {
  const resizer = useRef();

  const startDrag = (e) => {
    const startPos = e.touches ? e.touches[0].screenX : e.screenX;
    const previousSiblingWidth = parseInt(resizer.current.previousSibling.style.width);
    const mouseMoveHandler = onMouseMove(previousSiblingWidth, startPos);

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', function() {
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', this)
    });
  }

  const onMouseMove = (originalWidth, startPos) => e => {
    const currentElem = resizer.current;
    const mouseX = e.touches ? e.touches[0].screenX : e.screenX;

    const delta = startPos - mouseX;
    const newWidth =  originalWidth - delta;

    if(newWidth < parseInt(currentElem.previousSibling.style.minWidth)||
      newWidth > parseInt(currentElem.previousSibling.style.maxWidth)) {
      return;
    }

    refs[index].forEach(ref => {
      ref.previousSibling.style.width = newWidth + 'px';
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
