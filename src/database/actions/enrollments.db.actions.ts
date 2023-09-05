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
        enrolledCourses: {data, meta},
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

    const enrolledClassroomsData = enrolledClassrooms.data;
    const enrolledCourses = data;
    const batchActions: boolean | void | Model | Model[] | null = [];

    for (let page = 2; page <= meta?.last_page!; page++) {
      const {
        data: {
          enrolledCourses: {data},
        },
      } = await getEnrollments(page);
      enrolledCourses.push(...data);
    }

    for (let index = 0; index < enrolledCourses.length; index++) {
      const enrolled = enrolledCourses[index];
      const createdEnrollment = query.prepareCreate(builder => {
        builder._raw = sanitizedRaw(
          {
            id: `${enrolled.user_id}-${enrolled.course_id}`,
            course_id: enrolled.course_id.toString(),
            classroom_id: enrolled.course.classroom_id.toString(),
            progress: enrolled.progress,
            user_id: enrolled.user_id.toString(),
            created_at: Date.parse(enrolled.created_at),
            group_id: enrolled.group_id?.toString(),
          },
          query.schema,
        );
        builder._raw._status = 'synced';
      });
      batchActions.push(createdEnrollment);
    }

    for (let page = 2; page <= enrolledClassrooms.meta?.last_page!; page++) {
      const {
        data: {enrolledClassrooms},
      } = await getClassroomEnrollments(page);
      enrolledClassroomsData.push(...enrolledClassrooms.data);
    }

    for (let index = 0; index < enrolledClassroomsData.length; index++) {
      const enrolled = enrolledClassroomsData[index];
      const createdEnrollment = classroomQuery.prepareCreate(builder => {
        builder._raw = sanitizedRaw(
          {
            id: `${enrolled.user_id}-${enrolled.classroom_id}`,
            classroom_id: enrolled.classroom_id.toString(),
            active: enrolled.active,
            completed_courses: enrolled.completed_courses,
            user_id: enrolled.user_id.toString(),
            status: enrolled.status,
            created_at: Date.parse(enrolled.created_at),
            group_id: enrolled.group_id?.toString(),
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
    throw new Error(error['message']);
  }
};
