import App from './App';
import React from 'react';
import {SafeAreaView, Text} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {persistor, store} from 'src/store';
import {injectStore} from 'src/api/api';
injectStore(store);
export default function () {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={<Text>Loading...</Text>}>
        <SafeAreaProvider>
          <SafeAreaView style={{flex: 1}}>
            <App />
          </SafeAreaView>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}
