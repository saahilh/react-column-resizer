import React, {useEffect, useRef} from 'react';

function ColumnResizer({disabled, index, refs, setRefs}) {
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
      ref.current.previousSibling.style.width = newWidth + 'px';
    });
  }

  useEffect(() => {
    setRefs(prev => (
      prev.map((refList, refIndex) => (
        refIndex===index ? [...refList, resizer] : [...refList]
      ))
    ));

    if(refs[index] && refs[index].length) {
      resizer.current.previousSibling.style.width = refs[index][0].current.previousSibling.style.width;
    }

    return function cleanup() {
      setRefs(prev => {
        const newPrev = prev.map((refList, refIndex) => {
          if(refIndex===index) {
            return refList.filter(elem => elem != resizer);
          } else {
            return refList;
          }
        })
        return newPrev
      });
    }
  }, []);

  const style = {
    WebkitTouchCallout: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    MsUserSelect: 'none',
    userSelect: 'none',
    width: '6px',
  }

  if (disabled) {
    return <td ref={resizer} style={style} />
  }

  return (
    <td
      ref={resizer}
      style={{...style, cursor: 'ew-resize'}}
      onMouseDown={startDrag}
      onTouchStart={startDrag} 
    />
  )
}

export default ColumnResizer;
