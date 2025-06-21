import { useRef } from "react"
import { useDrag, useDrop } from "react-dnd"
import { ItemTypes } from "./ItemTypes"
import { useDispatch } from "react-redux"
import { moveAlternateDraggable } from "../../redux/slices/alternateDraggableSlice"
import DragHandleIcon from '@mui/icons-material/DragHandle';
import { IconButton } from "@mui/material"
import { teal } from '@mui/material/colors';

//! This is currently unused
const AlternateDraggable = ({ children,  initialY, id, index, spacing, top, width, ...props }) => {
    
    // Two refs needed - one for handle, one for preview
    const ref = useRef(null)
    const previewRef = useRef(null)

    const dispatch = useDispatch()
    
    // function for changing the y-coordinate of the draggable
    const adjustY = (item, monitor) =>{

        let coordinate = monitor.getClientOffset()
       
        let delta = monitor.getDifferenceFromInitialOffset()

        let gap;
        spacing === undefined ? gap = 4 : gap = spacing

        let ceiling;
        top === undefined ? ceiling = 0 : ceiling = top
        

        if(coordinate !== null){  

            let reference = ref.current.offsetParent
            let top = reference.offsetTop
            let hoverBoundingRect = ref.current?.getBoundingClientRect();

            let hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
            let height = hoverBoundingRect.bottom - hoverBoundingRect.top + gap

            let increment = Math.round((top - hoverMiddleY)/height)
            
            let newLocation = Math.max((increment + Math.round(delta.y/height))*height, ceiling)

            dispatch(moveAlternateDraggable({
                key: id,
                coordinateY: newLocation,
            }))

        }
    }

    // Drag function
 const [{ isDragging }, drag, preview] = useDrag(
    () => ({
        type: ItemTypes.FREE,
        item: () => { return { id, index} },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
        end: (item, monitor) => (
            adjustY(item, monitor)
        ),
    }), []
)

// Empty drop function -> prevents another draggable from being placed on top
const [, drop] = useDrop(
    ()=>({
        accept: ItemTypes.FREE,
        drop(_item,monitor){},
    })
)
    let opacity = isDragging ? 0.5 : 1

    drag(ref)
    drop(preview(previewRef))



    return (
    <div ref={previewRef} className='alternateDraggable' style={{position:'absolute', top: initialY}} {...props}>
        <div className='draggableItem' style=
            {{
                opacity: opacity,
            }}>
            {children}
        </div>
        <IconButton ref={ref} className='handle' variant='contained' 
        sx={{
        backgroundColor: teal[100],
        borderRadius: 1,
        '&:hover':{
            backgroundColor: teal[500]
        }
    }
    } 
    >
        <DragHandleIcon fontSize="small" className="handle_image" />
    </IconButton>
    </div>

    )
}


export default AlternateDraggable;