import {Action, PayloadAction, createSlice} from '@reduxjs/toolkit';
import ClassroomModel from 'src/database/models/Classroom';
import CourseModel from 'src/database/models/Course';
import CourseReferenceModel from 'src/database/models/CourseReferenceModel';

type CourseReducerState = {
  current?: CourseModel;
  currentReference?: CourseReferenceModel;
  currentClassroom?:ClassroomModel
};

const initialState = {current: undefined} as CourseReducerState;

const courseReducer = createSlice({
  initialState: initialState,
  name: 'user',
  reducers: {
    setCurrent: (state, action: PayloadAction<{current: CourseModel , classroom : ClassroomModel}>) => {
      state.current = action.payload.current;
      state.currentClassroom = action.payload.classroom
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
