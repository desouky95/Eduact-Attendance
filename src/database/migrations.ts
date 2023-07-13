import {
  createTable,
  schemaMigrations,
} from '@nozbe/watermelondb/Schema/migrations';

export default schemaMigrations({
  migrations: [
    // We'll add migration definitions here later
    {
      toVersion: 2,
      steps: [
        createTable({
          name: 'classrooms',
          columns: [
            {name: 'sid', type: 'number', isIndexed: true},
            {name: 'title', type: 'string'},
            {name: 'label', type: 'string'},
          ],
        }),
        createTable({
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
    },
  ],
});
