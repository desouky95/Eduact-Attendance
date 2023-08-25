import {WithProgressArgs} from 'src/api/api';
import {Step} from 'src/store/databaseSetupReducer/databaseSetupReducer';
import {setupClassrooms} from './classroom.db.action';
import {setupStudents} from './students.db.action';
import {setupAttendance} from './attendance.db.actions';
import {setupEnrollments} from './enrollments.db.actions';

type ActionsMap = {
  [key in Step]: (args?: WithProgressArgs) => Promise<any>;
};

export const actionsMap: ActionsMap = {
  classrooms: setupClassrooms,
  students: setupStudents,
  attendance: setupAttendance,
  enrollments: setupEnrollments,
};
