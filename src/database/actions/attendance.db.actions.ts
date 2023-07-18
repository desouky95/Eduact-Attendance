import {WithProgressArgs} from 'src/api/api';
import {getAttendance} from 'src/api/attendance/attendance.api';
import {database} from '..';
import CenterAttendanceModel from '../models/CenterAttendanceModel';
import {Model} from '@nozbe/watermelondb';

export const setupAttendance = async (withProgress?: WithProgressArgs) => {
  try {
    const {
      data: {
        centerAttendence: {data},
      },
    } = await getAttendance(withProgress);
    debugger;
    const query = database.get<CenterAttendanceModel>('center_attendences');
    const batchActions: boolean | void | Model | Model[] | null = [];

    for (let index = 0; index < data.length; index++) {
      const attendance = data[index];
      const createdAttendance = query.prepareCreate(builder => {
        builder.sid = attendance.id;
        builder.quizId = attendance.quiz_id;
        builder.classroomId = attendance.classroom_id;
        builder.courseId = attendance.course_id;
        builder.homeworkId = attendance.homework_id;
        builder.type = attendance.type;
        builder.studentId = attendance.student_id;
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
