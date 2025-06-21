import React, { useEffect, useRef, useState } from "react"
import { scaleLinear } from "d3-scale"
import { useSelector } from "react-redux"
import Window from "./Window"
import { Typography } from '@mui/material';
import { selectMiniviews } from "./miniviewSlice"

/*
This is the small preview that appears on mouse-over. 
TODO make work with the histogram
*/

const Miniview = ({ array, color, coordinateX, coordinateY, width, height,  absolutePositioning, displayPreview, id,preview,isDark, trackType, center, boxLeft, boxTop, label=undefined, ...props }) => {

    const canvasRef = useRef()
    const previewSelector = useSelector(selectMiniviews)['newPreview']

   

    useEffect(() => {
        if(trackType !== 'default') return
        // debugger
        const ctx = canvasRef.current.getContext('2d')
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

        let middle = Math.round(center)
     
        let xScale = scaleLinear().domain([middle - 50000, middle + 50000]).range([0, ctx.canvas.width])
        let widthScale = scaleLinear().domain([0, 100000]).range([0, ctx.canvas.width])
        ctx.fillStyle = color

        let geneArray = array.filter(d => d.end > center - 50000 && d.start < center + 50000)
        geneArray.forEach(gene => {
            let x = xScale(gene.start)
            let rectWidth = widthScale(gene.end - gene.start)
            ctx.beginPath()
            ctx.rect(x, 0, rectWidth, ctx.canvas.height)
            ctx.fill()
        })


    }, [center])

    let position = absolutePositioning ? 'absolute' : 'relative'

    let style = {
        position: position,
        top: coordinateY,
        left: coordinateX,
        width: width,
        height: height,
        margin: 0,
    }

    let scaleBackground = isDark ? 'grey' : "whitesmoke"
    let scaleStyle = {
        position: position,
        top: coordinateY,
        height: height + 5,
        margin: 0,
        background: scaleBackground,
        zIndex: 3,
    }
    // debugger
    return (

        <>

        {id !== "newPreview" && <Typography variant="caption" style={scaleStyle} left={coordinateX + width + 80}>{array[0].chromosome.toUpperCase() + "-" + id}</Typography>}
            {(trackType === "default") && <Typography style={scaleStyle} left={coordinateX - 80}>{Math.max(Math.round(center- 50000), 0)}</Typography>
            }     
            {(trackType === "default") && <canvas
                id={id}
                ref={canvasRef}
                className='miniview'
                width='2000'
                height='1000'
                style={style}
                {...props} />}
            {(trackType === "default") && <Typography style={scaleStyle} left={coordinateX + width + 2}>{Math.round(center)+ 50000}</Typography>}
            {(trackType !== "default") && <Typography style={scaleStyle} left={coordinateX + width / 2}>{Math.round(center)}</Typography>}
            {(trackType !== "default") && <Window
                className={"test"}
                coordinateX={previewSelector.viewFinderX}
                coordinateY={previewSelector.viewFinderY}
                width={10}
                preview={id == 'preview' ? true : false}
            />}
        </>
    )
}

Miniview.defaultProps = {
    color: 0,
    coordinateX: 0,
    coordinateY: 0,
    width: '100%',
    height: '75%',
    absolutePositioning: false,
    displayPreview: true,
}


export default Miniview
