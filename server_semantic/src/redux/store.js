import { configureStore } from '@reduxjs/toolkit';
import miniviewReducer from '../features/miniview/miniviewSlice';
import alternateDraggableReducer from './slices/alternateDraggableSlice';
import draggableReducer from './slices/draggableSlice';
import basicTrackReducer from './slices/basicTrackSlice';
import annotationReducer from 'redux/slices/annotationSlice';
import genomeReducer from './slices/genomeSlice';
import trialReducer from './slices/trialSlice';

export const store = configureStore({
  reducer: {
    miniview: miniviewReducer,
    alternateDraggable: alternateDraggableReducer,
    draggable: draggableReducer,
    basictrack : basicTrackReducer,
    annotation: annotationReducer,
    genome: genomeReducer,
    trial: trialReducer,
  },
  middleWare: getDefaultMiddleWare => getDefaultMiddleWare({
    serializableCheck: false,
    immutableCheck: false,
  })
});
