import {Action, PayloadAction, createSlice} from '@reduxjs/toolkit';

type DBSetupState = {
  db_setup_finished: boolean;
  db_first_download_timestamp: number;
  steps: {
    attempts: boolean;
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
    attempts: false,
  },
} as DBSetupState;

const authSlice = createSlice({
  initialState: initialState,
  name: 'user',
  reducers: {
    completeStep: (state, action: PayloadAction<Step>) => {
      state.steps[action.payload] = true;
    },
    setInitialTimestamp: (state, action: PayloadAction<number>) => {
      state.db_first_download_timestamp = action.payload;
    },
    completeDBSetup: state => {
      state.db_setup_finished = true;
    },
    wipeSetup: state => {
      state.steps.classrooms = false;
      state.steps.students = false;
      state.steps.attendance = false;
      state.steps.enrollments = false;
      state.steps.attempts = false;
      state.db_setup_finished = false;
    },
  },
});

export default authSlice.reducer;

export const {completeDBSetup, completeStep, wipeSetup, setInitialTimestamp} =
  authSlice.actions;
