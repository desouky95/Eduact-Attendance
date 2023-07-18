import {Model, Query} from '@nozbe/watermelondb';
import {Associations} from '@nozbe/watermelondb/Model';
import {
  date,
  field,
  immutableRelation,
  text,
  lazy,
  relation
} from '@nozbe/watermelondb/decorators';
import StudentModel from './StudentModel';

export default class UserModel extends Model {
  static table: string = 'users';

  @relation('students', 'user_id') student!: Query<StudentModel>;

  @field('sid') sid!: number;
  @text('uuid') uuid!: string;
  @text('email') email!: string;
  @text('username') username!: string;
  @text('phone_number') phone_number!: string;
  @text('first_name') first_name!: string;
  @text('middle_name') middle_name!: string;
  @text('last_name') last_name!: string;
  @text('gender') gender!: string;
  @text('profile_photo') profile_photo!: string;
  @date('birth_date') birth_date!: Date;
  @field('phone_verified') phone_verified!: boolean;
  @field('email_verified') email_verified!: boolean;


}
