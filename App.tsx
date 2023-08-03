import React, {useEffect, useState} from 'react';
import styled, {ThemeProvider} from 'styled-components/native';
import {WithSplashScreen} from './src/Splash';
import {Router} from 'src/routes/Router';
import {NativeBaseProvider} from 'native-base';
import {theme} from 'src/theme/theme';
import 'react-native-reanimated';
import 'react-native-gesture-handler';
import DatabaseProvider from '@nozbe/watermelondb/DatabaseProvider';
import {database} from 'src/database';
import {NetworkStatus} from 'components/NetworkStatus/NetworkStatus';
import ErrorBoundary from 'react-native-error-boundary'
import {SnackbarProvider} from 'src/providers/SnackbarProvider/SnackbarProvider';
import {SyncProvider} from 'src/providers/SyncProvider/SyncProvider';
import {SyncStatus} from 'components/SyncStatus/SyncStatus';

const useSyncState = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [syncFailed, setSyncFailed] = useState(false);

  return {
    isSyncing,
    setIsSyncing,
    syncSuccess,
    syncFailed,
    setSyncFailed,
    setSyncSuccess,
  };
};
function App(): JSX.Element {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    setIsAppReady(true);
  }, []);

  const syncProps = useSyncState();

  return (
    <ErrorBoundary>
      <DatabaseProvider database={database}>
        <WithSplashScreen isAppReady={isAppReady}>
          <NativeBaseProvider theme={theme}>
            <ThemeProvider theme={theme}>
              <SnackbarProvider>
                <SyncProvider {...syncProps}>
                  <SyncStatus />
                  <NetworkStatus />
                  <Router />
                </SyncProvider>
              </SnackbarProvider>
            </ThemeProvider>
          </NativeBaseProvider>
        </WithSplashScreen>
      </DatabaseProvider>
     </ErrorBoundary>
  );
}

export default App;
