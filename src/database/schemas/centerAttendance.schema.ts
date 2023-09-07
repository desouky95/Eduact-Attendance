import {tableSchema} from '@nozbe/watermelondb';

export const centerAttendanceSchema = tableSchema({
  name: 'center_attendences',
  columns: [
    {
      name: 'sid',
      isOptional: true,
      type: 'number',
    },
    {name: 'studentId', type: 'string'},
    {name: 'classroomId', type: 'string'},
    {name: 'courseId', type: 'string'},
    {name: 'homeworkId', type: 'string'},
    {name: 'quizId', type: 'string'},
    {name: 'type', type: 'string'},
    {name: 'created_at', type: 'number'},
    {name: 'group_id', type: 'string', isOptional: true},
  ],
});
