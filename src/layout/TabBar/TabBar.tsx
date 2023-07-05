import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {
  useNavigation,
  useNavigationState,
  useRoute,
} from '@react-navigation/native';
import {Typography} from 'components/Typography/Typography';
import React, {useContext, useEffect, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MdIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {AppContext} from 'src/AppContext';

const ClassroomsScreens = [
  {
    name: 'Attendance',
    icon: 'note-multiple',
    route: 'Attendance' as keyof HomeRouterParamList,
  },
  {
    name: 'Reference',
    icon: 'folder-multiple',
    route: 'Reference' as keyof HomeRouterParamList,
  },
];

const ClassroomsRoutes = ['Classrooms'].concat(
  ClassroomsScreens.map(_ => _.name),
);

export const TabBar = (props: BottomTabBarProps) => {
  const screenName = AppContext.navigationRef?.getCurrentRoute()?.name;

  const navigate = useNavigation<HomeProps & ClassroomsProps>();

  
  const handleClick = (route?: keyof HomeRouterParamList) => {
    if (route === undefined) navigate.navigate('Home', {});
    else navigate.navigate(route as any);
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 4},
        shadowRadius: 6,
        shadowOpacity: 0.2,
        elevation: 14,
        columnGap: 49,
      }}>
      <TouchableOpacity
        onPress={() => handleClick()}
        activeOpacity={0.9}
        disabled={screenName === 'Home'}
        style={{alignItems: 'center', display: 'flex'}}>
        <Icon
          color={screenName === 'Home' ? '#5AC0FC' : 'grey'}
          name="home"
          size={25}
        />
        <Typography color={screenName === 'Home' ? '#5AC0FC' : 'grey'}>
          Home
        </Typography>
      </TouchableOpacity>
      {ClassroomsRoutes.includes(screenName ?? '') &&
        ClassroomsScreens.map(_ => (
          <TouchableOpacity
            key={_.name}
            onPress={() => handleClick(_.route)}
            activeOpacity={0.9}
            disabled={screenName === _.name}
            style={{alignItems: 'center', display: 'flex'}}>
            <MdIcon
              color={screenName === _.name ? '#5AC0FC' : 'grey'}
              name={_.icon}
              size={25}
            />
            <Typography color={screenName === _.name ? '#5AC0FC' : 'grey'}>
              {_.name}
            </Typography>
          </TouchableOpacity>
        ))}
    </View>
  );
};
