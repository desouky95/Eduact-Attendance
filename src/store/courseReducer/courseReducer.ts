import {
  Action,
  PayloadAction,
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';
import ClassroomModel from 'src/database/models/Classroom';
import CourseModel from 'src/database/models/Course';
import CourseReferenceModel from 'src/database/models/CourseReferenceModel';

type CourseReducerState = {
  current?: CourseModel;
  currentReference?: CourseReferenceModel;
  currentClassroom?: ClassroomModel;
};

const initialState = {current: undefined} as CourseReducerState;

export const setCurrentReference = createAsyncThunk<any, CourseReferenceModel | undefined>(
  'setReference',
  payload => {
    return new Promise((resolver, reject) => {
      resolver(payload);
    });
  },
);
const courseReducer = createSlice({
  initialState: initialState,
  name: 'user',
  reducers: {
    setCurrent: (
      state,
      action: PayloadAction<{current: CourseModel; classroom: ClassroomModel}>,
    ) => {
      state.current = action.payload.current;
      state.currentClassroom = action.payload.classroom;
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
  extraReducers(builder) {
    builder.addCase(setCurrentReference.fulfilled, (state, action) => {
      state.currentReference = action.payload;
    });
  },
});

export default courseReducer.reducer;

export const {setCurrent, flushCurrent} = courseReducer.actions;
