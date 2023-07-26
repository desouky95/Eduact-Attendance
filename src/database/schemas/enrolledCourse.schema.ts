import {tableSchema} from '@nozbe/watermelondb';

export const enrolledCourseSchema = tableSchema({
  name: 'enroll_courses',
  columns: [
    {name: 'user_id', type: 'string'},
    {
      name: 'course_id',
      type: 'string',
    },
    {
      name: 'classroom_id',
      type: 'string',
    },
    {
      name: 'progress',
      type: 'number',
    },
    {
      name: 'sid',
      type: 'number',
      isOptional: true,
    },
  ],
});
