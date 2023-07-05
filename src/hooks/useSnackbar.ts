import React, {useContext} from 'react';
import {SnackbarContext} from 'src/providers/SnackbarProvider/SnackbarProvider';

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) throw new Error('No SnackbarProvider found !!!');

  return context;
};
