import {tableSchema} from '@nozbe/watermelondb';

export const enrollClassroomSchema = tableSchema({
  name: 'enroll_classrooms',
  columns: [
    {name: 'user_id', type: 'string'},
    {name: 'classroom_id', type: 'string'},
    {name: 'active', type: 'boolean'},
    {name: 'completed_courses', type: 'number'},
    {name: 'status', type: 'string'},
    {name: 'sid', type: 'number', isOptional: true},
    {name: 'group_id', type: 'string', isOptional: true},
    {name: 'created_at', type: 'number'},
  ],
});
