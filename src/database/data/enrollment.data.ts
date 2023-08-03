import {Q} from '@nozbe/watermelondb';
import {database} from '..';
import EnrolledCourseModel from '../models/EnrolledCourseModel';
import EnrolledClassroomModel from '../models/EnrolledClassroomModel';
import {sanitizedRaw} from '@nozbe/watermelondb/RawRecord';
import {enrollClassroomSchema} from '../schemas/enrollClassroom.schema';
import CourseModel from '../models/Course';
import {enrolledCourseSchema} from '../schemas/enrolledCourse.schema';
import CenterAttendanceModel from '../models/CenterAttendanceModel';

const checkClassroomEnrollment = async (
  classroom_id: number,
  student_id: number,
) => {
  const [attachedClassroom] = await database
    .get<EnrolledClassroomModel>(EnrolledClassroomModel.table)
    .query(
      Q.and(
        Q.where('user_id', student_id.toString()),
        Q.where('classroom_id', classroom_id.toString()),
      ),
    )
    .fetch();
  if (!attachedClassroom) {
    await database.write(async () => {
      await database
        .get<EnrolledClassroomModel>(EnrolledClassroomModel.table)
        .create(builder => {
          builder._raw = sanitizedRaw(
            {
              user_id: student_id.toString(),
              classroom_id: classroom_id.toString(),
              active: true,
              status: 'new',
              completed_courses: 0,
            },
            enrollClassroomSchema,
          );
        });
    });
  }
};

export const enrollStudent = async (course_id: number, student_id: number) => {
  const [course] = await database
    .get<CourseModel>(CourseModel.table)
    .query(Q.where('id', course_id.toString()))
    .fetch();
  const [enrolledCourse] = await database
    .get<EnrolledCourseModel>(EnrolledCourseModel.table)
    .query(
      Q.and(
        Q.where('course_id', course_id.toString()),
        Q.where('user_id', student_id.toString()),
      ),
    )
    .fetch();
  if (enrolledCourse) {
    throw new Error('User is already enrolled in this course');
  }
  await checkClassroomEnrollment(course.classroom_id, student_id);

  await database.write(async () => {
    await database
      .get<EnrolledCourseModel>(EnrolledCourseModel.table)
      .create(builder => {
        builder._raw = sanitizedRaw(
          {
            user_id: student_id.toString(),
            course_id: course_id.toString(),
            classroom_id: course.classroom_id.toString(),
          },
          enrolledCourseSchema,
        );
      });
  });
};

export const unenrollStudent = async (
  course_id: number,
  student_id: number,
) => {
  const [course] = await database
    .get<CourseModel>(CourseModel.table)
    .query(Q.where('id', course_id.toString()))
    .fetch();
  const [enrolledCourse] = await database
    .get<EnrolledCourseModel>(EnrolledCourseModel.table)
    .query(
      Q.and(
        Q.where('course_id', course_id.toString()),
        Q.where('user_id', student_id.toString()),
      ),
    )
    .fetch();


  if (!enrolledCourse) {
    throw new Error('User is not enrolled in this course');
  }

  await database.write(async () => {
    await enrolledCourse.markAsDeleted();
  });

  const [attendance] = await database
    .get<CenterAttendanceModel>(CenterAttendanceModel.table)
    .query(
      Q.and(
        Q.where('studentId', student_id.toString()),
        Q.where('courseId', course_id.toString()),
      ),
    )
    .fetch();
  if (attendance) {
    await database.write(async () => {
      await attendance.destroyPermanently();
    });
  }
};

export const getEnrollment = (course_id: number, student_id: number) => {
  const query = database
    .get<EnrolledCourseModel>(EnrolledCourseModel.table)
    .query(
      Q.and(
        Q.where('user_id', student_id?.toString()),
        Q.where('course_id', course_id?.toString()),
      ),
    );

  return query.observe();
};
