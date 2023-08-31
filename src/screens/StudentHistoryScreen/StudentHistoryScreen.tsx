import {Q} from '@nozbe/watermelondb';
import {useDatabase} from '@nozbe/watermelondb/hooks';
import {RouteProp, useFocusEffect, useRoute} from '@react-navigation/native';
import {Typography} from 'components/Typography/Typography';
import {Center} from 'native-base';
import {Box, Select, StyledProps} from 'native-base';
import {View} from 'native-base';
import React, {useState} from 'react';
import ClassroomModel from 'src/database/models/Classroom';
import CourseModel from 'src/database/models/Course';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {ClassroomFilter} from './components/ClassroomFilter/ClassroomFilter';
import {ClassroomHistory} from './components/ClassroomHistory/ClassroomHistory';

export const StudentHistoryScreen = () => {
  const {params} = useRoute<StudentHistoryScreenProp>();

  const database = useDatabase();

  const [classroom, setClassroom] = useState<string | undefined>();

  return (
    <View p="4" py="6" flex={1}>
      <ClassroomFilter onChange={setClassroom} />
      {classroom && (
        <ClassroomHistory student_id={params.id} classroom_id={classroom} />
      )}
    </View>
  );
};
