import {Q} from '@nozbe/watermelondb';
import {database} from '..';
import CourseReferenceModel from '../models/CourseReferenceModel';
import {first, firstValueFrom, lastValueFrom, mergeMap} from 'rxjs';

export const getReference = (course_id?: number) => {
  const query = database.collections
    .get<CourseReferenceModel>(CourseReferenceModel.table)
    .query()
    .observe()
    .pipe(mergeMap(s => s))
    .pipe(first(_ => _.course_id == course_id));

  return query;
};

export const saveReference = async (formData: ReferenceFormData) => {
  const query = database.collections.get<CourseReferenceModel>(
    CourseReferenceModel.table,
  );
  const _query = await query
    .query(Q.where('course_id', formData.course_id), Q.take(1))
    .fetch();
  const record = _query[0];


  const reference = await database.write(
    async ({}) =>
      await record.update(builder => {
        builder.center_course_id = formData.center_course_id;
        builder.quiz_id = formData.quiz_id;
        builder.homework_id = formData.homework_id;
        builder.online_classroom_id = formData.online_classroom_id;
        builder.online_course_id = formData.online_course_id;
        builder.online_quiz_id = formData.online_quiz_id;
        builder.online_homework_id = formData.online_homework_id;
      }),
  );

  return reference;
};

export const createReference = async (course_id: number) => {
  try {
    const query = database.get<CourseReferenceModel>('references');

    const isExist = await query.query(Q.where('course_id', course_id)).fetch();
    if (isExist.length > 0) return;
    await database.write(async () => {
      await query.create(builder => {
        builder.course_id = course_id;
        builder.center_course_id = null;
        builder.online_classroom_id = null;
        builder.online_course_id = null;
        builder.online_homework_id = null;
        builder.online_quiz_id = null;
        builder.quiz_id = null;
        builder.homework_id = null;
      });
    });
  } catch (error: any) {
    console.error(error);
  }
};
