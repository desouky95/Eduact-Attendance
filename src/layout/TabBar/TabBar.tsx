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

const ClassroomsScreens = [
  {
    name: 'Home',
    icon: 'home',
    route: 'Classroom' as keyof ClassroomRootTabParamList,
  },

  {
    name: 'Attendance',
    icon: 'clipboard-edit',
    route: 'Attendance' as keyof ClassroomRootTabParamList,
  },
  {
    name: 'Reference',
    icon: 'folder-multiple',
    route: 'Reference' as keyof ClassroomRootTabParamList,
  },
];

export const TabBar = (props: BottomTabBarProps) => {
  const screenName = AppContext.navigationRef?.getCurrentRoute()?.name;
  const {params :{params}} = useRoute<ClassroomScreenProp>();
  const navigate = useNavigation<ClassroomRootProps>();

  const handleClick = (route: keyof ClassroomRootTabParamList) => {
    // navigate.navigate(route as any, {classroom_id: params?.classroom_id});

    navigate.navigate('ClassroomRoot', {
      params: {classroom_id: params.classroom_id},
      screen: route,
    })
  };



  
  return (
    <View
      style={{
        flexDirection: 'row',
        height: 55,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFF',
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 4},
        shadowRadius: 6,
        shadowOpacity: 0.2,
        elevation: 14,
        columnGap: 60,
        paddingHorizontal:58
      }}>
      {ClassroomsScreens.map(_ => (
        <TouchableOpacity
          key={_.name}
          onPress={() => handleClick(_.route)}
          activeOpacity={screenName !== _.route ? 0.6 : 1}
          // disabled={screenName === _.name}
          style={{alignItems: 'center', display: 'flex'}}>
          <MdIcon
            color={screenName === _.route ? '#5AC0FC' : 'grey'}
            name={_.icon}
            size={25}
          />
          <Typography fontSize={8} color={screenName === _.route ? '#5AC0FC' : 'grey'}>
            {_.name}
          </Typography>
        </TouchableOpacity>
      ))}
    </View>
  );
};
