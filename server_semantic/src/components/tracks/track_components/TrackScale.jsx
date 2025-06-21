import React, { useEffect, useState } from 'react'
import { Stack } from '@mui/material'


/**
 * Generates the scale for the track
 * @param {endOfTrack} - the base pair position of the end of the track. At full scale, this will be the last position,
 * if zoomed/panned at all it will be adjusted 
 * @param {startOfTrack} - the base pair position of the start of the track. At full scale, this will be 0, if
 * zoomed/panned at all it will be adjusted.
 * @param {paddingLeft} - the left padding - if the track has empty space to the left 
 * @param {paddingRight} - the right padding - if the track has empty space to the right  
 * @returns 
 */
function TrackScale({endOfTrack = 0, startOfTrack = 0, width = 100, paddingLeft = 0, paddingRight = 0}) {

    const [normalizer, setNormalizer] = useState([1, 1])

    useEffect(() => {

        let difference = endOfTrack - startOfTrack
        let basePairUnits = (difference / 1000000) > 1 ? [1000000, 'Mb'] : [1000, 'Kb']
        setNormalizer(basePairUnits)
    }, [endOfTrack, startOfTrack])
    if(isFinite(Math.round((3 * (endOfTrack - startOfTrack) / 5 + startOfTrack) / normalizer[0]))){
        return (
            <>
    
            <div className='scale' style={{ width: width, paddingLeft: paddingLeft, paddingRight: paddingRight, float: "left", display: "block" }}>
                    <div width={width - (paddingLeft + paddingRight)} style={{ border: 'solid 1px', marginTop: -5, }} />
                    <Stack direction='row' justifyContent="space-between" className="scale" width={width - paddingLeft * 2}>
                        <div style={{ WebkitUserSelect: 'none', borderLeft: 'solid 2px', marginTop: -4, height: 5 }} >{Math.round(startOfTrack / normalizer[0]) + ' ' + normalizer[1]}</div>
                        <div style={{ WebkitUserSelect: 'none', borderRight: 'solid 2px', marginTop: -4, height: 5 }} >{Math.round(((endOfTrack - startOfTrack) / 5 + startOfTrack) / normalizer[0]) + ' ' + normalizer[1]}</div>
                        <div style={{ WebkitUserSelect: 'none', borderRight: 'solid 2px', marginTop: -4, height: 5 }} >{Math.round((2 * (endOfTrack - startOfTrack) / 5 + startOfTrack) / normalizer[0]) + ' ' + normalizer[1]}</div>
                        <div style={{ WebkitUserSelect: 'none', borderRight: 'solid 2px', marginTop: -4, height: 5, textAlign: 'right' }} >{Math.round((3 * (endOfTrack - startOfTrack) / 5 + startOfTrack) / normalizer[0]) + ' ' + normalizer[1]}</div>
                        <div style={{ WebkitUserSelect: 'none', borderRight: 'solid 2px', marginTop: -4, height: 5, textAlign: 'left' }} >{Math.round((4 * (endOfTrack - startOfTrack) / 5 + startOfTrack) / normalizer[0]) + ' ' + normalizer[1]}</div>
                        <div style={{ WebkitUserSelect: 'none', borderRight: 'solid 2px', marginTop: -4, height: 5 }} >{Math.round(((endOfTrack - startOfTrack) + startOfTrack) / normalizer[0]) + ' ' + normalizer[1]}</div>
                    </Stack>
                </div>
            </>
        )
    }
    else{
        return(
            <>
            <div className='scale' style={{ width: width, paddingLeft: paddingLeft, paddingRight: paddingRight, float: "left", display: "block" }}>
                    <div width={width - (paddingLeft + paddingRight)} style={{ border: 'solid 1px', marginTop: -5, }} />
                    <Stack direction='row' justifyContent="space-between" className="scale" width={width - paddingLeft * 2}>
                        <div style={{ WebkitUserSelect: 'none', borderLeft: 'solid 2px', marginTop: -4, height: 5 }} ></div>
                        <div style={{ WebkitUserSelect: 'none', borderRight: 'solid 2px', marginTop: -4, height: 5 }} ></div>
                        <div style={{ WebkitUserSelect: 'none', borderRight: 'solid 2px', marginTop: -4, height: 5 }} ></div>
                        <div style={{ WebkitUserSelect: 'none', borderRight: 'solid 2px', marginTop: -4, height: 5, textAlign: 'right' }} ></div>
                        <div style={{ WebkitUserSelect: 'none', borderRight: 'solid 2px', marginTop: -4, height: 5, textAlign: 'left' }} ></div>
                        <div style={{ WebkitUserSelect: 'none', borderRight: 'solid 2px', marginTop: -4, height: 5 }} ></div>
                    </Stack>
                </div>
            </>
        )
    }
}

export default TrackScale