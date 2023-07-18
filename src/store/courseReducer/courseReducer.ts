import {Action, PayloadAction, createSlice} from '@reduxjs/toolkit';
import CourseModel from 'src/database/models/Course';

type CourseReducerState = {current?: CourseModel};

const initialState = {current: undefined} as CourseReducerState;

const courseReducer = createSlice({
  initialState: initialState,
  name: 'user',
  reducers: {
    setCurrent: (state, action: PayloadAction<{current: CourseModel}>) => {
      state.current = action.payload.current;
    },
    flushCurrent: state => {
      state.current = undefined;
    },
  },
});

export default courseReducer.reducer;

export const {setCurrent, flushCurrent} = courseReducer.actions;
