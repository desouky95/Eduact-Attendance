import {tableSchema} from '@nozbe/watermelondb';

export const unitSchema = tableSchema({
  name: 'units',
  columns: [
    {name: 'sid', isIndexed: true, type: 'number'},
    {name: 'course_id', type: 'string'},
    {name: 'name', type: 'string'},
  ],
});
