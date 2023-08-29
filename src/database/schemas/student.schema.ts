import {tableSchema} from '@nozbe/watermelondb';

export const studentSchema = tableSchema({
  name: 'students',
  columns: [
    {name: 'sid', isIndexed: true, type: 'number'},
    {name: 'user_id', type: 'string'},
    {name: 'ssn', type: 'string'},
    {name: 'parent_relation', type: 'string'},
    {name: 'parent_phone', type: 'string'},
  ],
});
