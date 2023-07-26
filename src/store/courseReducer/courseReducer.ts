import {Action, PayloadAction, createSlice} from '@reduxjs/toolkit';
import CourseModel from 'src/database/models/Course';
import CourseReferenceModel from 'src/database/models/CourseReferenceModel';

type CourseReducerState = {
  current?: CourseModel;
  currentReference?: CourseReferenceModel;
};

const initialState = {current: undefined} as CourseReducerState;

const courseReducer = createSlice({
  initialState: initialState,
  name: 'user',
  reducers: {
    setCurrent: (state, action: PayloadAction<{current: CourseModel}>) => {
      state.current = action.payload.current;
    },
    setCurrentReference: (
      state,
      action: PayloadAction<CourseReferenceModel>,
    ) => {
      state.currentReference = action.payload;
    },
    flushCurrent: state => {
      state.current = undefined;
      state.currentReference = undefined;
    },
  },
});

export default courseReducer.reducer;

export const {setCurrent, flushCurrent, setCurrentReference} =
  courseReducer.actions;
