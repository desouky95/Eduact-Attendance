import {Spacer} from 'components/Spacer/Spacer';
import {Typography} from 'components/Typography/Typography';
import {VStack} from 'native-base';
import {useObservableState} from 'observable-hooks';
import React from 'react';
import {first, flatMap} from 'rxjs';
import {getCourse} from 'src/database/data/classrooms.data';
import CourseModel from 'src/database/models/Course';
import {useAppSelector} from 'src/store';

export const CourseHeader = () => {
  const {current: course, currentClassroom} = useAppSelector(s => s.course);
  return (
    <Spacer my={5}>
      <VStack space={2}>
        <Typography fontWeight={'bold'}>
          Classroom Name : {currentClassroom?.title}
        </Typography>
        <Typography fontWeight={'bold'}>
          Lecture Name : {course?.name}
        </Typography>
      </VStack>
    </Spacer>
  );
};
