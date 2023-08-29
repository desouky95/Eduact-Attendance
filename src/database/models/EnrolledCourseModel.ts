import {Model, Query} from '@nozbe/watermelondb';
import {Associations} from '@nozbe/watermelondb/Model';
import {field, relation, text , date ,readonly} from '@nozbe/watermelondb/decorators';
import StudentModel from './StudentModel';
import CourseModel from './Course';

export default class EnrolledCourseModel extends Model {
  static table: string = 'enroll_courses';

  static associations: Associations = {
    users: {type: 'belongs_to', key: 'user_id'},
    courses: {type: 'belongs_to', key: 'course_id'},
  };

  @relation('students', 'student_id') student!: Query<StudentModel>;
  @relation('courses', 'course_id') course!: Query<CourseModel>;

  @field('user_id') user_id!: string;
  @text('course_id') course_id!: string;
  @text('classroom_id') classroom_id!: string;
  @text('progress') progress!: number;
  @field('sid') sid!: number | null;
  @readonly @date('created_at') createdAt!: Date;

}
