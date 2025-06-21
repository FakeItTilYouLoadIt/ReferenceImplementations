/** @jsxImportSource @emotion/react */
import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { selectBasicTracks } from '../../redux/slices/basicTrackSlice'
import { Typography } from '@mui/material';
import { css, keyframes } from "@emotion/react";


/**
 * Component for rendering bitmap tracks once passed an image file
 * image: the file to use
 * offset: Integer, the pixel distance to offset the image
 * zoom: Float, the value used to scale the image
 * id: the id of the track
 * genome: Boolean, flag to determine if the track has full interactivity
 * cap: the maximum value of the x-axis of the array
 * color: the color of the track as a hex
 * normalizedLength: Integer, the maximum x-axis value of all the tracks to be used to reference track width
 * normalize: Boolean, flag to determine whether to normalize the track againse normalizedLength
 * height: height of the track
 * width: width of the track
 * orthologs: the file of the ortholog track (if present)
 * isHighDef = Boolean, flag determining if the track is zoomed in to the level that the next layer of images is to be used TODO this is a HACK and should be replaced
 */
function ImageTrack({ image, offset, zoom, id, genome = false, cap, color, normalizedLength, normalize, height, width, orthologs, isHighDef = false }) {

    const imageRef = useRef()
    const canvasRef = useRef(null)
    const trackSelector = useSelector(selectBasicTracks)

    let originalWidth = width ? width : (document.querySelector('.draggable')?.getBoundingClientRect()?.width - 60)
    if (normalize) originalWidth = originalWidth * cap / normalizedLength;
    let adjustedHeight = height ? height : document.querySelector('.draggable')?.getBoundingClientRect()?.height - 50

    //////////////////////////////
    // Quick hacky fix for renaming tracks for DH4079

    let conversion_mapping = {
        "N1" : "A1",
        "N2" : "A2",
        "N3" : "A3",
        "N4" : "A4",
        "N5" : "A5",
        "N6" : "A6",
        "N7" : "A7",
        "N8" : "A8",
        "N9" : "A9",
        "N10" : "A10",
        "N11" : "C1",
        "N12" : "C2",
        "N13" : "C3",
        "N14" : "C4",
        "N15" : "C5",
        "N16" : "C6",
        "N17" : "C7",
        "N18" : "C8",
        "N19" : "C9",
    }

    //////////////////////////////


/**
 * Function for determining the zoom/pan locations of the track
 */
    function trackStyle(currentOffset, currentZoom, index) {
        if (currentOffset === undefined) {
            return {
                display: 'none',
            }
        }

        let x = currentOffset + (index * (originalWidth * currentZoom))
        let y = orthologs ? -index * (adjustedHeight - 18) : -index * (adjustedHeight + 2)


        const transform = `matrix(${currentZoom}, 0, 0,  ${1}, ${x}, ${y})`
        const imageRender = image.length > 1 || id.includes("METHYL") || id.includes("all") || id.includes("seed") || id.includes("leaf") ? "pixelated" : "auto"
        // console.log(currentZoom)
        // scale: `{currentZoom}`,
        // translate: `{x} {y}`,
        // left: x,

        const myEffect = keyframes`
            0% {
                background: transparent;
            }
            100% {
            background: ${color};
            }
            `;

        let calculated_height
        if (genome){
            calculated_height = "40px"
        }
        else{
            calculated_height = orthologs ? adjustedHeight - 25 + "px" : adjustedHeight - 5 + "px"
        }

        let style = css(css`
            width: ${originalWidth + "px"};
            height: ${calculated_height};
            transform-origin: top left;
            -webkit-user-drag: none;
            user-select: none;
            msUserSelect: none;
            MozUserSelect: none;
            cursor: crosshair;
            pointer-events: none;
            content: "";
            image-rendering: ${imageRender};
            -webkit-transform: ${transform};
            background: ${color};
            animation: ${myEffect} 300ms ease-in;
            
            `)

        return (style)

    }
/**
 * Function for determining the zoom/pan of the ortholog track(if present)
 */
    function orthologStyle(currentOffset, currentZoom) {
        if (currentOffset === undefined) {
            return {
                display: 'none',
            }
        }

        let x = trackSelector[id] ? trackSelector[id].offset : 0
        let scale = trackSelector[id] ? trackSelector[id].zoom : 1

        const transform = `matrix(${scale}, 0, 0,  ${1}, ${x}, ${0})`

        const imageRender = image.length > 1 ? "pixelated" : "auto"

        return ({
            WebkitUserSelect: 'none',
            width: originalWidth,
            height: 20,
            transformOrigin: "top left",
            WebkitTransform: transform,
            WebkitUserDrag: "none",
            marginBottom: -6,
            imageRendering: imageRender,

        })
    }
    ///////////////////////////////////////////////////////////////////////////
    let split_ID = id.split("_")
    let combined_ID = id
    if(Object.keys(conversion_mapping).includes(split_ID[1])){
      combined_ID = split_ID[0] + "_" + conversion_mapping[split_ID[1]]
    }
    ///////////////////////////////////////////////////////////////////////////

    let dynamicID = id + "imageTrack" + (isHighDef ? "highDef" : "-")
    return (
        <>
            <div style={{ width: '100%', paddingRight: 10 }} ref={imageRef}>
                {id && !genome &&
                    <Typography
                        variant="body1"
                        className={"title"}
                        style={{
                            WebkitUserSelect: 'none',
                            position: 'relative',
                            top: 0,
                            fontWeight: 100,
                            textAlign: 'center',
                            marginLeft: 'auto',
                            marginRight: 0,
                            height: 25,
                            zIndex: 1,
                            pointerEvents: 'none',

                        }}
                    >{"Chromosome: " + combined_ID}</Typography>}
                {!genome && orthologs && <img
                    className={'testingTracks'}
                    src={orthologs}
                    id={id + "ortholog_imageTrack"}
                    style={orthologStyle(offset, zoom, 0)}
                    alt={`Track showing {id} chromosome ortholog locations.`}
                    loading="lazy"
                />}
                <div className={genome ? "genome_tracks" : "tracks"} style={{ float: "left", display: "inline", height: orthologs || genome ? adjustedHeight - 20 : adjustedHeight }}>
                    {image.map((image, index) => {
                        return (<img
                            className={genome ? 'genome-track' : 'track'}
                            key={dynamicID + index}
                            src={image}
                            id={dynamicID + index}
                            css={trackStyle(offset, zoom, index)}
                            tabIndex={-1}
                            draggable={false}
                            alt={`Track showing {id} gene locations.`}
                            loading="lazy"
                        >
                        </img>)
                    })}

                </div>

            </div>
        </>
    )
}

export default ImageTrack
