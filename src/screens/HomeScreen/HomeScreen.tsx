import {Link, useNavigation} from '@react-navigation/native';
import {homeBackground} from 'assets/index';
import {Spacer} from 'components/Spacer/Spacer';
import {Typography} from 'components/Typography/Typography';
import {ZStack} from 'native-base';
import React from 'react';
import {Button} from 'react-native';
import {
  ImageBackground,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';
// import {TouchableHighlight, TouchableOpacity} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {getClassrooms} from 'src/api/classroom/classroom.api';
import {getStudents} from 'src/api/students/students.api';
import {database} from 'src/database';
import {persistor, store, useAppDispatch, useAppSelector} from 'src/store';
import {logout} from 'src/store/authReducer/authReducer';
import {wipeSetup} from 'src/store/databaseSetupReducer/databaseSetupReducer';
import styled from 'styled-components/native';
import MdIcon from 'react-native-vector-icons/MaterialIcons';
import {theme} from 'src/theme/theme';
import {padding} from 'styled-system';
export const HomeScreen = () => {
  const navigation = useNavigation<RootProps>();
  const dispatch = useAppDispatch();
  const handleLogout = async () => {
    try {
      // await database.unsafeResetDatabase();
      dispatch(logout());
      dispatch(wipeSetup());

      database.write(async () => {
        await database.unsafeResetDatabase();
      });

      persistor.flush().then(() => {
        return persistor.purge();
      });
    } catch (error) {}
  };

  const handleClassrooms = (route: 'Classrooms' | 'StudentsRoot') => {
    navigation.navigate(route as any, {});
  };
  const {user} = useAppSelector(s => s.auth);

  const {steps} = useAppSelector(s => s.db);

  return (
    <>
      <ImageBackground source={homeBackground} style={{flex: 1}}>
        <LinearGradient colors={['#FFF', 'transparent']} style={{flex: 1}}>
          <HomeView>
            <Typography fontWeight={'bold'}>
              {user.first_name} {user.last_name}
            </Typography>
            <Spacer
              px={26}
              height={'100%'}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                display: 'flex',
                gap: 30,
              }}>
              <PaperButton
                onPress={() => handleClassrooms('Classrooms')}
                activeOpacity={0.9}
                style={{
                  elevation: 10,
                  shadowColor: '#000',
                  flexDirection: 'row',
                }}>
                <MaterialIcon color={'#5AC0FC'} size={22} name="class" />
                <Spacer mx={'8px'} />
                <Typography fontWeight={'bold'} fontSize={22} color={'#5AC0FC'}>
                  Classrooms
                </Typography>
              </PaperButton>
              <PaperButton
                onPress={() => handleClassrooms('StudentsRoot')}
                activeOpacity={0.9}
                style={{
                  elevation: 10,
                  shadowColor: '#000',
                  flexDirection: 'row',
                }}>
                <Icon
                  color={'#6C63FF'}
                  size={22}
                  name="account-group-outline"
                />
                <Spacer mx={'8px'} />
                <Typography fontWeight={'bold'} fontSize={22} color={'#6C63FF'}>
                  Students
                </Typography>
              </PaperButton>
              <TouchableOpacity activeOpacity={0.4} onPress={handleLogout}>
                <Typography fontWeight={'bold'}>Logout</Typography>
              </TouchableOpacity>
            </Spacer>
          </HomeView>
          <ZStack position={'absolute'} bottom="0" right="0" p="4">
            <TouchableOpacity
              style={{
                padding: 20,
                borderRadius: 100,
              }}
              activeOpacity={0.6}
              onPress={() => {
                navigation.navigate('Settings' as any,{});
              }}>
              <MdIcon
                size={34}
                color={theme.colors.primary.main}
                name="settings"
              />
            </TouchableOpacity>
          </ZStack>
        </LinearGradient>
      </ImageBackground>
    </>
  );
};

const HomeView = styled.View`
  height: 100%;
  padding: 20px;
`;

const PaperButton = styled.TouchableOpacity`
  padding: 34px 26px;
  box-shadow: 0px 3px 6px #00000029;
  /* border: 2px solid; */
  border-radius: 15px;
  overflow: hidden;
  background: #fff;
  justify-content: flex-start;
  align-items: center;
  min-width: 211px;
  max-width: 211px;
`;
