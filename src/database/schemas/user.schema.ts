import {tableSchema} from '@nozbe/watermelondb';

export const userSchema = tableSchema({
  name: 'users',
  columns: [
    {name: 'sid', type: 'number', isIndexed: true},
    {name: 'uuid', type: 'string', isIndexed: true},
    {name: 'email', type: 'string'},
    {name: 'username', type: 'string'},
    {name: 'phone_number', type: 'string'},
    {name: 'first_name', type: 'string'},
    {name: 'middle_name', type: 'string'},
    {name: 'last_name', type: 'string'},
    {name: 'gender', type: 'string'},
    {name: 'profile_photo', type: 'string'},
    {name: 'birth_date', type: 'string'},
    {name: 'phone_verified', type: 'boolean'},
    {name: 'email_verified', type: 'boolean'},
  ],
});
