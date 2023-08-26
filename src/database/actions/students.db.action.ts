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

    const {
      data: {
        instructorStudentsPayload: {data, meta},
      },
    } = await getStudents(withProgress);
    const query = database.collections.get<InstructorCodeModel>(
      InstructorCodeModel.table,
    );
    const userQuery = database.get<UserModel>('users');
    const studentQuery = database.get<StudentModel>('students');
    let batchActions: Model | Model[] = [];

    const codes = data;

    for (let page = 2; page <= meta?.last_page!; page++) {
      const {
        data: {
          instructorStudentsPayload: {data},
        },
      } = await getStudents(withProgress, page);
      codes.push(...data);
    }

    const students = data.filter(_ => _.student !== null);
    const users = data
      .map(_ => _.student?.user)
      .flat(1)
      .filter(_ => _ !== undefined);

    for (let index = 0; index < users.length; index++) {
      const toBeCreatedUser = users[index];
      const user = userQuery.prepareCreate(builder => {
        builder._raw.id = toBeCreatedUser.id.toString();
        builder.sid = toBeCreatedUser.id;
        builder.first_name = toBeCreatedUser.first_name;
        builder.last_name = toBeCreatedUser.last_name;
        builder.middle_name = toBeCreatedUser.middle_name!;
        builder.username = toBeCreatedUser.username;
        builder.email = toBeCreatedUser.email;
        builder.phone_number = toBeCreatedUser.phone_number;
        builder.phone_verified = toBeCreatedUser.phone_verified;
        builder.profile_photo = toBeCreatedUser.profile_photo;
        builder.gender = toBeCreatedUser.gender;
        builder.birth_date = toBeCreatedUser.birth_date;
        builder._raw._status = 'synced';
      });
      batchActions.push(user);
    }
    await database.write(async ({}) => {
      await database.batch(batchActions);
    });
    batchActions = [];

    for (let index = 0; index < students.length; index++) {
      const student = students[index].student;

      const createdStudent = studentQuery.prepareCreate(builder => {
        builder._raw.id = student.user_id.toString();
        builder.sid = student.user_id;
        builder.user_id = student.user_id.toString();
        builder.parent_phone = student.parent_phone;
        builder.parent_relation = student.parent_relation;
        builder.ssn = student.ssn!;
        builder._raw._status = 'synced';
      });
      batchActions.push(createdStudent);
    }
    await database.write(async ({}) => {
      await database.batch(batchActions);
    });
    batchActions = [];
    for (let index = 0; index < codes.length; index++) {
      const toBeCreatedCode = {...codes[index]};
      const code = query.prepareCreate(builder => {
        builder._raw.id = toBeCreatedCode.id.toString();
        builder._setRaw('student_id', toBeCreatedCode.student?.user_id ?? null);
        builder.sid = toBeCreatedCode.id;
        builder.code = toBeCreatedCode.code;
        builder.group_name = toBeCreatedCode.group_name;
        builder.instructor_id = toBeCreatedCode.instructor_id;
        builder._raw._status = 'synced';
      });
      batchActions.push(code);
    }

    await database.write(async ({}) => {
      await database.batch(batchActions);
    });
  } catch (error) {
    console.error(error);
  }
};
