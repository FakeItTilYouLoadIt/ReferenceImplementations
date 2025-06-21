
import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    annotations: {

    },
    searches: {

    },
    ortholog: {

    },
}


export const annotationSlice = createSlice({
    name: 'annotation',
    initialState,
    reducers: {
        addAnnotation: (state, action) => {
            if (!state.annotations[action.payload.key]) {
                let chromosomeNumber = action.payload.key.replace(/^\D+/g, '')
                action.payload.chromosome = chromosomeNumber
                state.annotations[action.payload.key] = [action.payload]
               
            }
            else {
                if (state.annotations[action.payload.key].some(x => {
                    return x.note === action.payload.note && x.location === action.payload.location
                })) {
                    return
                }
                let chromosomeNumber = action.payload.key.replace(/^\D+/g, '')
                action.payload.chromosome = chromosomeNumber
                state.annotations[action.payload.key].push(action.payload)
            }

        },
        removeAnnotation: (state, action) => {
            if(state.annotations[action.payload.key]){
                let index = state.annotations[action.payload.key].findIndex(x => {
                    return Math.abs(x.location - action.payload.location) < 100000
                })
                state.annotations[action.payload.key].splice(index,1)
            }
            // let trash = state.annotations[action.payload.key].pop()
        },
        addSearch: (state, action) => {
            if (!state.searches[action.payload.key]) {
                let chromosomeNumber = action.payload.key.replace(/^\D+/g, '')
                action.payload.chromosome = chromosomeNumber
                state.searches[action.payload.key] = [action.payload]
            }
            else {
                if (state.searches[action.payload.key].some(x => {
                    return x.note === action.payload.note && x.location === action.payload.location
                })) {
                    return
                }
                let chromosomeNumber = action.payload.key.replace(/^\D+/g, '')
                action.payload.chromosome = chromosomeNumber
                state.searches[action.payload.key].push(action.payload)
            }
        },
        clearSearches: (state, action) => {
            state.searches = {}
        },
        addOrtholog: (state, action) => {
            if (!state.ortholog[action.payload.key]) {
                state.ortholog[action.payload.key] = [action.payload]
            }
            else {
                if (state.ortholog[action.payload.key].some(x => {
                    return x.note === action.payload.note && x.location === action.payload.location
                })) {
                    return
                }
                state.ortholog[action.payload.key].push(action.payload)
            }

        },
        clearOrthologs: (state, action) => {
            state.ortholog = {}
        },
    }
})

export const { addAnnotation, removeAnnotation, addSearch, clearSearches, addOrtholog, clearOrthologs } = annotationSlice.actions;

export const selectAnnotations = (state) => state.annotation.annotations
export const selectOrthologs = (state) => state.annotation.ortholog
export const selectSearch = (state) => state.annotation.searches
export default annotationSlice.reducer;