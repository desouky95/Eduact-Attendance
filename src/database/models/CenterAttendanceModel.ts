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

export default class CenterAttendanceModel extends Model {
  static table: string = 'center_attendences';

  static associations: Associations = {
    student: {type: 'belongs_to', key: 'studentId'},
    classroom: {type: 'belongs_to', key: 'classroomId'},
    course: {type: 'belongs_to', key: 'courseId'},
  };

  @relation('students', 'studentId') student!: Query<StudentModel>;
  @relation('classrooms', 'classroomId') classroom!: Query<ClassroomModel>;
  @relation('courses', 'courseId') course!: Query<CourseModel>;

  @field('sid') sid!: number;
  @text('studentId') studentId!: number;
  @text('classroomId') classroomId!: number;
  @text('courseId') courseId!: number;
  @text('homeworkId') homeworkId!: number;
  @text('quizId') quizId!: number;
  @text('type') type!: string;
}
