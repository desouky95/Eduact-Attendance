import {appSchema, tableSchema} from '@nozbe/watermelondb';
import {classroomSchema} from './schemas/classroom.schema';
import {courseSchema} from './schemas/course.schema';
import {userSchema} from './schemas/user.schema';
import {studentSchema} from './schemas/student.schema';
import {centerAttendanceSchema} from './schemas/centerAttendance.schema';
import {instructorCodeSchema} from './schemas/instructorCode.schema';
import {unitSchema} from './schemas/unit.schema';
import {testSchema} from './schemas/test.schema';
import { referenceSchema } from './schemas/reference.schema';

export default appSchema({
  version: 6,
  tables: [
    classroomSchema,
    courseSchema,
    userSchema,
    studentSchema,
    centerAttendanceSchema,
    instructorCodeSchema,
    unitSchema,
    testSchema,
    referenceSchema
  ],
});
