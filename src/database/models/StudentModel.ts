import {Model, Query} from '@nozbe/watermelondb';
import {Associations} from '@nozbe/watermelondb/Model';
import {
  date,
  field,
  immutableRelation,
  relation,
  text,
} from '@nozbe/watermelondb/decorators';
import UserModel from './UserModel';

export default class StudentModel extends Model {
  static table: string = 'students';

  static associations: Associations = {
    users: {type: 'belongs_to', key: 'user_id'},
  };

  @relation('users', 'user_id') user!: Query<UserModel>;

  @field('sid') sid!: number;
  @field('user_id') user_id!: string;
  @text('ssn') ssn!: string;
  @text('parent_relation') parent_relation!: string;
  @text('parent_phone') parent_phone!: string;
}
