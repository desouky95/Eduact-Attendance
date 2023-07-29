import {Model, Query} from '@nozbe/watermelondb';
import {Associations} from '@nozbe/watermelondb/Model';
import {
  date,
  field,
  immutableRelation,
  relation,
  text,
} from '@nozbe/watermelondb/decorators';
import StudentModel from './StudentModel';
import ClassroomModel from './Classroom';
import CourseModel from './Course';
import UserModel from './UserModel';
import TestModel from './TestModel';

export default class CenterAttendanceModel extends Model {
  static table: string = 'center_attendences';

  static associations: Associations = {
    students: {type: 'belongs_to', key: 'studentId'},
    users: {type: 'belongs_to', key: 'studentId'},
    classrooms: {type: 'belongs_to', key: 'classroomId'},
    courses: {type: 'belongs_to', key: 'courseId'},
    enroll_classrooms: {type: 'belongs_to', key: 'classroomId'},
  };

  @relation('students', 'studentId') student!: Query<StudentModel>;
  @relation('users', 'studentId') user!: Query<UserModel>;
  @relation('classrooms', 'classroomId') classroom!: Query<ClassroomModel>;
  @relation('courses', 'courseId') course!: Query<CourseModel>;
  @relation('tests', 'quizId') test!: Query<TestModel>;
  @relation('tests', 'homeworkId') homework!: Query<TestModel>;

  @field('sid') sid!: number | null;
  @text('studentId') studentId!: string;
  @text('classroomId') classroomId!: string;
  @text('courseId') courseId!: string | null;
  @text('homeworkId') homeworkId!: string | null;
  @text('quizId') quizId!: string | null;
  @text('type') type!: string;
}
