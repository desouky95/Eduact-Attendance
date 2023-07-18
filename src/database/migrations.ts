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

export default schemaMigrations({
  migrations: [
    // We'll add migration definitions here later
    {
      toVersion: 2,
      steps: [
        createTable({
          name: 'classrooms',
          columns: [
            {name: 'sid', type: 'number', isIndexed: true},
            {name: 'title', type: 'string'},
            {name: 'label', type: 'string'},
          ],
        }),
        createTable({
          name: 'courses',
          columns: [
            {name: 'sid', type: 'number', isIndexed: true},
            {name: 'classroom_id', type: 'number'},
            {name: 'section_id', type: 'number'},
            {name: 'name', type: 'string'},
            {name: 'code', type: 'string'},
          ],
        }),
      ],
    },
    {
      toVersion: 3,
      steps: [
        addColumns({
          table: 'classrooms',
          columns: [
            {name: 'instructor_id', type: 'number'},
            {name: 'category_id', type: 'number'},
            {name: 'current_course', type: 'number'},
            {name: 'type', type: 'string'},
            {name: 'sub_type', type: 'string'},
            {name: 'description', type: 'string'},
            {name: 'language', type: 'string'},
            {name: 'thumbnail', type: 'string'},
            {name: 'status', type: 'string'},
            {name: 'active', type: 'boolean'},
            {name: 'accessible', type: 'boolean'},
            {name: 'weight', type: 'number'},
            {name: 'has_admission', type: 'boolean'},
            {name: 'admission_status', type: 'boolean'},
            {name: 'code', type: 'string'},
            {name: 'rating', type: 'number'},
          ],
        }),
        addColumns({
          table: 'courses',
          columns: [
            {name: 'description', type: 'string'},
            {name: 'price', type: 'number'},
            {name: 'old_price', type: 'number'},
            {name: 'active', type: 'boolean'},
            {name: 'thumbnail', type: 'string'},
            {name: 'buyable', type: 'boolean'},
            {name: 'order', type: 'number'},
            {name: 'preview_url', type: 'string'},
          ],
        }),
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
  ],
});
