import {Q} from '@nozbe/watermelondb';
import {database} from '..';
import ClassroomModel from '../models/Classroom';
import CourseModel from '../models/Course';
import {first, firstValueFrom, flatMap, mergeMap, take} from 'rxjs';
import StudentModel from '../models/StudentModel';
import UserModel from '../models/UserModel';
import CenterAttendanceModel from '../models/CenterAttendanceModel';

export const classroomsQuery = database.collections
  .get<ClassroomModel>('classrooms')
  .query();

export const coursesQuery = (id: number) =>
  database.collections
    .get<CourseModel>('courses')
    .query(Q.where('classroom_id', id));

export const getCourse = (id: number) =>
  database.collections
    .get<CourseModel>('courses')
    .query(Q.where('sid', id), Q.take(1))
    .observe()
    .pipe(first());

export const searchStudents = (query: string) => {
  const _query = database.collections
    .get<UserModel>('users')
    .query(
      Q.or(
        Q.where('phone_number', Q.like(`%${query}%`)),
        Q.where('username', Q.like(`%${query}%`)),
      ),
    );
  return _query;
};

export const getStudentAttendance = async (
  course_id: number,
  student_id: number,
) => {
  const observable = database.collections
    .get<CourseModel>('courses')
    .query(Q.where('sid', course_id), Q.take(1))
    .observe()
    .pipe(first());
  const course = await firstValueFrom(
    observable.pipe(mergeMap(s => s)).pipe(first()),
  );

  const _query = database.collections
    .get<CenterAttendanceModel>('center_attendences')
    .query(Q.where('classroom_id', course.classroom_id));

  const __query = _query.extend(Q.where('student_id', student_id));
  return __query.observe();
};
