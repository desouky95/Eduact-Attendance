import {Model, Query, Relation} from '@nozbe/watermelondb';
import {Associations} from '@nozbe/watermelondb/Model';
import {field, relation, text} from '@nozbe/watermelondb/decorators';
import StudentModel from './StudentModel';
import CourseModel from './Course';
import ClassroomModel from './Classroom';
import UserModel from './UserModel';

export default class EnrolledClassroomModel extends Model {
  static table: string = 'enroll_classrooms';

  static associations: Associations = {
    // classrooms: {type: 'belongs_to', key: 'classroom_id'},
    // users: {type: 'belongs_to', key: 'user_id'},
  };

  @relation('classrooms', 'classroom_id') classroom!: Relation<ClassroomModel>;
  @relation('users', 'user_id') user!: Relation<UserModel>;

  @field('user_id') user_id!: string;
  @field('active') active!: boolean;
  @text('classroom_id') classroom_id!: string;
  @text('status') status!: string;
  @field('completed_courses') completed_courses!: number;
  @field('sid') sid!: number | null;

}
