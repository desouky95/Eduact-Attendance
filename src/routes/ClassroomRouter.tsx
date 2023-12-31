import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useFocusEffect} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useEffect, useState} from 'react';
import {getReference} from 'src/database/data/reference.data';
import {TabBar} from 'src/layout/TabBar/TabBar';
import {HomeHeader} from 'src/layout/headers/HomeHeader';
import {AttendanceScreen} from 'src/screens/AttendanceScreen/AttendanceScreen';
import {ClassroomScreen} from 'src/screens/ClassroomScreen/ClassroomScreen';
import {CourseAnalyticsScreen} from 'src/screens/CourseAnalyticsScreen/CourseAnalyticsScreen';
import {ReferenceScreen} from 'src/screens/ReferenceScreen/ReferenceScreen';
import {useAppDispatch, useAppSelector} from 'src/store';
import {setCurrentReference} from 'src/store/courseReducer/courseReducer';

const Tab = createBottomTabNavigator<ClassroomRootTabParamList>();

const ClassroomStack = createNativeStackNavigator();

const ClassroomNavigator = () => (
  <ClassroomStack.Navigator
    screenOptions={{
      header: props => <HomeHeader {...props} />,
    }}>
    <ClassroomStack.Screen name="Classroom" component={ClassroomScreen} />
  </ClassroomStack.Navigator>
);

const CourseAnalyticsStack = createNativeStackNavigator();

const CourseAnalyticsNavigator = () => (
  <CourseAnalyticsStack.Navigator
    screenOptions={{
      header: props => <HomeHeader {...props} />,
    }}>
    <CourseAnalyticsStack.Screen
      name="Analytics"
      component={CourseAnalyticsScreen}
    />
  </CourseAnalyticsStack.Navigator>
);

const AttendanceStack = createNativeStackNavigator();

const AttendanceNavigator = () => (
  <AttendanceStack.Navigator
    screenOptions={{
      header: props => <HomeHeader {...props} />,
    }}>
    <AttendanceStack.Screen name="Attendance" component={AttendanceScreen} />
  </AttendanceStack.Navigator>
);

const ReferenceStack = createNativeStackNavigator();

const ReferenceNavigator = () => (
  <ReferenceStack.Navigator
    screenOptions={{
      header: props => <HomeHeader {...props} />,
    }}>
    <ReferenceStack.Screen name="Reference" component={ReferenceScreen} />
  </ReferenceStack.Navigator>
);

export const ClassroomRoot = (props: ClassroomRootScreenProps) => {
  const current = useAppSelector(s => s.course.current);

  const dispatch = useAppDispatch();

  useFocusEffect(() => {
    const subscription = getReference(current?.sid).observable.subscribe(
      value => {
        dispatch(setCurrentReference(value));
      },
    );
    return () => subscription.unsubscribe();
  });

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('beforeRemove', e => {
      dispatch(setCurrentReference(undefined));
    });

    return () => unsubscribe();
  }, [props.navigation]);
  return (
    <Tab.Navigator
      screenOptions={{headerShown: false}}
      tabBar={props => <TabBar {...props} />}
      initialRouteName="ClassroomStack">
      <Tab.Screen name="ClassroomStack" component={ClassroomNavigator} />
      <Tab.Screen name="AttendanceStack" component={AttendanceNavigator} />
      <Tab.Screen name="ReferenceStack" component={ReferenceNavigator} />
      <Tab.Screen
        name="CourseAnalyticsStack"
        component={CourseAnalyticsNavigator}
      />
    </Tab.Navigator>
  );
};
