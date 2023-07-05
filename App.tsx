import React, {useEffect, useState} from 'react';
import styled, {ThemeProvider} from 'styled-components/native';
import {WithSplashScreen} from './src/Splash';
import {Router} from 'src/routes/Router';
import {NativeBaseProvider} from 'native-base';
import {theme} from 'src/theme/theme';
import {SnackbarProvider} from 'src/providers/SnackbarProvider/SnackbarProvider';
import 'react-native-reanimated';
import 'react-native-gesture-handler';

function App(): JSX.Element {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    setIsAppReady(true);
  }, []);

  return (
    <WithSplashScreen isAppReady={isAppReady}>
      <NativeBaseProvider theme={theme}>
        <ThemeProvider theme={theme}>
          <SnackbarProvider>
            <Router />
          </SnackbarProvider>
        </ThemeProvider>
      </NativeBaseProvider>
    </WithSplashScreen>
  );
}

export default App;
