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
      data: {
        centerAttendence: {data},
      },
    } = await getAttendance(withProgress);
    const query = database.get<CenterAttendanceModel>('center_attendences');
    const batchActions: boolean | void | Model | Model[] | null = [];

    for (let index = 0; index < data.length; index++) {
      const attendance = data[index];
      const createdAttendance = query.prepareCreate(builder => {
        builder._raw = sanitizedRaw(
          {
            id: attendance.id.toString(),
            sid: attendance.id,
            quizId: attendance.quiz_id?.toString(),
            classroomId: attendance.classroom_id.toString(),
            courseId: attendance.course_id.toString(),
            homeworkId: attendance.homework_id?.toString(),
            studentId: attendance.student_id.toString(),
            type: attendance.type,
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
