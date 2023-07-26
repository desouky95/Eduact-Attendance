import {tableSchema} from '@nozbe/watermelondb';
import {schemaMigrations} from '@nozbe/watermelondb/Schema/migrations';

export const referenceSchema = tableSchema({
  name: 'references',
  columns: [
    {name: 'course_id', type: 'number'},
    {name: 'center_course_id', type: 'number', isOptional: true},
    {name: 'quiz_id', type: 'number', isOptional: true},
    {name: 'homework_id', type: 'number', isOptional: true},
    {name: 'online_classroom_id', type: 'number', isOptional: true},
    {name: 'online_course_id', type: 'number', isOptional: true},
    {name: 'online_quiz_id', type: 'number', isOptional: true},
    {name: 'online_homework_id', type: 'number', isOptional: true},
    {name: 'group_id', type: 'number', isOptional: true},
  ],
});
