import {tableSchema} from '@nozbe/watermelondb';

export const testSchema = tableSchema({
  name: 'tests',
  columns: [
    {name: 'sid', isIndexed: true, type: 'number'},
    {name: 'unit_id', type: 'number'},
    {name: 'uuid', type: 'string'},
    {name: 'title', type: 'string'},
    {name: 'overall_score', type: 'number'},
    {name: 'passing_value', type: 'number'},
    {name: 'passing_unit', type: 'string'},
  ],
});
