import {useDatabase} from '@nozbe/watermelondb/hooks';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
// import {logo} from 'assets/index';
import {Accordion} from 'components/Accordion/Accordion';
import {AccordionSummary} from 'components/Accordion/AccordionSummary';
import {Spacer} from 'components/Spacer/Spacer';
import {Typography} from 'components/Typography/Typography';
import React, {useEffect, useLayoutEffect, useMemo, useState} from 'react';
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
import {
  useObservable,
  useObservableGetState,
  useObservableState,
} from 'observable-hooks';
import {Observable} from '@nozbe/watermelondb/utils/rx';
import {classroomsQuery} from 'src/database/data/classrooms.data';
import {ClassroomPanel} from './components/ClassroomPanel';
import {setCurrentReference} from 'src/store/courseReducer/courseReducer';
import {useAppDispatch} from 'src/store';

export const ClassroomsScreen = (props: {}) => {
  const database = useDatabase();

  const data = database.collections
    .get<ClassroomModel>('classrooms')
    .query()
    .observe();

  const [classrooms, setClassrooms] = useState<ClassroomModel[]>([]);
  useLayoutEffect(() => {
    const subscription = data.subscribe(value => {
      setClassrooms(value);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);
  const dispatch = useAppDispatch();

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
