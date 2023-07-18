import {Q} from '@nozbe/watermelondb';
import {useObservableGetState, useObservableState} from 'observable-hooks';
import React from 'react';
import {first, mergeMap} from 'rxjs';
import {database} from 'src/database';
import CourseReferenceModel from 'src/database/models/CourseReferenceModel';

export const useReferenceData = (course_id: number) => {
  const course_reference = database.collections
    .get<CourseReferenceModel>(CourseReferenceModel.table)
    .query(Q.where('course_id', course_id))
    .observe();

  const [value] = useObservableState<CourseReferenceModel>(input$ =>
    course_reference.pipe(mergeMap(s => s)).pipe(first()),
  );

  return {reference: value};
};
