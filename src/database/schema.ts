import {appSchema, tableSchema} from '@nozbe/watermelondb';
import {classroomSchema} from './schemas/classroom.schema';
import {courseSchema} from './schemas/course.schema';
import {userSchema} from './schemas/user.schema';
import {studentSchema} from './schemas/student.schema';
import {centerAttendanceSchema} from './schemas/centerAttendance.schema';
import {instructorCodeSchema} from './schemas/instructorCode.schema';
import {unitSchema} from './schemas/unit.schema';
import {testSchema} from './schemas/test.schema';
import {referenceSchema} from './schemas/reference.schema';
import {enrolledCourseSchema} from './schemas/enrolledCourse.schema';
import { enrollClassroomSchema } from './schemas/enrollClassroom.schema';
import { groupSchema } from './schemas/groups.schema';
import { testAttemptSchema } from './schemas/testAttempt.schema';

export default appSchema({
  version: 15,
  tables: [
    classroomSchema,
    courseSchema,
    userSchema,
    studentSchema,
    centerAttendanceSchema,
    instructorCodeSchema,
    unitSchema,
    testSchema,
    referenceSchema,
    enrolledCourseSchema,
    enrollClassroomSchema,
    groupSchema,
    testAttemptSchema
  ],

});
