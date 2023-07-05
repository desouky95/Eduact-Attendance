import {Text} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {HomeScreen} from 'src/screens/HomeScreen/HomeScreen';
import {ClassroomsScreen} from 'src/screens/ClassroomsScreen/ClassroomsScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {TabBar} from 'src/layout/TabBar/TabBar';
import {HomeHeader} from 'src/layout/headers/HomeHeader';
import {StudentsScreen} from 'src/screens/StudentsScreen/StudentsScreen';
import {ClassroomScreen} from 'src/screens/ClassroomScreen/ClassroomScreen';
import {AttendanceScreen} from 'src/screens/AttendanceScreen/AttendanceScreen';
import {ReferenceScreen} from 'src/screens/ReferenceScreen/ReferenceScreen';
import {DownloadingScreen} from 'src/screens/DownloadingScreen/DownloadingScreen';

const Tab = createBottomTabNavigator<ClassroomRootTabParamList>();
const Stack = createNativeStackNavigator<HomeRootStackParamList>();

export const HomeRoot = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        header: HomeHeader,
        animation: 'slide_from_left',
      }}>
      <Stack.Screen name="Downloading" component={DownloadingScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Classrooms" component={ClassroomsScreen} />
      <Stack.Screen name="Students" component={StudentsScreen} />
      <Stack.Screen name="ClassroomRoot" component={ClassroomRoot} />
    </Stack.Navigator>
  );
};

const ClassroomRoot = () => (
  <Tab.Navigator
    screenOptions={{headerShown: false}}
    // tabBar={TabBar}
    initialRouteName="Classroom">
    <Tab.Screen name="Classroom" component={ClassroomScreen} />
    <Tab.Screen name="Attendance" component={AttendanceScreen} />
    <Tab.Screen name="Reference" component={ReferenceScreen} />
  </Tab.Navigator>
);
