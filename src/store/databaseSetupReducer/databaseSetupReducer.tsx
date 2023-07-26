import {Action, PayloadAction, createSlice} from '@reduxjs/toolkit';

type DBSetupState = {
  db_setup_finished: boolean;
  db_first_download_timestamp: number;
  steps: {
    classrooms: boolean;
    students: boolean;
    attendance: boolean;
    enrollments: boolean;
  };
};

export type Step = keyof DBSetupState['steps'];

const initialState = {
  db_setup_finished: false,
  db_first_download_timestamp: 0,
  steps: {
    classrooms: false,
    students: false,
    attendance: false,
    enrollments: false,
  },
} as DBSetupState;

const authSlice = createSlice({
  initialState: initialState,
  name: 'user',
  reducers: {
    completeStep: (state, action: PayloadAction<Step>) => {
      state.steps[action.payload] = true;
    },
    completeDBSetup: state => {
      state.db_setup_finished = true;
      state.db_first_download_timestamp = Date.now();
    },
    wipeSetup: state => {
      state.steps.classrooms = false;
      state.steps.students = false;
      state.steps.attendance = false;
      state.steps.enrollments = false;
      state.db_setup_finished = false;
    },
  },
});

export default authSlice.reducer;

export const {completeDBSetup, completeStep, wipeSetup} = authSlice.actions;
