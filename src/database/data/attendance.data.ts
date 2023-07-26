import {first, firstValueFrom, lastValueFrom, mergeMap} from 'rxjs';
import {getReference} from './reference.data';
import {database} from '..';
import CourseReferenceModel from '../models/CourseReferenceModel';
import CourseModel from '../models/Course';
import {Q} from '@nozbe/watermelondb';
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
          builder.classroomId = course.classroom_id.toString();
          builder.courseId = course.id;
          builder.studentId = student_id.toString();
          builder.homeworkId = reference.homework_id?.toString() ?? null;
          builder.quizId = reference.quiz_id?.toString() ?? null;
          builder.type = 'center';
        }),
  );
};

const createAbsentAttendance = async (
  course_id: number,
  student_id: number,
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
          builder.classroomId = course.classroom_id.toString();
          builder.courseId = course.id;
          builder.studentId = student_id.toString();
          builder.type = 'absent';
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
        Q.where('user_id', student_id),
        Q.where('course_id', reference.center_course_id),
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

export const getStudentAttendance = (
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
    );
  return query.observe();
};

export const getCourseAttendance = (
  center_id: number | null,
  online_id: number | null,
  group_id: number | null,
) => {
  console.log('group_id',group_id)
  const query = database
    .get<CenterAttendanceModel>(CenterAttendanceModel.table)
    .query(
      Q.experimentalJoinTables(['enroll_classrooms', 'students']),
      Q.and(
        Q.where(
          'courseId',
          center_id
            ? (center_id?.toString() as any)
            : (online_id?.toString() as any),
        ),
        Q.on('enroll_classrooms', Q.where('group_id', group_id ?? null)),
      ),
    );
  return query.observe();
};

export const removeStudentAttendance = async (
  student_id: number,
  course_id: number,
) => {
  const [record] = await database
    .get<CenterAttendanceModel>(CenterAttendanceModel.table)
    .query(
      Q.and(
        Q.where('courseId', course_id.toString()),
        Q.where('studentId', student_id.toString()),
      ),
    )
    .fetch();
  await database.write(async () => {
    record.markAsDeleted();
  });
};
