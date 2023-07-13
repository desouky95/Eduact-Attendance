import {appSchema, tableSchema} from '@nozbe/watermelondb';

export default appSchema({
  version: 2,
  tables: [
    tableSchema({
      name: 'classrooms',
      columns: [
        {name: 'sid', type: 'number', isIndexed: true},
        {name: 'title', type: 'string'},
        {name: 'label', type: 'string'},
      ],
    }),
    tableSchema({
      name: 'courses',
      columns: [
        {name: 'sid', type: 'number', isIndexed: true},
        {name: 'classroom_id', type: 'number'},
        {name: 'section_id', type: 'number'},
        {name: 'name', type: 'string'},
        {name: 'code', type: 'string'},
      ],
    }),
  ],
});
