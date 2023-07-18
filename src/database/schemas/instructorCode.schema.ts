import {tableSchema} from '@nozbe/watermelondb';

export const instructorCodeSchema = tableSchema({
  name: 'instructor_codes',
  columns: [
    {name: 'sid', isIndexed: true, type: 'number'},
    {name: 'student_id', type: 'number'},
    {name: 'instructor_id', type: 'number'},
    {name: 'code', type: 'string'},
    {name: 'group_name', type: 'string'},
  ],
});
