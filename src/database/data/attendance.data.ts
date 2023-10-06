import {first, firstValueFrom, lastValueFrom, mergeMap} from 'rxjs';
import {getReference} from './reference.data';
import {database} from '..';
import CourseReferenceModel from '../models/CourseReferenceModel';
import CourseModel from '../models/Course';
import {Model, Q} from '@nozbe/watermelondb';
import CenterAttendanceModel from '../models/CenterAttendanceModel';
import TestModel from '../models/TestModel';
import EnrolledCourseModel from '../models/EnrolledCourseModel';

const checkIfAttendanceExist = async (
  course_id: number,
  student_id: number,
) => {
  const [attendance] = await database
    .get<CenterAttendanceModel>(CenterAttendanceModel.table)
    .query(
      Q.and(
        Q.where('courseId', course_id.toString()),
        Q.where('studentId', student_id.toString()),
      ),
    );
  if (attendance) {
    await database.write(async () => {
      await attendance.destroyPermanently();
    });
  }
};
const createCenterAttendance = async (
  course_id: number,
  student_id: number,
  reference: CourseReferenceModel,
  classroom_id?: number,
) => {
  const [course] = await database
    .get<CourseModel>(CourseModel.table)
    .query(Q.and(Q.where('id', course_id.toString())))
    .fetch();
  await database.write(
    async () =>
      await database
        .get<CenterAttendanceModel>(CenterAttendanceModel.table)
        .create(builder => {
          builder._raw.id = `${student_id}-${course.id}-${course.classroom_id}`;
          builder.classroomId = course.classroom_id.toString();
          builder.courseId = course.id;
          builder.studentId = student_id.toString();
          builder.homeworkId = reference.homework_id?.toString() ?? null;
          builder.quizId = reference.quiz_id?.toString() ?? null;
          builder.type = 'center';
          builder.group_id = reference.group_id?.toString() ?? null;
        }),
  );
};

const createAttendanceByReference = async (
  course_id: number,
  ref_course_id: number | null,
  student_id: number,
  reference: CourseReferenceModel,
) => {
  const [enrolledReferenceCourse] = await database
    .get<CourseModel>(CourseModel.table)
    .query(
      Q.on(
        'enroll_courses',
        Q.and(
          Q.where('user_id', student_id.toString()),
          Q.where('course_id', ref_course_id?.toString() ?? null),
        ),
      ),
    )
    .fetch();
  const [course] = await database
    .get<CourseModel>(CourseModel.table)
    .query(Q.where('sid', course_id))
    .fetch();

  await database.write(
    async () =>
      await database
        .get<CenterAttendanceModel>(CenterAttendanceModel.table)
        .create(builder => {
          builder._raw.id = `${student_id}-${course_id}-${course.classroom_id}`;
          builder.classroomId = course.classroom_id.toString();
          builder.courseId = course.id;
          builder.studentId = student_id.toString();
          builder.type = enrolledReferenceCourse ? 'online' : 'absent';
          builder.homeworkId = enrolledReferenceCourse
            ? reference.online_homework_id?.toString() ?? null
            : null;
          builder.quizId = enrolledReferenceCourse
            ? reference.online_quiz_id?.toString() ?? null
            : null;
          builder.group_id = reference.group_id?.toString() ?? null;
        }),
  );
};
export const checkStudentHasAttendance = async (
  student_id: number,
  course_id: number,
) => {
  // Get Reference
  const [reference] = await database
    .get<CourseReferenceModel>(CourseReferenceModel.table)
    .query(Q.where('course_id', course_id))
    .fetch();

  // If No Reference or Center Course ID no attendance will be created
  if (!reference || !reference.center_course_id) return;

  // Check if student has attendance and delete it
  await checkIfAttendanceExist(reference.center_course_id, student_id);

  // Get if Student Enrollment
  const [enrolledCourse] = await database
    .get<EnrolledCourseModel>(EnrolledCourseModel.table)
    .query(
      Q.and(
        Q.where('user_id', student_id.toString()),
        Q.where('course_id', reference.center_course_id.toString()),
      ),
    )
    .fetch();

  // If Enrollment Exist Create Center Attendance
  if (enrolledCourse) {
    await createCenterAttendance(
      reference.center_course_id,
      student_id,
      reference,
    );
  } else {
    await createAttendanceByReference(
      reference.center_course_id,
      reference.online_course_id,
      student_id,
      reference,
    );
  }
};

export const getStudentAttendanceSync = (
  classroom_id: number,
  student_id: number,
) => {
  const query = database.collections
    .get<CenterAttendanceModel>('center_attendences')
    .query(
      Q.and(
        Q.where('classroomId', classroom_id.toString()),
        Q.where('studentId', student_id.toString()),
      ),
      Q.sortBy('created_at', 'desc'),
      Q.take(3)
    );
  return query.observe();
};

export const removeStudentAttendance = async (
  student_id: number,
  course_id: number,
) => {
  try {
    const [record] = await database
      .get<CenterAttendanceModel>(CenterAttendanceModel.table)
      .query(
        Q.and(
          Q.where('courseId', course_id.toString()),
          Q.where('studentId', student_id.toString()),
        ),
      )
      .fetch();
    if (!record) return;
    let batch: Model[] = [];
    if (record.syncStatus === 'created') {
      batch.push(record.prepareDestroyPermanently());
    } else {
      batch.push(record.prepareMarkAsDeleted());
    }
    await database.write(async () => {
      await database.batch(batch);
    });

    return record;
  } catch (error: any) {
    throw new Error(error['message']);
  }
};

export const getCourseAttendance = (
  current_course: number,
  center_id: number | null,
  online_id: number | null,
  group_id: number | null,
  type: string | null,
  search: string = '',
  enrolled?: boolean,
  page: number = 1,
  perPage?: number,
) => {
  const groupStatement = group_id ? `and groupId = '${group_id}'` : '';
  const enrolledStatement = enrolled
    ? `and enrollment_status is not null`
    : '';
  const typeStatement = type ? `and type = '${type}'` : '';
  const paginationStatement =
    page && perPage ? `limit ${perPage} offset ${(page - 1) * perPage}` : '';
  const searchStatement = `
    where (
      u.first_name like '%${Q.sanitizeLikeString(search)}%' or 
      u.last_name like '%${Q.sanitizeLikeString(search)}%' or 
      u.phone_number like '%${Q.sanitizeLikeString(search)}%' or 
      u.username like '%${Q.sanitizeLikeString(search)}%' 
      )

    `;

  const newQueryString = `
    select * from (
      select ce.* , ec2.user_id as enrollment_status,ec.group_id as groupId from center_attendences ce 
         left join (
         select classroom_id as id , group_id ,user_id from enroll_classrooms) ec 
         on ec.id = ce.classroomId and ce.studentId = ec.user_id
         join users u 
         on u.id = ce.studentId
         left join (
         select * from enroll_courses ec where ec.course_id = '${Q.sanitizeLikeString(
           current_course.toString(),
         )}'
         ) ec2
         on ec2.user_id = ce.studentId
         ${searchStatement}
      )
      where courseId = ? and _status != 'deleted' 
      ${enrolledStatement}
      ${groupStatement}
      ${typeStatement}
      ${paginationStatement}
      `;
  // ${enrolledStatement}
  const query = database
    .get<CenterAttendanceModel>(CenterAttendanceModel.table)
    .query(
      Q.unsafeSqlQuery(newQueryString, [
        center_id
          ? (center_id?.toString() as any)
          : (online_id?.toString() as any),
      ]),
    );

  return query.observe();
};
