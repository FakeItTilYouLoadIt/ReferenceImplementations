
import { createSlice } from '@reduxjs/toolkit';
import { scaleLinear } from 'd3-scale';


// Could use a reference to a track. This would just need to hold the coordinates and the offset.
// Would look very similar to the basic track


const initialState = {
    // Currently just a placeholder 
    miniviews: {
        'newPreview': {
            color: 0,
            coordinateX: 0,
            coordinateY: 0,
            height: '1rem',
            width: 400,
            id: 'newPreview',
            visible: false,
            trackType: 'default',
            linkedTrack: undefined,
            offset: 0,
        },

    },
    comparison: {}
}


export const miniviewSlice = createSlice({
    name: 'miniview',
    initialState,

    reducers: {

        addMiniview: (state, action) => {
            if (!state.miniviews[action.payload.key]) {
                state.miniviews[action.payload.key] = action.payload
            }
        },
        removeMiniview: (state, action) => {
            delete state.miniviews[action.payload.key]
        },
        moveMiniview: (state, action) => {
            state.miniviews[action.payload.key].coordinateX = action.payload.coordinateX
            state.miniviews[action.payload.key].coordinateY = action.payload.coordinateY
            state.miniviews[action.payload.key].viewFinderY = action.payload.viewFinderY
            state.miniviews[action.payload.key].viewFinderX = action.payload.viewFinderX
        },
        updateData: (state, action) => {
            state.miniviews[action.payload.key].array = action.payload.array
            state.miniviews[action.payload.key].trackType = action.payload.trackType
            if (action.payload.start !== undefined) {
                state.miniviews[action.payload.key].start = action.payload.start
            }
            if (action.payload.end !== undefined) {
                state.miniviews[action.payload.key].end = action.payload.end
            }
            if (action.payload.boxWidth !== undefined) {
                state.miniviews[action.payload.key].boxWidth = action.payload.boxWidth
            }
        },
        changeMiniviewColor: (state, action) => {
            state.miniviews[action.payload.key].color = action.payload.color
        },
        changeMiniviewVisibility: (state, action) => {
            state.miniviews[action.payload.key].visible = action.payload.visible
        },
        addComparison: (state, action) => {
            if(!state.comparison[action.payload.target]){
                state.comparison[action.payload.target] = []
            }
            state.comparison[action.payload.target].push(action.payload)

        },
        removeComparison: (state, action) => {
            let popped = state.comparison[action.payload.target].pop()
        },
        panComparison: (state, action) => {
            for (const [key, value] of Object.entries(state.comparison)) {
                if (value.target == action.payload.key) {

                    //  ! Close - off by a little
                    value.boxWidth *= action.payload.factor
                    let location = scaleLinear().domain([0, +value.fin]).range([0,(action.payload.realWidth * action.payload.zoom)])
                    value.coordinateX = location(value.start) + (action.payload.left + action.payload.offset) * action.payload.realWidth/action.payload.width
                }
            }
        },
        zoomComparison: (state, action) =>{
            
         for (const [key, value] of Object.entries(state.comparison)) {
            if (value.target == action.payload.key) {
                value.boxWidth *= action.payload.factor
            }
        }
        },
        clearComparisons: (state, action) =>{
            state.comparison.length = 0;
        },

        movePreview: (state, action) => {
            state.miniviews['newPreview'].coordinateX = action.payload.coordinateX
            state.miniviews['newPreview'].coordinateY = action.payload.coordinateY
            state.miniviews['newPreview'].viewFinderY = action.payload.viewFinderY
            state.miniviews['newPreview'].viewFinderX = action.payload.viewFinderX
            state.miniviews['newPreview'].viewFinderWidth = action.payload.viewFinderWidth
            state.miniviews['newPreview'].center = action.payload.center
        },
        updatePreview: (state, action) => {
            state.miniviews['newPreview'].linkedTrack = action.payload.track
            state.miniviews['newPreview'].cap = action.payload.cap
        },
        changePreviewVisibility: (state, action) => {
            state.miniviews['newPreview'].visible = action.payload.visible
        },
        moveCollabPreview: (state, action) => {

            if(! state.miniviews[action.payload.user]) state.miniviews[action.payload.user] = {}
                state.miniviews[action.payload.user].center = action.payload.center
                state.miniviews[action.payload.user].track = action.payload.track
                state.miniviews[action.payload.user].trackType = action.payload.trackType
                state.miniviews[action.payload.user].cursorColor = action.payload.cursorColor
            
        },


    }
})

export const { moveCollabPreview, addMiniview, removeMiniview, moveMiniview, updateData, changeMiniviewColor, changeMiniviewVisibility, addComparison, removeComparison, increaseZoom, decreaseZoom, pan, panComparison, zoomComparison, clearComparisons, movePreview, updatePreview, changePreviewVisibility } = miniviewSlice.actions;

export const selectMiniviews = (state) => state.miniview.miniviews
export const selectComparison = (state) => state.miniview.comparison

export default miniviewSlice.reducer;