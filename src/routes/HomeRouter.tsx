import React from 'react';
import {HomeScreen} from 'src/screens/HomeScreen/HomeScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {HomeHeader} from 'src/layout/headers/HomeHeader';
import {ClassroomRoot} from './ClassroomRouter';
import {StudentsRoot} from './StudentsRouter';
import {ClassroomsScreen} from 'src/screens/ClassroomsScreen/ClassroomsScreen';
import {SettingsScreen} from 'src/screens/SettingsScreen/SettingsScreen';

const Stack = createNativeStackNavigator<HomeRootStackParamList>();

export const HomeRoot = () => (
  <Stack.Navigator
    screenOptions={({navigation, route}) => ({
      animation: 'slide_from_left',
      headerShown: false,
      header: props => <HomeHeader {...props} />,
    })}>
    <Stack.Screen
      name="Home"
      component={HomeScreen}
      options={{headerShown: true}}
    />
    <Stack.Screen
      name="Classrooms"
      component={ClassroomsScreen}
      options={{headerShown: true}}
    />
    <Stack.Screen name="ClassroomRoot" component={ClassroomRoot} />
    <Stack.Screen name="StudentsRoot" component={StudentsRoot} />
    <Stack.Screen
      name="Settings"
      component={SettingsScreen}
      options={{headerShown: true}}
    />
  </Stack.Navigator>
);
