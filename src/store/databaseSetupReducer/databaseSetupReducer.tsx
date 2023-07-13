import {Action, PayloadAction, createSlice} from '@reduxjs/toolkit';

type DBSetupState = {
  db_setup_finished: boolean;
  steps: {
    classrooms: boolean;
  };
};

export type Step = keyof DBSetupState['steps'];

const initialState = {
  db_setup_finished: false,
  steps: {
    classrooms: false,
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
    },
    wipeSetup: state => {
      state.steps.classrooms = false;
      state.db_setup_finished = false;
    },
  },
});

export default authSlice.reducer;

export const {completeDBSetup, completeStep, wipeSetup} = authSlice.actions;
