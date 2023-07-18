import {Spacer} from 'components/Spacer/Spacer';
import {Typography} from 'components/Typography/Typography';
import {useObservableState} from 'observable-hooks';
import React from 'react';
import {first, flatMap} from 'rxjs';
import {getCourse} from 'src/database/data/classrooms.data';
import CourseModel from 'src/database/models/Course';
import {useAppSelector} from 'src/store';

export const CourseHeader = () => {
  const course = useAppSelector(s => s.course.current);
  return (
    <Spacer my={5}>
      <Typography fontWeight={'bold'}>
        Classroom Name : Lecture {course?.name}
      </Typography>
    </Spacer>
  );
};
