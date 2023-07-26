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
        Q.where('phone_number', Q.eq(query)),
        Q.where('username', Q.eq(query)),
      ),
    );
  return _query;
};

