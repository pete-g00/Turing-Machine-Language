import React, { SVGProps } from 'react';

interface LineProps extends SVGProps<SVGLineElement> {
    offsetX1:number;
    offsetX2:number;
    offsetY1:number;
    offsetY2:number;
    lineRef:React.RefObject<SVGLineElement>;
    fromRef:React.RefObject<SVGCircleElement>;
    toRef:React.RefObject<SVGCircleElement>;
}

function TMLine({offsetX1, offsetX2, offsetY1, offsetY2, lineRef, fromRef, toRef, ...props}:LineProps) {
    const x1 = props.x1 as number;
    const x2 = props.x2 as number;
    const y1 = props.y1 as number;
    const y2 = props.y2 as number;
    return (
        <line {...props} ref={lineRef} x1={x1 + offsetX1} x2={x2 + offsetX2} y1={y1 + offsetY1} y2={y2 + offsetY2}></line>
    );
}

export default TMLine;