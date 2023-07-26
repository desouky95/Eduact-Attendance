import {tableSchema} from '@nozbe/watermelondb';

export const groupSchema = tableSchema({
  name: 'groups',
  columns: [
    {name: 'sid', type: 'number'},
    {name: 'classroom_id', type: 'string'},
    {name: 'name', type: 'string'},
    {name: 'code', type: 'string'},
  ],
});
