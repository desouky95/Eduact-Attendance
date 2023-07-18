import {tableSchema} from '@nozbe/watermelondb';

export const courseSchema = tableSchema({
  name: 'courses',
  columns: [
    {name: 'sid', type: 'number', isIndexed: true},
    {name: 'classroom_id', type: 'number'},
    {name: 'section_id', type: 'number'},
    {name: 'name', type: 'string'},
    {name: 'code', type: 'string'},
    {name: 'description', type: 'string'},
    {name: 'price', type: 'number'},
    {name: 'old_price', type: 'number'},
    {name: 'active', type: 'boolean'},
    {name: 'thumbnail', type: 'string'},
    {name: 'buyable', type: 'boolean'},
    {name: 'order', type: 'number'},
    {name: 'preview_url', type: 'string'},
  ],
});
