import {WithProgressArgs} from 'src/api/api';
import {getStudents} from 'src/api/students/students.api';
import InstructorCodeModel from '../models/InstructorCodeModel';
import {database} from '..';
import CourseModel from '../models/Course';
import ClassroomModel from '../models/Classroom';
import {Model} from '@nozbe/watermelondb';
import UserModel from '../models/UserModel';
import StudentModel from '../models/StudentModel';

export const setupStudents = async (withProgress?: WithProgressArgs) => {
  try {
    const {data} = await getStudents(withProgress);
    const query = database.get<InstructorCodeModel>('instructor_codes');
    const userQuery = database.get<UserModel>('users');
    const studentQuery = database.get<StudentModel>('students');
    const batchActions: boolean | void | Model | Model[] | null = [];

    for (let index = 0; index < data.data.length; index++) {
      const studentWithinCode = data.data[index];
      const student = data.data[index].student;
      const code = query.prepareCreate(builder => {
        builder.sid = studentWithinCode.id;
        builder.code = studentWithinCode.code;
        builder.group_name = studentWithinCode.group_name;
        builder.instructor_id = studentWithinCode.instructor_id;
        builder.student_id = studentWithinCode.student_id;
      });
      batchActions.push(code);
      const user = userQuery.prepareCreate(builder => {
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
      batchActions.push(user);
      const createdStudent = studentQuery.prepareCreate(builder => {
        builder.sid = student.user.id;
        builder.user_id = student.user_id;
        builder.parent_phone = student.parent_phone;
        builder.parent_relation = student.parent_relation;
        builder.ssn = student.ssn!;
      });
      batchActions.push(createdStudent);
    }
    await database.write(async ({}) => {
      await database.batch(batchActions);
    });
  } catch (error) {
    console.error(error);
  }
};
