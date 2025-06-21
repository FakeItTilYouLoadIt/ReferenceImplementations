
import React from "react"
import { useDrag, useDrop } from "react-dnd"
import { ItemTypes } from "./ItemTypes"
import { useRef, useState } from "react"
import { useDispatch } from "react-redux"
import { switchDraggable, toggleGroup, clearGroup, insertDraggable, sortGroup, selectDraggables, setDraggables } from "../../redux/slices/draggableSlice"
import { IconButton } from "@mui/material"
import { teal } from '@mui/material/colors';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import { useSelector } from "react-redux"


/**
 * Container for draggable components. Should render any children and provide a button on the right to re-arrange
 * the component. Used in conjunction with "DragContainer" component.
 */
const Draggable = ({ children, id, index, grouped, groupID, className, dragGroup, isDark }) => {

    // One ref for handle, one for preview
    const ref = useRef(null)
    const secondRef = useRef(null)

    const dispatch = useDispatch()
    const draggableSelector = useSelector(selectDraggables)[dragGroup]

    let [waiting, setWaiting] = useState()
    let [change, setChange] = useState()
    // let [component, setComponent] = useState()


    const component = children.type.name === "Track" ? children.props.renderTrack : children.type.name

    function updateTimer() {
        clearTimeout(waiting)
        setWaiting(window.setTimeout(() => {
            setChange(true)
        }, 500))
    }

    // useEffect(()=>{
    //     console.log("?")
    //     console.log(children.props.renderTrack )
    //     setComponent(children.type.name == "TrackContainer" ? children.props.renderTrack : children.type.name)
    // },[children.props.renderTrack])


    const [, drop] = useDrop(() => ({
        accept: ItemTypes.BOUNDED,
        hover(item, monitor) {


            if (!ref.current) return

            const dragIndex = item.index
            const hoverIndex = index

            const hoverBoundingRect = ref.current?.getBoundingClientRect();

            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

            const clientOffset = monitor.getClientOffset()
            const hoverClientY = clientOffset.y - hoverBoundingRect.top

            // Dragging downwards
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return
            }
            // Dragging upwards
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return
            }

            // Updating the redux store - using conditional to keep calls to a minimum
            if (dragIndex !== hoverIndex) {
                dispatch(switchDraggable({
                    dragGroup: dragGroup,
                    startKey: item.id,
                    switchKey: id
                })
                )

                if (!grouped) {
                    // If outside the group, the entire group needs to be moved as opposed to just switching two
                    let offset = 1;
                    groupID.forEach((x) => {
                        if (x !== item.id) {
                            dispatch(insertDraggable({
                                dragGroup: dragGroup,
                                startKey: item.id,
                                id: x,
                                index: offset
                            })
                            )
                            offset += 1;
                        }
                    })
                }
                dispatch(sortGroup())
            }
            // Need to change the item's index or it can't be placed back in the original position due to the conditional
            item.index = hoverIndex
        },
    }), [index, groupID])

    // Drag function - preview used if not using custom drag layer
    const [{ isDragging }, drag, preview] = useDrag(
        () => ({
            type: ItemTypes.BOUNDED,
            item: () => { return { id, index, grouped, groupID, ref, className, dragGroup, component } },
            collect: (monitor) => ({
                isDragging: !!monitor.isDragging(),
            }),
        }), []
    )

    const opacity = isDragging ? 0.6 : 1
    const highlightGroup = grouped ? ".25rem solid" + teal[500] : undefined
    const borderGroup = grouped ? "outset" : "none"

    drag(drop(ref))

    //#############################
    // Used without CustomDragLayer
    // drop(preview(secondRef))

    // Used with CustomDragLayer
    drop((secondRef))
    //###################################


    if (window.gt && change) {
        window.gt.updateState({ Action: "handleDragged", order: draggableSelector, id: id })
        setChange()
    }

    if (window.gt) {
        window.gt.on('state_updated_reliable', (userID, payload) => {
            // TODO this feels like a hacky way of doing this
            if (userID === document.title) return
            if (payload.Action === "handleDragged") {
                if (payload.id !== id) return
                dispatch(setDraggables({
                    dragGroup,
                    order: payload.order
                }))
            }
        })
    }

    return (
        <div ref={secondRef} className={className}>
            <div className={'draggableItem'} style=
                {{
                    opacity: opacity,
                    borderStyle: borderGroup,
                    border: highlightGroup,
                    // display: "flex"
                }}>
                {children}
            </div>
            <IconButton ref={ref} className={'handle'} sx={{
                backgroundColor: isDark ? teal[500] : teal[100],
                borderRadius: 1,
                '&:hover': {
                    backgroundColor: isDark ? teal[200] : teal[500]
                }
            }}
                onClick={(e) => {
                    if (!e.ctrlKey && !grouped) {
                        dispatch(clearGroup())
                    }
                    else {
                        if (!e.ctrlKey) return
                        dispatch(toggleGroup({
                            id: id
                        }))
                        dispatch(sortGroup())
                    }

                }}
                onMouseDown={(e) => {
                    if (!e.ctrlKey && !grouped) {
                        dispatch(clearGroup())
                    }
                    if (window.gt) {
                        updateTimer()
                    }
                }}
            >
                <DragHandleIcon fontSize="small" className="handle_image" />
            </IconButton>
        </div >

    )
}

export default Draggable;