import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    // currently a placeholder
    draggables: ['coordinate_at1', 'coordinate_at2', 'coordinate_at3', 'links', 'coordinate_at4', 'coordinate_at5', ],
    ortholog: [],
    group: [],
    sorted: false,
}

export const draggableSlice = createSlice({
    name: 'draggable',
    initialState,

    reducers: {
        moveDraggable: (state, action) => {
            state[action.payload.dragGroup][action.payload.key].index = action.payload.index

        },
        addDraggable: (state, action) => {
            if(!state[action.payload.dragGroup][action.payload.key]){
                state[action.payload.dragGroup].push(action.payload.key)
            }
        },

        removeDraggable: (state, action) => {
            Object.keys(state).forEach(z => {
                if(state[z].length > 0){
                    state[z].forEach(x => {
                        let index = state[z].indexOf(action.payload.key)
                        if(index > -1){
                            state[z].splice(index, 1)
                        }
                    })
                }
            })
        },
        switchDraggable: (state, action) => {
                // Switch Index is passed in, but the index of the item being dragged is... fuzzier. Better to take it from the store
                let switchIndex = state[action.payload.dragGroup].indexOf(action.payload.switchKey)
                let startIndex = state[action.payload.dragGroup].indexOf(action.payload.startKey)
                let startKey = action.payload.startKey
                state[action.payload.dragGroup].splice(startIndex, 1)
                state[action.payload.dragGroup].splice(switchIndex,0, startKey)
    
                if(state.group.length > 1){
                    state.group.sort((a,b)=> state[action.payload.dragGroup].indexOf(a) - state[action.payload.dragGroup].indexOf(b))
                }
        },
        insertDraggable: (state, action) => {
            let moving = state[action.payload.dragGroup].indexOf(action.payload.id)
            let reference = state[action.payload.dragGroup].indexOf(action.payload.startKey)
            let index = reference > moving ? -1 : action.payload.index
            state[action.payload.dragGroup].splice(moving,1)
            state[action.payload.dragGroup].splice(reference + index, 0, action.payload.id)
            
        }
        ,
        toggleGroup: (state, action) => {
            let index = state.group.indexOf(action.payload.id);
        
            index > -1 ? state.group.splice(index, 1) : state.group.push(action.payload.id);
        },
        clearGroup: (state, action) => {
            state.group.length = 0;
        },
        sortGroup: (state, action) => {
            if(state.group.length > 1){
                state.group.sort((a,b)=> state[action.payload.dragGroup].indexOf(a) - state[action.payload.dragGroup].indexOf(b))
            }
        },
        deleteAllDraggables: (state, action) => {
            state[action.payload.dragGroup].length = 0
            state.group.length = 0
        },
        setDraggables: (state, action) => {
            state[action.payload.dragGroup].length = 0
            state[action.payload.dragGroup] = action.payload.order
        },
        clearDraggables: (state, action) => {
            state[action.payload.dragGroup].length = 0

        },
        sortDraggables: (state, action) => {

            if(state.sorted){
                // Sorts into groups based on track type (using similarity of name)
                state[action.payload.dragGroup].sort((a,b) => {
                   return a.length - b.length || a.localeCompare(b)
                })
            }
            else{
                // Sorts into groups based on chromosome number ( using the number found in name)
                state[action.payload.dragGroup].sort((a,b) => {
                    let numberA = a.split("_")[1].replace(/^\D+/g, '')
                    let numberB = b.split("_")[1].replace(/^\D+/g, '')
                    return numberA.length - numberB.length || numberA.localeCompare(numberB)
                 })
            }
            state.sorted = !state.sorted
        }

    }
})

export const { sortDraggables, deleteAllDraggables, clearDraggables, moveDraggable, addDraggable, removeDraggable, switchDraggable, insertDraggable, toggleGroup, clearGroup, sortGroup, setDraggables } = draggableSlice.actions

export const selectDraggables = (state) => state.draggable
export const selectGroup = (state) => state.draggable.group



export default draggableSlice.reducer
