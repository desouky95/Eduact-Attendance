import {tableSchema} from '@nozbe/watermelondb';

export const centerAttendanceSchema = tableSchema({
  name: 'center_attendences',
  columns: [
    {
      name: 'sid',
      isIndexed: true,
      type: 'number',
    },
    {name: 'studentId', type: 'number'},
    {name: 'classroomId', type: 'number'},
    {name: 'courseId', type: 'number'},
    {name: 'homeworkId', type: 'number'},
    {name: 'quizId', type: 'number'},
    {name: 'type', type: 'string'},
  ],
});
