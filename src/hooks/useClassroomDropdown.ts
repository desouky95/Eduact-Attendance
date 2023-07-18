import {Q} from '@nozbe/watermelondb';
import {
  useObservable,
  useObservableEagerState,
  useObservableState,
  useSubscription,
} from 'observable-hooks';
import React from 'react';
import {first, mergeMap} from 'rxjs';
import {database} from 'src/database';
import ClassroomModel from 'src/database/models/Classroom';
import CourseModel from 'src/database/models/Course';
import TestModel from 'src/database/models/TestModel';
import UnitModel from 'src/database/models/UnitModel';

type UseClassroomDropdownArgs = {
  classroom_id?: number;
  course_id?: number;
};
export const useClassroomDropdown = ({
  classroom_id,
  course_id,
}: UseClassroomDropdownArgs) => {
  const classroomObs = database.collections
    .get<ClassroomModel>(ClassroomModel.table)
    .query()
    .observe();

  const [classrooms] = useObservableState(input$ => classroomObs);

  const coursesObs = database.collections
    .get<CourseModel>(CourseModel.table)
    .query(Q.where('classroom_id', classroom_id!))
    .observe();

  const [courses] = useObservableState(input$ => coursesObs);

  const testsObs = database.collections
    .get<TestModel>(TestModel.table)
    .query(
      Q.unsafeSqlQuery(
        `select t.* from tests t join units u on u.sid = t.unit_id where u.course_id = ? `,
        [course_id!],
      ),
    )
    .observe();

  const [tests] = useObservableState(input$ => testsObs);

  return {
    classrooms,
    courses,
    tests,
  };
};
