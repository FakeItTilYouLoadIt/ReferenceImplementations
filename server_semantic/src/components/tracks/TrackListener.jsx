/** @jsxImportSource @emotion/react */
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectBasicTracks, removeBasicTrack, toggleTrackType, changeBasicTrackColor, changeMatchingBasicTrackColor } from '../../redux/slices/basicTrackSlice'
import { removeDraggable } from 'redux/slices/draggableSlice'
import { useState, useEffect } from 'react'
import { ChromePicker } from 'react-color'
import { css } from '@emotion/react';
import Select from 'react-select'

/**
 * Listens for events from the "TrackControls" component - not very React-ful - but when generating
 * a lot of tracks the event handlers get out of hand
 */

const TrackListener = ({ children, style, isDark = false }) => {

    const basicTrackSelector = useSelector(selectBasicTracks)
    const dispatch = useDispatch()

    const [showTypeOptions, setshowTypeOptions] = useState(false)
    const [showTypeLocation, setshowTypeLocation] = useState({ x: 0, y: 0 })
    const [showTypeSelection, setshowTypeSelection] = useState()
    const [showColorPicker, setColorPickerVisibility] = useState(false)
    const [colorPickerColor, setColorPickerColor] = useState()
    const [colorPickerSelection, setColorPickerSelection] = useState()
    const [colorPickerLocation, setColorPickerLocation] = useState({ x: 0, y: 0 })
    const trackTypes = ['heatmap', 'histogram', 'scatter', 'line']
    let options = trackTypes.map(d => ({
        "value": d,
        "label": d
    }))
    function handleChange(e) {
        dispatch(toggleTrackType({ 'id': showTypeSelection, 'type': e.value }))
        setshowTypeOptions(false)
    }

    //! For eye tracking demo
    useEffect(() => {
        window.timing = [{ "start": Date.now() }]
    }, [])

    function logKey(e) {
        //! Trial Logic ##################################
        window.timing.push({"key_pressed" : [e.code, Date.now()]})
        //! Trial Logic #################################
    }
    function handleClick(e) {
        let goal = e.target
        while (goal) {
            if (goal.id === 'eventListener') return
            else if (goal.type === 'button') {
                break
            }
            goal = goal.parentElement
        }
        if (!goal) return
        let buttonInfo = goal.id.split(/_(.*)/s)
        // debugger
        switch (buttonInfo[0]) {
            case "deleteTrack":
                dispatch(removeDraggable({ 'key': buttonInfo[1] }))
                dispatch(removeBasicTrack({ 'key': buttonInfo[1] }))
                break
            case "toggleTrackType":
                setshowTypeOptions(true)
                setshowTypeSelection(buttonInfo[1])
                let buttonsLocation = goal.getBoundingClientRect()
                setshowTypeLocation({ x: buttonsLocation.x, y: buttonsLocation.y + document.documentElement.scrollTop })
                // dispatch(toggleTrackType({ 'id': buttonInfo[1] }))
                break
            case "pickColor":
                setColorPickerVisibility(true)
                setColorPickerColor(basicTrackSelector[buttonInfo[1]].color)
                setColorPickerSelection(buttonInfo[1])
                let buttonLocation = goal.getBoundingClientRect()
                setColorPickerLocation({ x: buttonLocation.x, y: buttonLocation.y + document.documentElement.scrollTop })
                break
            default:
                setColorPickerVisibility(false)
                setshowTypeOptions(false)
        }
    }


    let styling = css(css`
    .popover {
            position: absolute;
            z-index: 5;
            left: ${colorPickerLocation ? colorPickerLocation.x - 200 + 'px' : 0};
            top: ${colorPickerLocation ? colorPickerLocation.y - 200 + 'px' : 0};
            color: red;
            background: green;
        }
    .Typepopover {
        position: absolute;
        z-index: 5;
        left: ${showTypeLocation ? showTypeLocation.x - 10 + 'px' : 0};
        top: ${showTypeLocation ? showTypeLocation.y + 'px' : 0};
    }
    .trackmenu {
        background-color: ${isDark ? "black" : "white"};
        background: ${isDark ? "black" : "white"};
        color: ${isDark ? "white" : "black"};
    }
    }`)



    const cover = {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
    }

    let x = colorPickerLocation ? colorPickerLocation.x - 200 + 'px' : 0
    let y = colorPickerLocation ? colorPickerLocation.y - 200 + 'px' : 0

    return (
        <div css={styling} style={style} onClick={handleClick} id="eventListener" onKeyPress={logKey}>
            {showColorPicker ? <div className="popover">
                <div style={cover} onClick={(e) => { setColorPickerVisibility(false) }} />
                <ChromePicker className="trackmenu" disableAlpha={true} color={{ 'hex': colorPickerColor }} onChangeComplete={(c) => {
                    dispatch(changeMatchingBasicTrackColor({ 'key': colorPickerSelection, 'color': c.hex }))
                    setColorPickerColor(c.hex)
                }} />
            </div> : null}
            {showTypeOptions ? <div className="Typepopover">
                <div style={cover} onClick={(e) => { setshowTypeOptions(false) }} />
                <Select
                    // className="trackmenu" 
                    options={options}
                    onChange={handleChange}
                    MenuProps={{
                        PaperProps: {
                            sx: {
                                bgcolor: 'pink',
                                '& .MuiMenuItem-root': {
                                    padding: 2,
                                },
                            },
                        },
                    }}
                />

            </div> : null}
            {children}
        </div>
    )
}

export default TrackListener
