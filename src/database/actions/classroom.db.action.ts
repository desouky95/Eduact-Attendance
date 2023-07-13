import {getClassrooms} from 'src/api/classroom/classroom.api';
import {database} from '..';
import Classroom from '../models/Classroom';
import {WithProgressArgs} from 'src/api/api';
import Course from '../models/Course';
import CourseModel from '../models/Course';

export const setupClassrooms = async (withProgress?: WithProgressArgs) => {
  debugger;
  try {
    const {data} = await getClassrooms(withProgress);
    console.log('SETUP CLASSROOMS');
    const classrooms = data.data;
    const courses = classrooms.map(c => c.courses).flat(1);
    const classroomsQuery = database.get<Classroom>('classrooms');
    const coursesQuery = database.get<CourseModel>('courses');
    await Promise.all(
      classrooms.map(classroom => {
        return database.write(async writer => {
          const createdClassroom = classroomsQuery.create(_classroom => {
            _classroom.sid = classroom.id;
            _classroom.title = classroom.title;
          });
          return createdClassroom;
        });
      }),
    );

    await Promise.all(
      courses.map(course => {
        return database.write(async writer => {
          coursesQuery.create(_course => {
            _course.sid = course.id;
            _course.code = course.code;
            _course.classroom_id = course.classroom_id;
          });
        });
      }),
    );
  } catch (error) {
    console.error(error);
  }
  // store.dispatch(completeStep('classrooms'));
};
