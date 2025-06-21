import React from 'react'
import { useSelector } from 'react-redux'
import { selectAnnotations, selectSearch, selectOrthologs } from 'redux/slices/annotationSlice'
import Window from 'features/miniview/Window'
import { selectMiniviews, selectComparison } from 'features/miniview/miniviewSlice'
import { scaleLinear } from 'd3-scale'

/**
 * Used to generate the informational overview of the track - annotations, cursor positions. Curently needs to be refined.
 */

function TrackMarkers({ id, width, coordinateY, height, viewFinderScale, locationScale, offset, spacingLeft, paddingLeft, paddingRight, genome, isDark, viewFinderWidth }) {

    const annotationSelector = useSelector(selectAnnotations)[id]
    const searchSelector = useSelector(selectSearch)[id]
    const orthologSelector = useSelector(selectOrthologs)[id]
    const comparisonSelector = useSelector(selectComparison)[id]

    const collabPreviews = useSelector(selectMiniviews)
    const previewSelector = useSelector(selectMiniviews)['newPreview']

    let maxHeight = genome ? height : document.querySelector('.actualTrack')?.getBoundingClientRect()?.height
    let left = spacingLeft + paddingLeft 

    return (
        <>
            {
                annotationSelector && annotationSelector.map(note => {
                    let x = locationScale(note.location) + offset + spacingLeft + 3
                    if (x > 0 && x < width) {
                        return (
                            <Window
                                coordinateX={x}
                                coordinateY={coordinateY}
                                width={2}
                                height={maxHeight + 2}
                                preview={true}
                                label={note.note}
                            />)

                    }
                })
            }
            {
                searchSelector && searchSelector.map(note => {
                    let x = locationScale(note.location) + offset + spacingLeft + 3
                    if (x > 0 && x < width) {
                        return (
                            <Window
                                coordinateX={x}
                                coordinateY={coordinateY}
                                width={2}
                                height={maxHeight + 2}
                                preview={true}
                                label={note.note}
                            />)

                    }
                })
            }
            {
                orthologSelector && orthologSelector.map(note => {
                    let x = locationScale(note.location) + offset
                    {/* console.log(note.location) */}
                    {/* 10083049 */}
                    {/* let x = viewFinderScale(note.location) */}
                    {/* console.log("Different scale: " + viewFinderScale(note.location))
                    console.log("Marker: " + x) */}
                    {/* console.log(Math.round(locationScale(0) + offset) + " end: " + Math.round(locationScale(23458459) + offset)) */}
                   
                    if (x > left && x <  width + spacingLeft - paddingLeft) {
                        return (
                            <Window
                                coordinateX={x}
                                coordinateY={coordinateY}
                                width={2}
                                height={maxHeight + 2}
                                preview={true}
                                label={note.note}
                            />)

                    }
                })
            }
            {previewSelector.visible && Object.keys(collabPreviews).map(item => {
                // I think this will work
                //! This is just approximate, the math is wrong somewhere
                {/* let collabX = locationScale(collabPreviews[item].center) + offset + spacingLeft + paddingLeft */}
                let collabX = locationScale(collabPreviews[item].center - 50000) + offset
                // This one's a little harder...
                {/* console.log(left + width + 50) */}
                {/* let collabWidth = trackType == 'default' ? previewWidth : 3 */ }
                let collabWidth = viewFinderWidth(100000)
                let difference = 0
                if (collabX < left) {
                    difference = left - collabX
                    collabWidth -= difference
                    collabX = left
                }
                else if (collabX + collabWidth > width + paddingLeft * 2) {
                    {/* console.log(width + spacingLeft - paddingLeft * 2) */}
                    difference = (width + paddingLeft * 2) - (collabX + collabWidth)
                    collabWidth += difference
                }

                if (collabX >= 0 &&
                    collabX <= left + width)
                    return (
                        <Window
                            color={collabPreviews[item].cursorColor}
                            key={item}
                            coordinateX={collabX}
                            // coordinateX={x}
                            coordinateY={coordinateY}
                            height={maxHeight}
                            width={collabWidth} // boxwidth
                            preview={id == 'preview' ? false : true}
                            text={Math.max(Math.round(collabPreviews[item].center) - 5000, 0)}
                            isDark={isDark}
                            style={genome ? "genome" : undefined}
                        />
                    )
            })
            }

        </>
    )
}

export default TrackMarkers