import {useDatabase} from '@nozbe/watermelondb/hooks';
import {useRoute} from '@react-navigation/native';
import {Spacer} from 'components/Spacer/Spacer';
import {Table} from 'components/Table/Table';
import {Typography} from 'components/Typography/Typography';
import {VStack, Flex, HStack, ScrollView, Box, Select} from 'native-base';
import {useObservableState} from 'observable-hooks';
import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import {getCourse} from 'src/database/data/classrooms.data';
import {getFontSize} from 'src/theme/getFontSize';
import styled from 'styled-components/native';
import {first, flatMap, take} from 'rxjs/operators';
import CourseModel from 'src/database/models/Course';
import {CourseHeader} from 'components/CourseHeader/CourseHeader';
import CourseReferenceModel from 'src/database/models/CourseReferenceModel';
import {getReference} from 'src/database/data/reference.data';
import {useAppDispatch, useAppSelector} from 'src/store';
import {setCurrentReference} from 'src/store/courseReducer/courseReducer';
import {AnalyticsSection} from './components/AnalyticsSection';
import {CourseDataTable} from './components/CourseDataTable';
import {GroupsFilter} from './components/GroupFilter';
const students = [
  {name: 'Naasddddddddddddddddddme'},
  {name: 'Ismail'},
  {name: 'Moustafa'},
];
export const ClassroomScreen = () => {
  const {params} = useRoute<ClassroomScreenProp>();

  const current = useAppSelector(s => s.course.current);
  const ref = useAppSelector(s => s.course.currentReference);

  const dispatch = useAppDispatch();
  useEffect(() => {
    const subscription = getReference(current?.sid).subscribe(value => {
      console.log(value);
      dispatch(setCurrentReference(value));
    });
    return () => subscription.unsubscribe();
  }, [current?.id]);

  const [groupId,setGroupId] = useState<number | undefined>()
  return (
    <ScrollView>
      <View
        style={{
          paddingHorizontal: 20,
          flex: 1,
          width: '100%',
          // backgroundColor: 'red',
        }}>
        <CourseHeader />
        <GroupsFilter onChange={setGroupId} />
        {ref && <AnalyticsSection />}
        {/* <Box height="400" backgroundColor={'yellow.400'}></Box> */}

        {ref && <CourseDataTable group_id={groupId} />}
      </View>
    </ScrollView>
  );
};
