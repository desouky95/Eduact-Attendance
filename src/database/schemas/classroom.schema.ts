import {tableSchema} from '@nozbe/watermelondb';

export const classroomSchema = tableSchema({
  name: 'classrooms',
  columns: [
    {name: 'sid', type: 'number', isIndexed: true},
    {name: 'title', type: 'string'},
    {name: 'label', type: 'string'},
    {name: 'instructor_id', type: 'number'},
    {name: 'category_id', type: 'number'},
    {name: 'current_course', type: 'number'},
    {name: 'type', type: 'string'},
    {name: 'sub_type', type: 'string'},
    {name: 'description', type: 'string'},
    {name: 'language', type: 'string'},
    {name: 'thumbnail', type: 'string'},
    {name: 'status', type: 'string'},
    {name: 'active', type: 'boolean'},
    {name: 'accessible', type: 'boolean'},
    {name: 'weight', type: 'number'},
    {name: 'has_admission', type: 'boolean'},
    {name: 'admission_status', type: 'boolean'},
    {name: 'code', type: 'string'},
    {name: 'rating', type: 'number'},
  ],
});
