import {useDatabase} from '@nozbe/watermelondb/hooks';
import {useNavigation} from '@react-navigation/native';
import {logo} from 'assets/index';
import {Accordion} from 'components/Accordion/Accordion';
import {AccordionSummary} from 'components/Accordion/AccordionSummary';
import {Spacer} from 'components/Spacer/Spacer';
import {Typography} from 'components/Typography/Typography';
import React, {useMemo} from 'react';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import ClassroomModel from 'src/database/models/Classroom';

const classrooms = Array(20)
  .fill(0)
  .map((v, index) => ({
    name: `Classroom ${index + 1}`,
    lessons: Array(5)
      .fill(0)
      .map((v, lIndex) => ({name: `Lesson ${index + 1} ${lIndex + 1}`})),
  }));

import withObservables from '@nozbe/with-observables';
import {database} from 'src/database';
import {withDatabase} from '@nozbe/watermelondb/DatabaseProvider';
import {useObservable, useObservableState} from 'observable-hooks';
import {Observable} from '@nozbe/watermelondb/utils/rx';
import {classroomsQuery} from 'src/database/data/classrooms.data';
import {ClassroomPanel} from './components/ClassroomPanel';

export const ClassroomsScreen = (props: {}) => {
  const database = useDatabase();


  const data = database.collections
    .get<ClassroomModel>('classrooms')
    .query()
    .observe();

  const [classrooms] = useObservableState(input$ => data, []);
  return (
    <ScrollView style={{paddingHorizontal: 20}}>
      <Spacer my={5}>
        <Typography fontWeight={'bold'}>Classrooms</Typography>
      </Spacer>

      {classrooms.map((classroom, index) => (
        <ClassroomPanel classroom={classroom} key={classroom.id} />
      ))}
    </ScrollView>
  );
};
