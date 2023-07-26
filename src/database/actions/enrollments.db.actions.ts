import {WithProgressArgs} from 'src/api/api';
import {getAttendance} from 'src/api/attendance/attendance.api';
import {database} from '..';
import CenterAttendanceModel from '../models/CenterAttendanceModel';
import {Model} from '@nozbe/watermelondb';
import {sanitizedRaw} from '@nozbe/watermelondb/RawRecord';
import {centerAttendanceSchema} from '../schemas/centerAttendance.schema';
import {
  getClassroomEnrollments,
  getEnrollments,
} from 'src/api/enrollment/enrollment.api';
import EnrolledCourseModel from '../models/EnrolledCourseModel';
import EnrolledClassroomModel from '../models/EnrolledClassroomModel';

export const setupEnrollments = async (withProgress?: WithProgressArgs) => {
  try {
    const {
      data: {
        enrolledCourses: {data},
      },
    } = await getEnrollments();
    const {
      data: {enrolledClassrooms},
    } = await getClassroomEnrollments();
    const query = database.collections.get<EnrolledCourseModel>(
      EnrolledCourseModel.table,
    );
    const classroomQuery = database.collections.get<EnrolledClassroomModel>(
      EnrolledClassroomModel.table,
    );
    const batchActions: boolean | void | Model | Model[] | null = [];

    for (let index = 0; index < data.length; index++) {
      const enrolled = data[index];
      const createdEnrollment = query.prepareCreate(builder => {
        builder._raw = sanitizedRaw(
          {
            course_id: enrolled.course_id.toString(),
            classroom_id: enrolled.course.classroom_id.toString(),
            progress: enrolled.progress,
            user_id: enrolled.user_id.toString(),
          },
          query.schema,
        );
        builder._raw._status = 'synced';
      });
      batchActions.push(createdEnrollment);
    }

    for (let index = 0; index < enrolledClassrooms.data.length; index++) {
      const enrolled = enrolledClassrooms.data[index];
      const createdEnrollment = classroomQuery.prepareCreate(builder => {
        builder._raw = sanitizedRaw(
          {
            classroom_id: enrolled.classroom_id.toString(),
            active: enrolled.active,
            completed_courses: enrolled.completed_courses,
            user_id: enrolled.user_id.toString(),
            status: enrolled.status,
          },
          classroomQuery.schema,
        );
        builder._raw._status = 'synced';
      });
      batchActions.push(createdEnrollment);
    }
    await database.write(async ({}) => {
      await database.batch(batchActions);
    });
  } catch (error) {
    console.error(error);
  }
};
