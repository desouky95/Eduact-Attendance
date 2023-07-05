import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import {LoginScreen} from '../screens/LoginScreen/LoginScreen';

import {
  useFlipper,
  useReduxDevToolsExtension,
} from '@react-navigation/devtools';
import {AppContext} from 'src/AppContext';
import {useAppSelector} from 'src/store';
import {HomeRoot} from './HomeRouter';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const Router = () => {
  const navigationRef = useNavigationContainerRef();

  useReduxDevToolsExtension(navigationRef);

  const {isLogged, user} = useAppSelector(s => s.auth);

  // console.log({isLogged});
  console.log({user});
  return (
    <NavigationContainer ref={ref => (AppContext.navigationRef = ref as any)}>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        // initialRouteName={!isLogged ? 'Login' : 'HomeRoot'}
      >
        {!isLogged ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <Stack.Screen
            name="HomeRoot"
            component={HomeRoot}
            options={{
              headerShown: false,
            }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
