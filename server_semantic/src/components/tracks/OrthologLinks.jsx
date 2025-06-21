import { selectDraggables } from "redux/slices/draggableSlice"
import { useDispatch, useSelector } from "react-redux"
import { scaleLinear } from "d3-scale"
import Links from 'components/layout/Links';
import React, { useState, useEffect, useRef } from 'react';
import { updateBothTracks, updateTrack } from "../../redux/slices/basicTrackSlice";


import { selectBasicTracks } from "../../redux/slices/basicTrackSlice"
import { selectGenome } from "../../redux/slices/genomeSlice";



function searchTrack(geneSearched, trackDataset) {
    return trackDataset.find((d) => d.key.toLowerCase() === geneSearched.toLowerCase())
}


function findOrthologs(c1, c2) {
    let orthologPairs = [];

    let topOrthologs = c1.data.filter(gene => gene.ortholog && gene.siblings.some(x=> x.chromosome === c2.key.chromosome))
    let bottomOrthologs = c2.data.filter(gene => gene.ortholog && gene.siblings.some(x => x.chromosome === c1.key.chromosome))

    for (let gene of topOrthologs) {
        if(bottomOrthologs.some(t => t.siblings.map(x => x.key).includes(gene.key.toUpperCase()))){
            let match = gene.siblings.filter(x => x.chromosome === c2.key.chromosome).map(x => x.key)
            if(match.length < 2){
                orthologPairs.push({source: gene.key, target:match.toString()})
            }
            else{
                match.forEach(x => orthologPairs.push({source: gene.key, target: x}))
            }
        }
    }
    return orthologPairs;
}

