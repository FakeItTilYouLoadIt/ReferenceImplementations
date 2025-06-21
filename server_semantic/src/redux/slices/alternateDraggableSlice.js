import { createSlice } from "@reduxjs/toolkit";

//! This is currently unused
const initialState={
    // currently a placeholder
    draggables: {
        'test':{
            coordinateY:700,
            key: 'test'
        },
        'secondTest':{
            coordinateY: 800,
            key: 'secondTest'
        }
    }
}

export const alternateDraggableSlice = createSlice({
    name: 'alternateDraggable',
    initialState,

    reducers: {
        moveAlternateDraggable: (state, action) =>{
            state.draggables[action.payload.key].coordinateY = action.payload.coordinateY
        },
        addAlternateDraggable: (state, action) => {
            state.draggables[action.payload.key] = action.payload
        },
        removeAlternateDraggable: (state, action) =>{
            delete state.draggables[action.payload.key]
        }
    }
})

export const {moveAlternateDraggable, addAlternateDraggable, removeAlternateDraggable} = alternateDraggableSlice.actions

export const selectAlternateDraggables = (state) =>  state.alternateDraggable.draggables


export default alternateDraggableSlice.reducer
