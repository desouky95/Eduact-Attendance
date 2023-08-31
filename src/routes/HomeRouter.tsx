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
import {useAppDispatch, useAppSelector} from 'src/store';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {getReference} from 'src/database/data/reference.data';
import {
  flushCurrent,
  setCurrentReference,
} from 'src/store/courseReducer/courseReducer';
import {StudentHistoryScreen} from 'src/screens/StudentHistoryScreen/StudentHistoryScreen';

const Tab = createBottomTabNavigator<ClassroomRootTabParamList>();
const StudentsStack = createNativeStackNavigator<StudentsRootTabParamList>();
const Stack = createNativeStackNavigator<HomeRootStackParamList>();

export const HomeRoot = () => {
  return (
    <Stack.Navigator
      screenOptions={({navigation, route}) => ({
        animation: 'slide_from_left',
        header: props => <HomeHeader {...props} />,
      })}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ClassroomRoot" component={ClassroomRoot} />
      <Stack.Screen
        name="StudentsRoot"
        component={StudentsRoot}
        // options={({}) => ({headerShown: false})}
      />
    </Stack.Navigator>
  );
};

const ClassroomRoot = () => {
  const current = useAppSelector(s => s.course.current);

  const dispatch = useAppDispatch();

  useFocusEffect(() => {
    const subscription = getReference(current?.sid).subscribe(value => {
      dispatch(setCurrentReference(value));
    });
    return () => {
      subscription.unsubscribe();
      // dispatch(flushCurrent());
    };
  });

  return (
    <Tab.Navigator
      // screenOptions={{headerShown: false}}
      // tabBar={props => <TabBar {...props} />}
      tabBar={props => <TabBar {...props} />}
      initialRouteName="Classroom">
      <Tab.Screen name="Classroom" component={ClassroomScreen} />
      <Tab.Screen name="Attendance" component={AttendanceScreen} />
      <Tab.Screen name="Reference" component={ReferenceScreen} />
    </Tab.Navigator>
  );
};

const StudentsRoot = () => {
  return (
    <StudentsStack.Navigator
      screenOptions={({navigation}) => ({
        headerShown: false,
      })}
      // tabBar={props => <TabBar {...props} />}

      initialRouteName="Students">
      <StudentsStack.Screen name="Students" component={StudentsScreen} />
      <StudentsStack.Screen
        options={({navigation, route}) => ({})}
        name="StudentHistory"
        component={StudentHistoryScreen}
      />
    </StudentsStack.Navigator>
  );
};
