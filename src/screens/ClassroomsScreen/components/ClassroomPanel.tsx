import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import ClassroomModel from 'src/database/models/Classroom';
import withObservables from '@nozbe/with-observables';
import {Accordion} from 'components/Accordion/Accordion';
import {AccordionSummary} from 'components/Accordion/AccordionSummary';
import {Typography} from 'components/Typography/Typography';
import {useNavigation} from '@react-navigation/native';
import {useObservableState} from 'observable-hooks';
import {coursesQuery} from 'src/database/data/classrooms.data';
import {Badge, VStack} from 'native-base';
import {CoursePanel} from './CoursePanel';

export const ClassroomPanel = ({classroom}: {classroom: ClassroomModel}) => {
  const observable = coursesQuery(classroom.sid).observe();

  const [courses] = useObservableState(input$ => observable, []);
  return (
    <Accordion disabled={courses.length === 0} key={`${classroom.id}`}>
      <AccordionSummary>
        <Typography fontSize={16} color={'#5AC0FC'}>
          {classroom.title}
        </Typography>
      </AccordionSummary>
      <View>
        {courses.map((lesson, index) => (
          <CoursePanel key={`${lesson.name}-${index}`} course={lesson} />
        ))}
      </View>
    </Accordion>
  );
};
