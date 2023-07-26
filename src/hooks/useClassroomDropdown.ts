import {Q} from '@nozbe/watermelondb';
import {
  useObservable,
  useObservableEagerState,
  useObservableState,
  useSubscription,
} from 'observable-hooks';
import React, {useEffect, useState} from 'react';
import {concatMap, first, flatMap, map, mergeMap, of} from 'rxjs';
import {database} from 'src/database';
import ClassroomModel from 'src/database/models/Classroom';
import CourseModel from 'src/database/models/Course';
import GroupModel from 'src/database/models/GroupModel';
import TestModel from 'src/database/models/TestModel';
import UnitModel from 'src/database/models/UnitModel';

const classroomsObservable = database.collections
  .get<ClassroomModel>(ClassroomModel.table)
  .query()
  .observe();

const coursesObservable = (classroom_id?: number) =>
  database.collections
    .get<CourseModel>(CourseModel.table)
    .query(Q.where('classroom_id', classroom_id ?? null))
    .observe();

const testsObservable = (course_id?: number) =>
  database.collections
    .get<UnitModel>(UnitModel.table)
    .query(Q.where('course_id', course_id?.toString() ?? null))
    .observe();

const groupsObservable = (classroom_id?: number) =>
  database.collections
    .get<GroupModel>(GroupModel.table)
    .query(Q.where('classroom_id', classroom_id?.toString() ?? null))
    .observe();

type UseClassroomDropdownArgs = {
  classroom_id?: number;
  course_id?: number;
};
export const useClassroomDropdown = ({
  classroom_id,
  course_id,
}: UseClassroomDropdownArgs) => {
  const [classrooms, setClassrooms] = useState<ClassroomModel[]>([]);
  const [courses, setCourses] = useState<CourseModel[]>([]);
  const [tests, setTests] = useState<{unit: UnitModel; test: TestModel}[]>([]);
  const [groups, setGroups] = useState<GroupModel[]>([]);

  useEffect(() => {
    const subscription = classroomsObservable.subscribe(value => {
      setClassrooms(() => value);
    });
    return () => subscription.unsubscribe();
  }, []);
  useEffect(() => {
    const subscription = coursesObservable(classroom_id).subscribe(value => {
      setCourses(value);
    });
    return () => subscription.unsubscribe();
  }, [classroom_id]);
  useEffect(() => {
    const subscription = testsObservable(course_id)
      .pipe()
      .subscribe(async value => {
        const data = await Promise.all(
          value.map(async _ => {
            const test = await database
              .get<TestModel>(TestModel.table)
              .query(Q.where('unit_id', _.id))
              .fetch();
            return {unit: _, test: test![0]};
          }),
        );

        setTests(data);
      });
    return () => subscription.unsubscribe();
  }, [course_id]);

  useEffect(() => {
    const subscription = groupsObservable(classroom_id)
      .pipe()
      .subscribe(value => {
        setGroups(value);
      });
    return () => subscription.unsubscribe();
  }, [classroom_id]);

  return {
    classrooms,
    courses,
    tests,
    groups,
  };
};
