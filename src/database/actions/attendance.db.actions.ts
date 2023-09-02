import {WithProgressArgs} from 'src/api/api';
import {getAttendance} from 'src/api/attendance/attendance.api';
import {database} from '..';
import CenterAttendanceModel from '../models/CenterAttendanceModel';
import {Model} from '@nozbe/watermelondb';
import {sanitizedRaw} from '@nozbe/watermelondb/RawRecord';
import {centerAttendanceSchema} from '../schemas/centerAttendance.schema';

export const setupAttendance = async (withProgress?: WithProgressArgs) => {
  try {
    const {
      data: {centerAttendence},
    } = await getAttendance(withProgress);
    const query = database.get<CenterAttendanceModel>('center_attendences');
    const batchActions: boolean | void | Model | Model[] | null = [];

    const attendances = centerAttendence.data;

    for (let page = 2; page <= centerAttendence.meta?.last_page!; page++) {
      const {
        data: {centerAttendence},
      } = await getAttendance(withProgress,page);
      attendances.push(...centerAttendence.data);
    }

    for (let index = 0; index < attendances.length; index++) {
      const attendance = attendances[index];
      const createdAttendance = query.prepareCreate(builder => {
        builder._raw = sanitizedRaw(
          {
            id: `${attendance.student_id}-${attendance.classroom_id}-${attendance.course_id}`,
            sid: attendance.id,
            quizId: attendance.quiz_id?.toString(),
            classroomId: attendance.classroom_id.toString(),
            courseId: attendance.course_id.toString(),
            homeworkId: attendance.homework_id?.toString(),
            studentId: attendance.student_id.toString(),
            type: attendance.type,
            created_at: Date.parse(attendance.created_at),
          },
          query.schema,
        );
        builder._raw._status = 'synced';
      });
      batchActions.push(createdAttendance);
    }
    await database.write(async ({}) => {
      await database.batch(batchActions);
    });
  } catch (error) {
    console.error(error);
  }
};
