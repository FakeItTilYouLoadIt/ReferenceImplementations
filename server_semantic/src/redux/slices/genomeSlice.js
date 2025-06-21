import { createSlice } from '@reduxjs/toolkit';
import at1_array from '../../data/at1_array';
import at2_array from '../../data/at2_array';
import at3_array from '../../data/at3_array';
import at4_array from '../../data/at4_array';
import at5_array from '../../data/at5_array';
import bn13_array from '../../data/bn13_array'

/**
 * This slice contains the dataset - and should only be modified when a new file is parsed, otherwise only
 * used to fetch data
 */

const initialState = {
    // Currently just a placeholder 
    genome: {
        'coordinate_at1': {
            key: 'at1',
            array: at1_array,
        },
        'coordinate_at2': {
            key: 'at2',
            array: at2_array,
        },
        'coordinate_at3': {
            key: 'at3',
            array: at3_array,
        },
        'coordinate_at4': {
            key: 'at4',
            array: at4_array,
        },
        'coordinate_at5': {
            key: 'at5',
            array: at5_array,
        },
        'coordinate_bn13': {
            key: 'bn13',
            array: bn13_array,
        },
    },
}


export const genomeSlice = createSlice({
    name: 'genome',
    initialState,

    reducers: {

        addGenome: (state, action) => {
            if (!state.genome[action.payload.key]) {
                state.genome[action.payload.key] = action.payload
            }
            else{
                state.genome[action.payload.key].array = action.payload.array
            }
        },
        removeGenome: (state, action) => {
            delete state.genome[action.payload.key]
        },
        setSelection: (state, action) => {
            state.genome[action.payload.key].selection = action.payload.selection
        },
        clearSelection: (state, action) => {
            state.genome[action.payload.key].selection = undefined
        },
        deleteAllGenome: (state, action) => {
            state.genome = {}
        },
    }
})


export const { addGenome, removeGenome, setSelection, clearSelection, deleteAllGenome } = genomeSlice.actions;


export const selectGenome = (state) => state.genome.genome

export default genomeSlice.reducer;