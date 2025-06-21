import React from 'react'
import TrackContainer from './TrackContainer'
import { useSelector } from 'react-redux'
import {selectBasicTracks} from '../../redux/slices/basicTrackSlice'
import {selectGenome} from '../../redux/slices/genomeSlice'

function Track({ id, renderTrack, isDark, normalize, usePreloadedImages, genome=false, width, moveCursor, cursorPosition }) {

    
    let true_id = id.includes("_splitview") ? id.split("_splitview")[0] : id
    true_id = true_id.includes("_genome") ? true_id.split("_genome")[0] : true_id
    const basicTrackSelector = useSelector(selectBasicTracks)[true_id]
    const splitTrackSelector = useSelector(selectBasicTracks)[true_id]
    // const genomeSelector = useSelector(selectGenome)[id]

    // debugger

    return (
        <TrackContainer
            key={id + "_container"}
            id={id}
            // array={genomeSelector.array}
            color={basicTrackSelector.color}
            isDark={isDark}
            offset={basicTrackSelector.offset}
            zoom={basicTrackSelector.zoom}
            pastZoom={basicTrackSelector.pastZoom}
            // normalizedLength={basicTrackSelector.normalizedLength}
            height={1}
            trackType={basicTrackSelector.trackType}
            renderTrack={renderTrack}
            normalize={normalize}
            cap={basicTrackSelector.end}
            usePreloadedImages={usePreloadedImages}
            genome={genome}
            width={width}
            moveCursor={moveCursor}
            cursorPosition={cursorPosition}
        />

    )
}

export default Track