import React, { useEffect, useRef, useState, focus } from "react"
import { scaleLinear } from "d3-scale"
import { useDispatch, useSelector } from "react-redux"
import { Typography, Stack, Tooltip } from '@mui/material';
import axios from 'axios';
import _ from 'lodash';
import { schemeTableau10 } from 'd3';

import { gene } from './gene.js'
import { panComparison, zoomComparison, moveMiniview, selectMiniviews, updateData, changeMiniviewColor, changeMiniviewVisibility, movePreview, changePreviewVisibility, updatePreview, selectComparison } from 'features/miniview/miniviewSlice.js'
import { changeZoom, pan, selectBasicTracks, setSelection, clearSelection, updateTrack, addBasicTrack, deleteAllOrthologTracks } from "../../redux/slices/basicTrackSlice.js";
import { addAnnotation, selectAnnotations, selectSearch, removeAnnotation, addOrtholog, clearOrthologs, selectOrthologs } from "redux/slices/annotationSlice.js";
import { line } from 'd3-shape';
import Window from "features/miniview/Window.js";
import { selectDraggables, addDraggable, clearDraggables } from "redux/slices/draggableSlice.js";
import TrackControls from "./TrackControls.jsx";
import { selectGenome } from "../../redux/slices/genomeSlice.js";
// import { getFile } from '../../features/parsers/fetchData';


/* Information flows from the basicTrackSlice to here through props, adjusting the slice adjusts the track
*/




const IndexBased = ({ array, activeChromosome,activeSubGenome, subGenomes, genome = false, color = 0, trackType = 'indexed', normalizedLength = 0, doSomething, coordinateX, coordinateY, width, height, id, beginning, fin, grouped, zoom, pastZoom, offset, title, selection, noScale, isDark, normalize, max, ...props }) => {

    const canvasRef = useRef(null)
    // TODO Not a huge fan of using this here
    const previewSelector = useSelector(selectMiniviews)['newPreview']
    const collabPreviews = useSelector(selectMiniviews)
    const comparisonSelector = useSelector(selectComparison)[title]


    const [endCap, setEndCap] = useState(0)
    const [startOfTrack, setStartOfTrack] = useState(0)
    const [dragging, setDragging] = useState(false)
    const [clickLocation, setClickLocation] = useState()
    const [normalizer, setNormalizer] = useState([1, 1])
    const [drawnGenes, setDrawnGenes] = useState([])
    const [start, setStart] = useState(0)
    const [cap, setCap] = useState(0)
    const [hovered, setHovered] = useState()
    const [savedWidth, setSavedWidth] = useState()
    const [loader, setLoader] = useState(false)
//this.setState({ subGenomes, chromosomes });

    //! Needed for syncing multiple tracks
    const trackSelector = useSelector(selectBasicTracks)
    const genomeSelector = useSelector(selectGenome)
    const order = useSelector(selectDraggables)
    const annotationSelector = useSelector(selectAnnotations)[id]
    const searchSelector = useSelector(selectSearch)[id]
    const orthologSelector = useSelector(selectOrthologs)[id]

    // If a parent wrapper exists get its dimensions and use 75% of that for the canvas height
    // the rest will be used for the scale 
    // If no height is present default to 100 pixel tall tracks
    // TODO the scale height needs to a static value and not 25% so the following calculation should be updated
    let parentWrapperHeight = document.querySelector('.draggableItem')?.getBoundingClientRect()?.height,
        parentWrapperWidth = genome ? width : document.querySelector('.draggableItem')?.getBoundingClientRect()?.width;




    // Hacky fix for ortholog tracks redering correctly
    // if(title.includes("ortholog")){

    //     parentWrapperWidth = document.querySelector('.draggableItem')?.getBoundingClientRect()?.width == document.querySelector('.draggableItem')?.getBoundingClientRect()?.width ? parentWrapperWidth : parentWrapperWidth * 2
    // }


    // const getFile = function (filepath) {
    //     console.log(filepath)
    //     return new Promise((resolve, reject) => {
    //         // get the file
    //         axios.get(filepath, { headers: { 'content-encoding': 'gzip' } })
    //             .then((response) => { resolve(response.data) })
    //             // if there is an error  reject the promise and let user know through toast
    //             .catch((err) => {
    //                 alert("Failed to fetch the file", "ERROR");
    //                 reject();
    //             })
    //     });
    // }

    const clearAndGetContext = function (canvas) {
        let context = canvas.getContext('2d');
        // Store the current transformation matrix
        context.save();
        // Use the identity matrix while clearing the canvas
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, canvas.width, canvas.height);
        // Restore the transform
        context.restore();
        return context;
    }

    const paddingRight = 10, paddingLeft = 10, paddingTop = 10, paddingBottom = 10;

    let style = {
        position: 'relative',
        top: coordinateY,
        left: coordinateX
    }

    const raw_width = parentWrapperWidth ? Math.round(parentWrapperWidth) : width,
        maxWidth = normalize && !genome ? raw_width * cap / normalizedLength - 20 : genome ? raw_width : raw_width - 20,
        maxHeight = parentWrapperHeight ? (parentWrapperHeight) : height,
        CHART_WIDTH = maxWidth;

    // console.log(maxHeight, maxWidth)
    useEffect(() => {

        // console.log(dataArray)

        drawChart()
             
    }, [maxHeight, maxWidth,array])



    const drawChart = () => {
        

        let data = array;



        const chartScale = scaleLinear()
                    .domain([0, data.length - 1])
                    .range([0, CHART_WIDTH]);

      


        // const { chromosomeData = [], chartScale } = this.props;

        let context = clearAndGetContext(canvasRef.current);

        // let chartData = _.map(chromosomeData, (dataPoint) => {

        //     let values = _.map(subGdata, (d) => dataPoint[d]);

        //     return _.map(values, (d, i) => _.sum(values.slice(0, i + 1)))

        // });


        // this.attachResizing();

        let yMax = _.max(data);

        const heightScale = scaleLinear()
        .domain([0, yMax])
        .range([0, maxHeight]);

        const colorScale =  scaleLinear()
        .domain([0, yMax])
        .range(["black", "red"]);

        let scaleFactor = maxHeight / yMax;

        context.lineWidth = CHART_WIDTH / data.length;

        _.map(data, (dataPoint, dataIndex) => {

            const padding_from_left = chartScale(dataIndex);



                context.beginPath();
                context.strokeStyle = colorScale(dataPoint);
                context.moveTo(padding_from_left, maxHeight);
                context.lineTo(padding_from_left, maxHeight-heightScale(dataPoint));
                context.stroke();

        });
    }





    return (
        <canvas className="indexed track canvas" width={maxWidth} height={maxHeight} ref={canvasRef} > </canvas>

    )
}

IndexBased.defaultProps = {
    color: 0,
    coordinateX: 0,
    coordinateY: 0,
    width: 500,
    height: 100,
    zoom: 1.0,
    pastZoom: 1.0,
    offset: 0,
}


export default IndexBased
