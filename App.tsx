import React, {useEffect, useState} from 'react';
import styled, {ThemeProvider} from 'styled-components/native';
import {WithSplashScreen} from './src/Splash';
import {Router} from 'src/routes/Router';
import {NativeBaseProvider} from 'native-base';
import {theme} from 'src/theme/theme';
import {SnackbarProvider} from 'src/providers/SnackbarProvider/SnackbarProvider';
import 'react-native-reanimated';
import 'react-native-gesture-handler';
import DatabaseProvider from '@nozbe/watermelondb/DatabaseProvider';
import {database} from 'src/database';
import {useAppSelector} from 'src/store';

function App(): JSX.Element {
  const [isAppReady, setIsAppReady] = useState(false);
  const isLogged = useAppSelector(s => s.auth.isLogged);
  const {db_setup_finished} = useAppSelector(s => s.db);
  useEffect(() => {
    setIsAppReady(true);
  }, []);

  return (
    <DatabaseProvider database={database}>
      <WithSplashScreen isAppReady={isAppReady}>
        <NativeBaseProvider theme={theme}>
          <ThemeProvider theme={theme}>
            <SnackbarProvider>
              <Router />
            </SnackbarProvider>
          </ThemeProvider>
        </NativeBaseProvider>
      </WithSplashScreen>
    </DatabaseProvider>
  );
}

export default App;
