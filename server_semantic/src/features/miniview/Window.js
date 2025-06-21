import { Typography } from '@mui/material'
import React from 'react'


/* Used to make the viewfinder boxes
TODO make labels, there's currently no way to match viewfinder to track
*/
function Window({ color=undefined, coordinateX, coordinateY, width, height, preview, text, grouped, label=undefined, isDark=false, style="box" }) {

        let chosenColor = color ? color : isDark ? "white" : "black" 
        let className = grouped ? 'groupedComparison' : 'comparison'
        let opaq = label ? 0.8 : 0.4
        
        // Indicator for label besides a bar
        return (
            <>
            {label && <Typography variant="caption" style={{  WebkitUserSelect: 'none',position: "absolute", top: coordinateY-20, left: coordinateX, zIndex: 3, background: "#a89b97"}}>{label}</Typography>}
           { preview && style==="box" && <div className={className} style={{position: 'absolute', backgroundColor: chosenColor, opacity: opaq, top: coordinateY, left: coordinateX, width: width, height: height, zIndex: 1, pointerEvents: 'none' }}>
            </div>}
            { preview && style==="caret"  && 
            <div className={className} style={{
                position: 'absolute',
                backgroundColor: "inherit",
                top: coordinateY - 15, 
                left: coordinateX,
                borderTop: "15px solid " + chosenColor,
                borderBottom: "15px solid " + chosenColor,
                borderLeft: +width/2 +"px solid transparent",
                borderRight: +width/2 +"px solid transparent", 
                width: 0, 
                height: height + 30, 
                zIndex: 1, 
                pointerEvents: 'none' }}>
            </div>} 
            { preview && style==="genome"  && 
            <div className={className} style={{
                position: 'absolute',
                backgroundColor: "inherit",
                top: coordinateY - 8, 
                left: coordinateX - 8,
                borderTop: "8px solid " + chosenColor,
                borderBottom: "8px solid " + chosenColor,
                borderLeft: "8px solid transparent",
                borderRight: "8px solid transparent", 
                width: 0, 
                height: height + 16, 
                zIndex: 1, 
                pointerEvents: 'none' }}>
            </div>} 
            </>
        )
    
    
}

export default Window