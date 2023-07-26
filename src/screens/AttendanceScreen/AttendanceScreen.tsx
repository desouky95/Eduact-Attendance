import {useRoute} from '@react-navigation/native';
import {CourseHeader} from 'components/CourseHeader/CourseHeader';
import {EdTextInput} from 'components/EdTextInput';
import {Box, Button, VStack, useTheme} from 'native-base';
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
export const AttendanceScreen = () => {
  const theme = useTheme();

  const [currentStudent, setCurrentStudent] = useState<UserModel | undefined>();

  const current = useAppSelector(s => s.course.current);

  const [toggleSearch, setToggleSearch] = useState(false);

  return (
    <ScrollView>
      <View
        style={{
          paddingHorizontal: 20,
          flex: 1,
          width: '100%',
        }}>
        <CourseHeader />
        <StudentSearch
          onStudentChange={studentUser => {
            setCurrentStudent(studentUser);
            setToggleSearch(true);
          }}
        />
        <Box minHeight="450" >
          <ScrollView style={{maxHeight:450}}>
            {currentStudent && (
              <StudentAttendance
                onSearchSuccess={() => setToggleSearch(false)}
                toggleSearch={toggleSearch}
                user={currentStudent}
              />
            )}
          </ScrollView>
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
    </ScrollView>
  );
};
