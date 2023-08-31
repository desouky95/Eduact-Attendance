import {useRoute} from '@react-navigation/native';
import {CourseHeader} from 'components/CourseHeader/CourseHeader';
import {EdTextInput} from 'components/EdTextInput';
import {Box, Button, Skeleton, VStack, useTheme} from 'native-base';
import React, {useEffect, useState} from 'react';
import {ScrollView, Text, View, TouchableOpacity} from 'react-native';
import {useAppSelector} from 'src/store';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Center} from 'native-base';
import {Flex} from 'native-base';
import {HStack, Pressable} from 'native-base';
import {Typography} from 'components/Typography/Typography';
import {searchStudents} from 'src/database/data/classrooms.data';
import {first, flatMap} from 'rxjs';
import UserModel from 'src/database/models/UserModel';
import {StudentAttendance} from './components/StudentAttendance/StudentAttendance';
import {StudentSearch} from './components/StudentSearch/StudentSearch';
import {enrollStudent} from 'src/database/data/enrollment.data';
import {useSnackbar} from 'src/hooks/useSnackbar';
import {AttendanceActions} from './components/AttendanceActions/AttendanceActions';
import { Group } from './components/Group/Group';
export const AttendanceScreen = () => {
  const theme = useTheme();

  const [currentStudent, setCurrentStudent] = useState<UserModel | undefined>();
  const [notFound, setNotFound] = useState(false);
  const [toggleSearch, setToggleSearch] = useState(false);

  return (
    <View
      style={{
        paddingHorizontal: 20,
        flex: 1,
        width: '100%',
      }}>
      <CourseHeader />
      <Group/>
      <StudentSearch
        user={currentStudent}
        onNotFound={() => {
          setCurrentStudent(undefined);
          setNotFound(true);
          setToggleSearch(true);
        }}
        onStudentChange={studentUser => {
          setNotFound(false);
          setCurrentStudent(prev =>studentUser);
          setToggleSearch(true);
        }}
      />
      <Box minHeight="350">
        {toggleSearch && !notFound && <Skeleton h="40" />}
        <ScrollView style={{maxHeight: 350}}>
          {currentStudent && !notFound && (
            <StudentAttendance
              onSearchSuccess={() => setToggleSearch(false)}
              toggleSearch={toggleSearch}
              user={currentStudent}
            />
          )}
        </ScrollView>
        {notFound && (
          <Box flex={1}>
            <Center>
              <Typography fontWeight={'bold'} fontSize="18px">
                Student Not found
              </Typography>
            </Center>
          </Box>
        )}
      </Box>
      {currentStudent && (
        <AttendanceActions
          student={currentStudent}
          onCancel={() => {
            setCurrentStudent(undefined);
          }}
        />
      )}
    </View>
  );
};
