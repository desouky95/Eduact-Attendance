import {tableSchema} from '@nozbe/watermelondb';

export const referenceSchema = tableSchema({
  name: 'references',
  columns: [
    {name: 'course_id', type: 'number'},
    {name: 'quiz_id', type: 'number'},
    {name: 'homework_id', type: 'number'},
    {name: 'online_classroom_id', type: 'number'},
    {name: 'online_course_id', type: 'number'},
    {name: 'online_quiz_id', type: 'number'},
    {name: 'online_homework_id', type: 'number'},
  ],
});

