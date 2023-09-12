import {Model, Query} from '@nozbe/watermelondb';
import {Associations} from '@nozbe/watermelondb/Model';
import {
  date,
  field,
  immutableRelation,
  text,
  lazy,
  relation,
} from '@nozbe/watermelondb/decorators';
import StudentModel from './StudentModel';
import EnrolledClassroomModel from './EnrolledClassroomModel';
import CenterAttendanceModel from './CenterAttendanceModel';

export default class UserModel extends Model {
  static table: string = 'users';

  static associations: Associations = {
    enroll_classrooms: {type: 'has_many', foreignKey: 'user_id'},
    center_attendances: {type: 'has_many', foreignKey: 'studentId'},
    students: {type: 'belongs_to', key: 'id'},
  };

  @relation('students', 'id') student!: Query<StudentModel>;
  @relation('center_attendances', 'studentId')
  attendance!: Query<CenterAttendanceModel>;
  @relation('enroll_classrooms', 'user_id')
  enroll_classroom!: Query<EnrolledClassroomModel>;

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
