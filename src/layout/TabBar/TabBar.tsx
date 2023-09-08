import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {
  useNavigation,
  useNavigationState,
  useRoute,
} from '@react-navigation/native';
import {Typography} from 'components/Typography/Typography';
import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MdIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {AppContext} from 'src/AppContext';
import {useWindowDimensions} from 'react-native';

const ClassroomsScreens = [
  {
    name: 'Students',
    icon: 'account-group',
    route: 'ClassroomStack' as keyof ClassroomRootTabParamList,
    screenName: 'Students',
  },
  {
    name: 'Analytics',
    icon: 'google-analytics',
    route: 'CourseAnalyticsStack' as keyof ClassroomRootTabParamList,
    screenName: 'Analytics',
  },

  {
    name: 'Attendance',
    icon: 'clipboard-edit',
    route: 'AttendanceStack' as keyof ClassroomRootTabParamList,
    screenName: 'Attendance',
  },
  {
    name: 'Reference',
    icon: 'folder-multiple',
    route: 'ReferenceStack' as keyof ClassroomRootTabParamList,
    screenName: 'Reference',
  },
];

export const TabBar = (props: BottomTabBarProps) => {
  const screenName = AppContext.navigationRef?.getCurrentRoute()?.name;
  const {
    params: {params},
  } = useRoute<ClassroomScreenProp>();
  const navigate = useNavigation<ClassroomRootProps>();

  const handleClick = (route: keyof ClassroomRootTabParamList) => {
    // navigate.navigate(route as any, {classroom_id: params?.classroom_id});

    navigate.navigate('ClassroomRoot', {
      params: {current: params.current},
      screen: route,
    });
  };

  const {width} = useWindowDimensions();

  return (
    <View
      style={{
        flexDirection: 'row',
        height: 55,
        position: 'relative',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFF',
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 4},
        shadowRadius: 6,
        shadowOpacity: 0.2,
        elevation: 14,
        columnGap: 60,
        paddingHorizontal: 0.058 * width,
      }}>
      {ClassroomsScreens.map(_ => {
        return (
          <TouchableOpacity
            key={_.name}
            onPress={() => handleClick(_.route)}
            activeOpacity={screenName !== _.screenName ? 0.6 : 1}
            // disabled={screenName === _.name}
            style={{alignItems: 'center', display: 'flex'}}>
            <MdIcon
              color={screenName === _.screenName ? '#5AC0FC' : 'grey'}
              name={_.icon}
              size={25}
            />
            <Typography
              fontSize={8}
              color={screenName === _.screenName ? '#5AC0FC' : 'grey'}>
              {_.name}
            </Typography>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
