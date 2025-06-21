import { selectDraggables } from "redux/slices/draggableSlice"
import { useDispatch, useSelector } from "react-redux"
import { scaleLinear } from "d3-scale"
import SVLinks from 'components/layout/SVLinks';
import React, { useState, useEffect, useRef } from 'react';
import _, { reject } from 'lodash';

import { Typography, Slider } from '@mui/material';
import { updateBothTracks, updateTrack } from "../../redux/slices/basicTrackSlice";



// import * as d3 from 'd3';

import { selectBasicTracks } from "../../redux/slices/basicTrackSlice"
import { selectGenome } from "../../redux/slices/genomeSlice";

var orthologs = window.orthologs;


let dataSet1 = [{ type: "line", source: { x: 623.9910809660769, y: 0 }, target: { x: 624.2136712245092, y: 50 } }];
const SVTrack = ({ index, id, normalize, dragGroup, ...props }) => {

    let alignmentList = window.alignmentList;
    let chromosomeMap = window.chromosomeMap;

    // console.log(alignmentList,chromosomeMap)

    const [minQualityScore, setQualityScore] = useState(0)
    let [waiting, setWaiting] = useState()

    function updateTimer(topKey, topRatio, topZoom, bottomKey, bottomRatio, bottomZoom) {
        let gt = window.gt;
        clearTimeout(waiting)
        setWaiting(window.setTimeout(() => {
            let trackInfo = {
                topKey,
                topRatio,
                topZoom,
                bottomKey,
                bottomRatio,
                bottomZoom
            }
            gt.updateState({ Action: "handleBothTrackUpdate", trackInfo })
        }, 80))
    }

    
    const trackSelector = useSelector(selectBasicTracks)
    const indexSelector = useSelector(selectDraggables)[dragGroup]
    const genomeSelector = useSelector(selectGenome)
    const linkRef = useRef(1)

    const dispatch = useDispatch()

    const [clickLocation, setClickLocation] = useState()
    const [dragging, setDragging] = useState()
    // These should have all the information from the tracks, including zoom level + offset
    let topTrack = trackSelector[indexSelector[index - 1]]
    let bottomTrack = trackSelector[indexSelector[index + 1]]
    let topGenome = genomeSelector[indexSelector[index - 1]]
    let bottomGenome = genomeSelector[indexSelector[index + 1]]
    
    
    const parentWrapperWidth = document.querySelector('.draggableItem')?.getBoundingClientRect()?.width;
    const maxWidth = Math.round(parentWrapperWidth) - 20
    
    useEffect(() => {

        linkRef.current.addEventListener('wheel', preventScroll, { passive: false });
        // if alt key is pressed then stop the event 
        function preventScroll(e) {
            if (e.altKey == true) {
                e.preventDefault();
                // e.stopPropagation();
                return false;
            }
        }
    }, [topTrack, bottomTrack])

    function handleScroll(e) {
        if (e.altKey == true) {

            let factor = 0.8
            if (e.deltaY < 0) {
                factor = 1 / factor
            }
           
            let boundingBox = e.target.getBoundingClientRect()
            let normalizedLocation = (e.clientX - boundingBox.x)
            let dx = ((normalizedLocation - topTrack.offset) * (factor - 1))
            let offsetX = Math.max(Math.min(topTrack.offset - dx, 0), -((maxWidth * topTrack.zoom * factor) - maxWidth))
            if (Math.max(topTrack.zoom * factor, 1.0) === 1.0) offsetX = 0
            
            dx = ((normalizedLocation - bottomTrack.offset) * (factor - 1))
            let bottomOffset = Math.max(Math.min(bottomTrack.offset - dx, 0), -((maxWidth * bottomTrack.zoom * factor) - maxWidth))
            if (Math.max(bottomTrack.zoom * factor, 1.0) === 1.0) bottomOffset = 0

            dispatch(updateBothTracks({
                topKey: topTrack.key,
                bottomKey: bottomTrack.key,
                topOffset: offsetX,
                bottomOffset: bottomOffset,
                topZoom: Math.max(topTrack.zoom * factor, 1.0),
                bottomZoom: Math.max(bottomTrack.zoom * factor, 1.0)
            }))


            if (window.gt) updateTimer(topKey, offsetX / maxWidth, Math.max(topTrack.zoom * factor, 1.0), bottomKey, bottomOffset / maxWidth, Math.max(bottomTrack.zoom * factor, 1.0))
        }
    }



    function handleClick(e) {
        if (e.type == 'mousedown') {
            setDragging(true)
            setClickLocation(e.clientX)
        }
        if (e.type == 'mouseup') {
            setDragging(false)
            setClickLocation(null)
        }
    }
    function handlePan(e) {
        // Panning both tracks
        if (dragging === true) {

            if (!topTrack || !bottomTrack) return

            let boundingBox = e.target.parent ? e.target.parent.getBoundingClientRect() : e.target.getBoundingClientRect()
            let offsetX = Math.max(Math.min(topTrack.offset + e.movementX, 0), -((maxWidth * topTrack.zoom) - maxWidth))

            let bottomOffset = Math.max(Math.min(bottomTrack.offset + e.movementX, 0), -((maxWidth * bottomTrack.zoom) - maxWidth))
  
            dispatch(updateBothTracks({
                topKey: topTrack.key,
                bottomKey: bottomTrack.key,
                topOffset: offsetX,
                bottomOffset: bottomOffset,
                topZoom: topTrack.zoom,
                bottomZoom: bottomTrack.zoom
            }))

            if (window.gt) updateTimer(topKey, offsetX / maxWidth, topTrack.zoom, bottomKey, bottomOffset / maxWidth, bottomTrack.zoom)
        }
    }
    
    // function locate(e) {

    //     const genes = e.target.id.split("-")
    //     if (genes.length < 2) return

    //     let boundingBox = e.target.getBoundingClientRect()

    //     let topGene = searchTrack(genes[0], topGenome.array)
    //     let bottomGene = searchTrack(genes[1], bottomGenome.array)

    //     let topRatio = topGene.start / aboveCap
    //     let bottomRatio = bottomGene.start / belowCap

    //     // If near the bottom, snap to the bottom, if near the top, snap to top
    //     let topOffset = topTrack.offset
    //     let bottomOffset = bottomTrack.offset
    //     let track, offset
    //     if (e.clientY > boundingBox.top +( boundingBox.height / 2)) {
            
    //         // Find location of gene on top track to snap
    //         let bottomLocation = bottomRatio * maxWidth * bottomTrack.zoom + bottomTrack.offset
    //         offset = -(topRatio * maxWidth * topTrack.zoom) + bottomLocation
    //         track = topTrack
    //         topOffset = offset
    //     }
    //     else {
    //         // Find location of gene on top track
    //         let topLocation = topRatio * maxWidth * topTrack.zoom + topTrack.offset
    //         offset =  -(bottomRatio * maxWidth * bottomTrack.zoom) + topLocation
    //         track= bottomTrack
    //         bottomOffset = offset
    //     }
    //     dispatch(updateTrack({
    //         key: track.key,
    //         offset: offset,
    //         zoom:track.zoom
    //     }))
    //     if (window.gt){ updateTimer(topTrack.key, topOffset / maxWidth, topTrack.zoom, bottomTrack.key, bottomOffset / maxWidth, bottomTrack.zoom)}
    // }
    //######################################################################################
    
    let aboveLength = topGenome ? topGenome.array.length : 0
    let aboveCap = aboveLength > 0 ? Math.max(...topGenome.array.map(d => d.end)) : 0
    let belowLength = bottomGenome ? bottomGenome.array.length : 0
    let belowCap = belowLength > 0 ? Math.max(...bottomGenome.array.map(d => d.end)) : 0

    //////////*******change with top track when have data for top track and bottom....
    let topKey = topTrack ? topTrack.key.slice(-1) : undefined
    let bottomKey = bottomTrack ? bottomTrack.key.slice(-1): undefined
    
    // let topKey = "1";     
    // let bottomKey =  "2"
    if(!topKey || !bottomKey){
        return (
            <div id={id} ref={linkRef}></div>
        )
    }

    let AllSVPairs =  alignmentList
    .filter((d)=> (d.source==topKey && d.target == bottomKey ))

    const minScore = _.minBy(AllSVPairs, "qualityScore").qualityScore;
    const maxScore = _.maxBy(AllSVPairs, "qualityScore").qualityScore;


    let SVPairs =  AllSVPairs
    .filter((d)=> (d.qualityScore>=minQualityScore))


    // console.log(SVPairs)
    //{type: "polygon", source: {x: 0,x1: 0,y1:0, y:0}, target: {x:100,x1: 200, y1: 100, y:100}}

    let linkPositions = [];
    let parentWrapperHeight = document.querySelector('.draggableItem')?.getBoundingClientRect()?.height


    const paddingRight = 10, paddingLeft = 10, paddingTop = 10, paddingBottom = 10;

    let topRatio = normalize ? aboveCap / topTrack.normalizedLength : 1.0
    let bottomRatio = normalize ? belowCap / bottomTrack.normalizedLength : 1.0

    let xScale1 = topKey ? scaleLinear().domain([chromosomeMap[topKey].start, chromosomeMap[topKey].end]).range([paddingLeft, ((maxWidth) * topRatio * topTrack.zoom) - paddingRight]) : false
    let xScale2 = bottomTrack ? scaleLinear().domain([chromosomeMap[bottomKey].start, chromosomeMap[bottomKey].end]).range([paddingLeft, ((maxWidth) * bottomRatio * bottomTrack.zoom) - paddingRight]) : false

    let widthScale1 = topKey ? scaleLinear().domain([chromosomeMap[topKey].start, chromosomeMap[topKey].end]).range([0, ((maxWidth) * topTrack.zoom)]) : false
    let widthScale2 = bottomTrack? scaleLinear().domain([chromosomeMap[bottomKey].start, chromosomeMap[bottomKey].end]).range([0, ((maxWidth) * bottomTrack.zoom)]) : false

    if(xScale1 && xScale2 && widthScale1 && widthScale2) for (var pair of SVPairs) {

        let geneAboveStart = pair.sourceIndex;
        let geneBelowStart = pair.targetIndex;
        // let geneAbove = searchTrack(pair.source, topGenome.array)
        // let geneBelow = findGene(pair.target);
        // let geneBelow = searchTrack(pair.target, bottomGenome.array)

        // console.log(linkPositions)
        let topX = xScale1(geneAboveStart) + topTrack.offset

        let bottomX = xScale2(geneBelowStart) + bottomTrack.offset

        linkPositions.push({ type: pair.type, source: { x: topX, y: 0 }, target: { x: bottomX, y: parentWrapperHeight },width: 2})

    }

    let topColor = topTrack ? topTrack.color : undefined
    let bottomColor = bottomTrack ? bottomTrack.color : undefined

    let gradient = [topColor, bottomColor]

    function handleSlider(e){
        setQualityScore(e.target.value)
    }

    // debugger

    return (
        <>
            <div style = {{
                    'position': 'relative',}}
                    id={id} ref={linkRef} onWheel={handleScroll} onMouseDown={handleClick} onMouseUp={handleClick} onMouseMove={handlePan} >
                <SVLinks linkPositions={linkPositions} height={(parentWrapperHeight)} width={(parentWrapperWidth)}/>
                <Slider className="QualityScoreFilter"
                orientation="vertical"
                style = {{
                    'position': 'absolute',
                    top: 0,
                    right: 0,
                    height: '90%',
                    display: 'flex',
                    'align-items': 'center',

                    'transform-origin': 'top right'
                  }}
                            step={1}
                            min={minScore}
                            max={maxScore}
                            valueLabelDisplay={"auto"}
                            onChange={handleSlider}
                        />
            </div>
        </>
    )
}

export default SVTrack;