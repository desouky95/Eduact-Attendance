import {getClassrooms} from 'src/api/classroom/classroom.api';
import {database} from '..';
import Classroom from '../models/Classroom';
import {WithProgressArgs} from 'src/api/api';
import Course from '../models/Course';
import CourseModel from '../models/Course';
import {Model} from '@nozbe/watermelondb';
import TestModel from '../models/TestModel';
import UnitModel from '../models/UnitModel';
import GroupModel from '../models/GroupModel';
import {sanitizedRaw} from '@nozbe/watermelondb/RawRecord';
import {getTestAttempts} from 'src/api/classroom/attempts.api';
import TestAttemptModel from '../models/TestAttemptModel';

export const setupTestAttempts = async (withProgress?: WithProgressArgs) => {
  try {
    const testAttemptsResponse = await getTestAttempts(withProgress);
    const attemptQuery = database.collections.get<TestAttemptModel>(
      TestAttemptModel.table,
    );
    const batchActions: boolean | void | Model | Model[] | null = [];
    let testAttemptsData = testAttemptsResponse.data.testAttempts.data;
    console.log(testAttemptsData);
    for (
      let page = 2;
      page <= testAttemptsResponse.data.testAttempts.meta?.last_page!;
      page++
    ) {
      const {
        data: {testAttempts},
      } = await getTestAttempts(withProgress, page);
      console.log(testAttempts.data)
      testAttemptsData = [...testAttemptsData,...testAttempts.data]
    }

    for (let index = 0; index < testAttemptsData.length; index++) {
      const attempt = testAttemptsData[index];
      batchActions.push(
        attemptQuery.prepareCreate(builder => {
          builder._raw = sanitizedRaw(
            {
              id: attempt.id.toString(),
              student_id: attempt.student_id?.toString(),
              s_student_id: attempt.student_id,
              test_id: attempt.test_id?.toString(),
              s_test_id: attempt.test_id,
              active: attempt.active,
              grade: attempt.grade,
              status: attempt.status,
              score: attempt.score,
            },
            attemptQuery.schema,
          );
        }),
      );
    }

    console.log(batchActions.map(_ => ({id: _.id})));
    await database.write(async () => {
      await database.batch(batchActions);
    });
  } catch (error) {
    console.error(error);
  }
};
