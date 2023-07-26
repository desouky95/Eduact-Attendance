import {Model, Q, Query} from '@nozbe/watermelondb';
import {Associations} from '@nozbe/watermelondb/Model';
import {
  date,
  field,
  immutableRelation,
  relation,
  text,
  writer,
} from '@nozbe/watermelondb/decorators';
import StudentModel from './StudentModel';
import ClassroomModel from './Classroom';
import CourseModel from './Course';
import UserModel from './UserModel';

export default class InstructorCodeModel extends Model {
  static table: string = 'instructor_codes';

  static associations: Associations = {
    students: {type: 'belongs_to', key: 'student_id'},
  };

  @relation('students', 'studentId') student!: Query<StudentModel>;

  @field('sid') sid!: number;
  @text('student_id') student_id!: number;
  @text('instructor_id') instructor_id!: number;
  @text('code') code!: string;
  @text('group_name') group_name!: string;

  @writer async addStudent(student: Student) {
    const users = await this.collections
      .get<UserModel>('users')
      .query(Q.where('sid', student.user_id), Q.take(1))
      .fetch();
    let createdStudent: StudentModel;
    if (users.length !== 0) {
      createdStudent = await this.collections
        .get<StudentModel>('students')
        .create(builder => {
          builder.user_id = users[0].sid;
          builder.parent_phone = student.parent_phone;
          builder.parent_relation = student.parent_relation;
          builder.ssn = student.ssn!;
        });

      return {student: createdStudent};
    }
    const newUser = await this.collections
      .get<UserModel>('users')
      .create(builder => {
        builder.sid = student.user.id;
        builder.first_name = student.user.first_name;
        builder.last_name = student.user.last_name;
        builder.middle_name = student.user.middle_name!;
        builder.username = student.user.username;
        builder.email = student.user.email;
        builder.phone_number = student.user.phone_number;
        builder.phone_verified = student.user.phone_verified;
        builder.profile_photo = student.user.profile_photo;
        builder.gender = student.user.gender;
        builder.birth_date = student.user.birth_date;
      });
    createdStudent = await this.collections
      .get<StudentModel>('students')
      .create(builder => {
        builder.user_id = newUser.sid;
        builder.parent_phone = student.parent_phone;
        builder.parent_relation = student.parent_relation;
        builder.ssn = student.ssn!;
      });
    return {student: createdStudent};
  }
}
