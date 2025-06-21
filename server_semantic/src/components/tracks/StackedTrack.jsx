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




const StackedTrack = ({ array, activeChromosome,activeSubGenome, genome = false, color = 0, trackType = 'stacked', normalizedLength = 0, doSomething, coordinateX, coordinateY, width, height, id, beginning, fin, grouped, zoom, pastZoom, offset, title, selection, noScale, isDark, normalize, max, ...props }) => {

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
    const [subGenomes, setSubGenomes] = useState([])
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


    const getFile = function (filepath) {
        console.log(filepath)
        return new Promise((resolve, reject) => {
            // get the file
            axios.get(filepath, { headers: { 'content-encoding': 'gzip' } })
                .then((response) => { resolve(response.data) })
                // if there is an error  reject the promise and let user know through toast
                .catch((err) => {
                    alert("Failed to fetch the file", "ERROR");
                    reject();
                })
        });
    }

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

// <<<<<<< HEAD
    console.log(maxHeight, maxWidth)
    useEffect(() => {
        // canvasRef.current.addEventListener('wheel', preventScroll, { passive: false });
        // if alt key is pressed then stop the event 
        // function preventScroll(e) {
        //     if (e.altKey == true) {
        //         e.preventDefault();
        //         // e.stopPropagation();
        //         return false;
        //     }
        // }

        // let { activeSubGenome = "N/A", activeChromosome } = this.props;

        // get the source name based on window query params
        // let { sourceID = "" } = this.props.params;
        let activeSubGenome= "N/A" ;
        let sourceID= "" ;

        // If no source ID is set, check if there is a default set in the window object
        // this default is set when the webapp is launched with a sourceID set in the URL
        if (sourceID.length == 0) {
            // If there is no default set in the window object then default to AT camelina
            if (window.defaultSourceID && window.defaultSourceID.length > 0) {
                sourceID = window.defaultSourceID;
            }
            else {
                sourceID = "AT_camelina";
            }
        }
        else {
            // store the sourceID that the webapp was launched with so it can be used when the tab is switched
            window.defaultSourceID = sourceID;
        }
        // The first part tells you the reference gene file name and the second part tells you the gene expression file name
        let geneSource = sourceID.split("_")[0] + "_genes.gff",
            expressionFileSource = sourceID.split("_")[1] + ".txt";


        
        // Turn loader onON
        // this.setState({ 'loader': true });
        setLoader(true)

        let geneData = [];
        getFile('files/' + geneSource)
            .then((geneFile) => {

                let lineData = geneFile.split('\n').slice(1).map((d) => d.split('\t'));

                geneData = _.groupBy(_.map(lineData, (d) => {
                    let coords = _.sortBy([+d[2], +d[3]]);
                    return {
                        'Chromosome': d[0],
                        'gene': d[1],
                        'start': coords[0],
                        'end': coords[1]
                    };
                    // group the array by Chromosome
                }), (e) => e.Chromosome);
                return getFile('files/' + expressionFileSource);
            })
            .then((rawData) => {
                // processing the data
                let lineArray = rawData.split("\n");
                let columns = lineArray.slice(0, 1)[0].trim().split('\t'),
                    records = lineArray.slice(1)
                        .map((d) => {
                            let lineData = d.split('\t'), tempStore = {};
                            columns.map((columnName, columnIndex) => {
                                // typecast to number 
                                tempStore[columnName] = columnIndex == 0 ? lineData[columnIndex] : +lineData[columnIndex];
                            })
                            // TODO deal with +10 chromosomes
                            tempStore['activeChromosome'] = lineData[0].slice(0, 3);
                            return tempStore;
                        });

                // actions.setActiveSubGenome("N/A");
                activeSubGenome = "N/A";

                let genomeData = _.groupBy(records, (d) => d.activeChromosome);
                let originalGenomeData = _.cloneDeep(genomeData);


                // Get the chromosome names and put into array
                let chromosomes = _.sortBy(Object.keys(genomeData));



                // Sort each array of chromosomes by the active subGenome
                _.map(chromosomes, (chromosome) => {
                    genomeData[chromosome] = _.sortBy(genomeData[chromosome], (d) => d[activeSubGenome])
                })

                

                // sort the data by the default set sort key

                let chromosomeData = _.sortBy(genomeData[activeChromosome], (d) => d[activeSubGenome]);


                let originalChromosomeData = _.cloneDeep(chromosomeData);

                let something = [...columns.slice(1)]
                console.log(something)
                setSubGenomes([...columns.slice(1)])


                // Dumping original data to window so that it can be used later on
                window.triadBrowserStore = { 'chromosomeData': originalChromosomeData, 'genomeData': originalGenomeData, 'subGenomes': something};

                const chartScale = scaleLinear()
                    .domain([0, chromosomeData.length - 1])
                    .range([0, CHART_WIDTH]);

                // want window to be 50px, take 25 on either side
                let genomeWindowRange = chartScale.invert(75);

                let centerPoint = chromosomeData.length / 2;

                let start = centerPoint - genomeWindowRange;
                let end = centerPoint + genomeWindowRange;

                // actions.setDefaultDataChromosome(chromosomeData, genomeData, geneData, { start, end });

                // Set the data onto the state
                // this.setState({ subGenomes, chromosomes });
                // setSubGenomes(chromosomes)

            })
            .catch(() => {
                alert("Sorry there was an error in fetching and parsing the file");
                console.log('error');
            })
            .finally(() => { 
                // this.setState({ 'loader': false })
                setLoader(false)
                drawChart();
             });
             
    }, [maxHeight, maxWidth])
// =======
//     // console.log(maxHeight, maxWidth)
//     useEffect(() => {

//         let dataArray =  [];
//         for (let gene of array){

//                 dataArray.push([gene["SG1"], gene["SG2"], gene["SG3"]])

//         }

//         // console.log(dataArray)

//         drawChart()
             
//     }, [maxHeight, maxWidth,array])
// >>>>>>> da60a820e7722c58274cff78acb56fb2bac0c887



    const drawChart = () => {
        

        let chromosomeData = array;

        let subGdata = subGenomes;

        const chartScale = scaleLinear()
                    .domain([0, chromosomeData.length - 1])
                    .range([0, CHART_WIDTH]);


        // const { chromosomeData = [], chartScale } = this.props;

        let context = clearAndGetContext(canvasRef.current);

        let chartData = _.map(chromosomeData, (dataPoint) => {

            let values = _.map(subGdata, (d) => dataPoint[d]);

            return _.map(values, (d, i) => _.sum(values.slice(0, i + 1)))

        });


        // this.attachResizing();

        let yMax = _.max(_.map(chartData, (d) => _.max(d)));

        let scaleFactor = maxHeight / yMax;

        context.lineWidth = CHART_WIDTH / chromosomeData.length;

        _.map(chartData, (dataPoint, dataIndex) => {

            const padding_from_left = chartScale(dataIndex);

            _.map(dataPoint, (d, stackIndex) => {

                context.beginPath();
                context.strokeStyle = schemeTableau10[stackIndex];
                context.moveTo(padding_from_left, maxHeight - (stackIndex == 0 ? 0 : dataPoint[stackIndex - 1] * scaleFactor));
                context.lineTo(padding_from_left, maxHeight - (dataPoint[stackIndex] * scaleFactor));
                context.stroke();
            })
        });
    }





    return (
        <canvas className="triad-stack-canvas snapshot" width={maxWidth} height={maxHeight} ref={canvasRef} > </canvas>

    )
}

StackedTrack.defaultProps = {
    color: 0,
    coordinateX: 0,
    coordinateY: 0,
    width: 500,
    height: 100,
    zoom: 1.0,
    pastZoom: 1.0,
    offset: 0,
}


export default StackedTrack
