import {tableSchema} from '@nozbe/watermelondb';

export const testAttemptSchema = tableSchema({
  name: 'test_attempts',
  columns: [
    {
      name: 'active',
      type: 'boolean',
    },
    {name: 'grade', type: 'string', isOptional: true},
    {name: 'status', type: 'string', isOptional: true},
    {name: 'score', type: 'number', isOptional: true},
    {name: 'test_id', type: 'string'},
    {name: 's_test_id', type: 'number'},
    {name: 'student_id', type: 'string'},
    {name: 's_student_id', type: 'number'},
  ],
});