const OrthologLinks = ({ index, id, normalize, dragGroup, ...props }) => {


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
    const [dragging, setDragging] = useState()

    // These should have all the information from the tracks, including zoom level + offset
    let topTrack = trackSelector[indexSelector[index - 1]]
    let bottomTrack = trackSelector[indexSelector[index + 1]]
    // let topGenome = genomeSelector[indexSelector[index - 1]]
    // let bottomGenome = genomeSelector[indexSelector[index + 1]]
    let topGenome, bottomGenome

    if (window.chromosomalData) {
        if(bottomTrack && bottomTrack.key){
            bottomGenome = window.chromosomalData.find(x => x.key.chromosome == bottomTrack.key)
        }
        if(topTrack && topTrack.key){
            topGenome = window.chromosomalData.find(x => x.key.chromosome == topTrack.key)

        }
      }
    
    
    const parentWrapperWidth = document.querySelector('.scale')?.getBoundingClientRect()?.width;
    const maxWidth = Math.round(parentWrapperWidth)
    
    useEffect(() => {
        linkRef.current.addEventListener('wheel', preventScroll, { passive: false });
        // if alt key is pressed then stop the event 
        function preventScroll(e) {
            if (e.altKey === true) {
                e.preventDefault();
                // e.stopPropagation();
                return false;
            }
        }
    }, [topTrack, bottomTrack])

    function handleScroll(e) {
        if (e.altKey === true) {

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

                      //! Trial Logic ##################################################################
    window.timing.push({"zoom_two_tracks": Date.now()})

    //! Trial Logic #################################################################

            dispatch(updateBothTracks({
                topKey: indexSelector[index - 1],
                bottomKey: indexSelector[index + 1],
                topOffset: offsetX,
                bottomOffset: bottomOffset,
                topZoom: Math.max(topTrack.zoom * factor, 1.0),
                bottomZoom: Math.max(bottomTrack.zoom * factor, 1.0)
            }))


            if (window.gt) updateTimer(topKey, offsetX / maxWidth, Math.max(topTrack.zoom * factor, 1.0), bottomKey, bottomOffset / maxWidth, Math.max(bottomTrack.zoom * factor, 1.0))
        }
    }



    function handleClick(e) {
        if (e.type === 'mousedown') {
            setDragging(true)
        }
        if (e.type === 'mouseup') {
            setDragging(false)

        }
    }
    function handlePan(e) {
        // Panning both tracks
        if (dragging === true) {

            if (!topTrack || !bottomTrack) return

            let offsetX = Math.max(Math.min(topTrack.offset + e.movementX, 0), -((maxWidth * topTrack.zoom) - maxWidth))

            let bottomOffset = Math.max(Math.min(bottomTrack.offset + e.movementX, 0), -((maxWidth * bottomTrack.zoom) - maxWidth))
  
                                  //! Trial Logic ##################################################################
    window.timing.push({"pan_two_tracks": Date.now()})

    //! Trial Logic #################################################################

            dispatch(updateBothTracks({
                topKey: indexSelector[index - 1],
                bottomKey: indexSelector[index + 1],
                topOffset: offsetX,
                bottomOffset: bottomOffset,
                topZoom: topTrack.zoom,
                bottomZoom: bottomTrack.zoom
            }))

            if (window.gt) updateTimer(topKey, offsetX / maxWidth, topTrack.zoom, bottomKey, bottomOffset / maxWidth, bottomTrack.zoom)
        }
    }
    
    function locate(e) {

        const genes = e.target.id.split("-")
        if (genes.length < 2) return

        let boundingBox = e.target.getBoundingClientRect()

        let topGene = searchTrack(genes[0], topGenome.data)
        let bottomGene = searchTrack(genes[1], bottomGenome.data)

        let topRatio = normalize ? topGene.start /topGenome.normalizedLength  : topGene.start / aboveCap
        let bottomRatio = normalize ? bottomGene.start / bottomGenome.normalizedLength: bottomGene.start / belowCap

        // If near the bottom, snap to the bottom, if near the top, snap to top
        let topOffset = topTrack.offset
        let bottomOffset = bottomTrack.offset
        let track, offset, scaling, trackName
        if (e.clientY > boundingBox.top +( boundingBox.height / 2)) {
            
            // Find location of gene on top track to snap
            let bottomLocation = bottomRatio * maxWidth * bottomTrack.zoom + bottomTrack.offset
            offset = -(topRatio * maxWidth * topTrack.zoom) + bottomLocation
            scaling = scaleLinear().domain([0, aboveCap]).range([0, maxWidth * topTrack.zoom])
            track = topTrack
            trackName = indexSelector[index - 1]
            // topOffset = offset
            topOffset = -scaling(bottomLocation)
        }
        else {
            // Find location of gene on top track
            let topLocation = topRatio * maxWidth * topTrack.zoom + topTrack.offset
            offset =  -(bottomRatio * maxWidth * bottomTrack.zoom) + topLocation
            scaling = scaleLinear().domain([0, aboveCap]).range([0, maxWidth * topTrack.zoom])
            track = bottomTrack
            trackName = indexSelector[index + 1]
            bottomOffset = offset
        }

                              //! Trial Logic ##################################################################
    window.timing.push({"snap_links": Date.now()})

    //! Trial Logic #################################################################
        dispatch(updateTrack({
            key: trackName,
            offset: offset,
            zoom:track.zoom
        }))
        if (window.gt){ updateTimer(topTrack.key, topOffset / maxWidth, topTrack.zoom, bottomTrack.key, bottomOffset / maxWidth, bottomTrack.zoom)}
    }
    //######################################################################################
    if(!topGenome || !bottomGenome){
        return (
            <div id={id} ref={linkRef}></div>
        )
    }
    let aboveLength = topGenome ? topGenome.data.length : 0
    let aboveCap = aboveLength > 0 ? Math.max(...topGenome.data.map(d => d.end)) : 0
    let belowLength = bottomGenome ? bottomGenome.data.length : 0
    let belowCap = belowLength > 0 ? Math.max(...bottomGenome.data.map(d => d.end)) : 0
    let topKey = topTrack ? topTrack.key : undefined
    let bottomKey = bottomTrack ? bottomTrack.key : undefined

   

    let orthologPairs = findOrthologs(topGenome, bottomGenome);
    //{type: "polygon", source: {x: 0,x1: 0,y1:0, y:0}, target: {x:100,x1: 200, y1: 100, y:100}}

    let arrayLinks = [];
    let parentWrapperHeight = document.querySelector('.draggableItem')?.getBoundingClientRect()?.height

    const paddingRight = 10, paddingLeft = 10
    let topRatio = normalize ? aboveCap / topGenome.normalizedLength : 1.0
    let bottomRatio = normalize ? belowCap / bottomGenome.normalizedLength : 1.0
    let xScale1 = topKey ? scaleLinear().domain([0, aboveCap]).range([0, ((maxWidth) * topRatio * topTrack.zoom)]) : false
    let xScale2 = bottomKey ? scaleLinear().domain([0, belowCap]).range([0, ((maxWidth) * bottomRatio * bottomTrack.zoom)]) : false

    // let xScale1 = topKey ? scaleLinear().domain([0, aboveCap]).range([paddingLeft, ((maxWidth) * topRatio * topTrack.zoom)]) : false
    // let xScale2 = bottomKey ? scaleLinear().domain([0, belowCap]).range([paddingLeft, ((maxWidth) * bottomRatio * bottomTrack.zoom)]) : false

    let widthScale1 = topKey ? scaleLinear().domain([0, aboveCap]).range([0, ((maxWidth) * topTrack.zoom)]) : false
    let widthScale2 = bottomKey? scaleLinear().domain([0, belowCap]).range([0, ((maxWidth) * bottomTrack.zoom)]) : false

    if(xScale1 && xScale2 && widthScale1 && widthScale2) for (var pair of orthologPairs) {
        

        let geneAbove = searchTrack(pair.source, topGenome.data)
        let geneBelow = searchTrack(pair.target, bottomGenome.data)


        let topX1 = xScale1(geneAbove.start) + topTrack.offset
        let topX2 = topX1 + widthScale1(geneAbove.end - geneAbove.start)

        let bottomX1 = xScale2(geneBelow.start) + bottomTrack.offset
        let bottomX2 = bottomX1 +  widthScale2(geneBelow.end - geneBelow.start)
        arrayLinks.push({ type: "polygon", color: "purple", above: geneAbove.key, below: geneBelow.key, source: { x: topX1, x1: topX2, y: 0 }, target: { x: bottomX1, x1: bottomX2, y: parentWrapperHeight } })

    }

    let topColor = topTrack ? topTrack.color : undefined
    let bottomColor = bottomTrack ? bottomTrack.color : undefined

    let gradient = [topColor, bottomColor]



    return (
        <>
            <div id={id} ref={linkRef} onWheel={handleScroll} onMouseDown={handleClick} onMouseUp={handleClick} onMouseMove={handlePan} >
                <Links arrayCoordinates={arrayLinks} type="svg" width={(parentWrapperWidth + 50)} gradient={gradient} locate={locate} />
            </div>
        </>
    )
}

export default OrthologLinks;
