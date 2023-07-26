import {
  createTable,
  addColumns,
  schemaMigrations,
} from '@nozbe/watermelondb/Schema/migrations';
import {userSchema} from './schemas/user.schema';
import {studentSchema} from './schemas/student.schema';
import {centerAttendanceSchema} from './schemas/centerAttendance.schema';
import {instructorCodeSchema} from './schemas/instructorCode.schema';
import {unitSchema} from './schemas/unit.schema';
import {testSchema} from './schemas/test.schema';
import {referenceSchema} from './schemas/reference.schema';
import {enrolledCourseSchema} from './schemas/enrolledCourse.schema';
import {number} from 'yup';
import {classroomSchema} from './schemas/classroom.schema';
import {courseSchema} from './schemas/course.schema';
import {enrollClassroomSchema} from './schemas/enrollClassroom.schema';
import {groupSchema} from './schemas/groups.schema';

export default schemaMigrations({
  migrations: [
    // We'll add migration definitions here later
    {
      toVersion: 2,
      steps: [
        createTable({
          name: classroomSchema.name,
          columns: classroomSchema.columnArray,
        }),
        createTable({
          name: courseSchema.name,
          columns: courseSchema.columnArray,
        }),
      ],
    },
    {
      toVersion: 3,
      steps: [
        createTable({
          name: userSchema.name,
          columns: userSchema.columnArray,
        }),
        createTable({
          name: studentSchema.name,
          columns: studentSchema.columnArray,
        }),
        createTable({
          name: centerAttendanceSchema.name,
          columns: centerAttendanceSchema.columnArray,
        }),
      ],
    },
    {
      toVersion: 4,
      steps: [
        createTable({
          name: instructorCodeSchema.name,
          columns: instructorCodeSchema.columnArray,
        }),
      ],
    },
    {
      toVersion: 5,
      steps: [
        createTable({
          name: unitSchema.name,
          columns: unitSchema.columnArray,
        }),
        createTable({
          name: testSchema.name,
          columns: testSchema.columnArray,
        }),
      ],
    },
    {
      toVersion: 6,
      steps: [
        createTable({
          name: referenceSchema.name,
          columns: referenceSchema.columnArray,
        }),
      ],
    },
    {
      toVersion: 7,
      steps: [
        createTable({
          name: enrolledCourseSchema.name,
          columns: enrolledCourseSchema.columnArray,
        }),
      ],
    },
    {
      toVersion: 8,
      steps: [
        addColumns({
          table: enrolledCourseSchema.name,
          columns: [{name: 'classroom_id', type: 'string'}],
        }),
      ],
    },
    {
      toVersion: 9,
      steps: [
        createTable({
          name: enrollClassroomSchema.name,
          columns: enrollClassroomSchema.columnArray,
        }),
      ],
    },
    {
      toVersion: 10,
      steps: [
        addColumns({
          table: enrollClassroomSchema.name,
          columns: [{name: 'sid', type: 'number', isOptional: true}],
        }),
        addColumns({
          table: enrolledCourseSchema.name,
          columns: [{name: 'sid', type: 'number', isOptional: true}],
        }),
      ],
    },
    {
      toVersion: 11,
      steps: [
        addColumns({
          table: enrollClassroomSchema.name,
          columns: [{name: 'group_id', type: 'string', isOptional: true}],
        }),
        createTable({
          name: groupSchema.name,
          columns: groupSchema.columnArray,
        }),
      ],
    },
    {
      toVersion: 12,
      steps: [
        addColumns({
          table: referenceSchema.name,
          columns: [{name: 'group_id', type: 'number', isOptional: true}],
        }),
      ],
    },
  ],
});
