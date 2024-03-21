import {getClassrooms} from 'src/api/classroom/classroom.api';
import {database} from '..';
import Classroom from '../models/Classroom';
import {WithProgressArgs} from 'src/api/api';
import Course from '../models/Course';
import CourseModel from '../models/Course';
import {Model} from '@nozbe/watermelondb';
import TestModel from '../models/TestModel';
import UnitModel from '../models/UnitModel';
import {getGroups} from 'src/api/classroom/group.api';
import GroupModel from '../models/GroupModel';
import {sanitizedRaw} from '@nozbe/watermelondb/RawRecord';
import {getTestAttempts} from 'src/api/classroom/attempts.api';
import TestAttemptModel from '../models/TestAttemptModel';

export const setupClassrooms = async (withProgress?: WithProgressArgs) => {
  try {
    const {data} = await getClassrooms(withProgress);
    const groupsResponse = await getGroups(withProgress);
    const classrooms = data.data;
    const courses = classrooms.map(c => c.courses).flat(1);
    const units = courses.map(c => c.units).flat(1);
    const classroomsQuery = database.get<Classroom>('classrooms');
    const coursesQuery = database.get<CourseModel>('courses');
    const unitsQuery = database.collections.get<UnitModel>('units');
    const testsQuery = database.collections.get<TestModel>('tests');
    const groupsQuery = database.collections.get<GroupModel>(GroupModel.table);

    const batchActions: boolean | void | Model | Model[] | null = [];
    for (let index = 0; index < classrooms.length; index++) {
      const classroom = classrooms[index];
      batchActions.push(
        classroomsQuery.prepareCreate(_classroom => {
          _classroom._raw.id = classroom.id.toString();
          _classroom.sid = classroom.id;
          _classroom.title = classroom.title;
          _classroom.code = classroom.code;
          _classroom.active = classroom.active;
          _classroom.accessible = classroom.accessible;
          _classroom.admission_status = classroom.admission_status;
          _classroom.category_id = classroom.category_id;
          _classroom.current_course = classroom.current_course;
          _classroom.description = classroom.description;
          _classroom.has_admission = classroom.has_admission;
          _classroom.instructor_id = classroom.instructor_id;
          _classroom.label = classroom.label;
          _classroom.rating = classroom.rating;
          _classroom.status = classroom.status;
          _classroom.sub_type = classroom.sub_type;
          _classroom.thumbnail = classroom.thumbnail;
          // _classroom.type = classroom.type;
          _classroom.weight = classroom.weight;
          _classroom._raw._status = 'synced';
        }),
      );
    }

    for (let index = 0; index < courses.length; index++) {
      const course = courses[index];
      batchActions.push(
        coursesQuery.prepareCreate(_course => {
          _course._raw.id = course.id.toString();
          _course.sid = course.id;
          _course.code = course.code;
          _course.classroom_id = course.classroom_id;
          _course.active = course.active;
          _course.buyable = course.buyable;
          _course.description = course.description!;
          _course.name = course.name;
          _course.old_price = course.old_price!;
          _course.order = course.order;
          _course.preview_url = course.preview_url!;
          _course.price = course.price;
          _course.section_id = course.section_id;
          _course.thumbnail = course.thumbnail!;
          _course._raw._status = 'synced';
        }),
      );
    }

    for (let index = 0; index < units.length; index++) {
      const unit = units[index];
      const test = unit.test;
      batchActions.push(
        unitsQuery.prepareCreate(builder => {
          builder.sid = unit.id;
          builder.name = unit.name;
          builder._raw.id = unit.id.toString();
          builder.course_id = unit.course_id.toString();
          builder._raw._status = 'synced';
        }),
      );
      batchActions.push(
        testsQuery.prepareCreate(builder => {
          builder._raw.id = test.id.toString();
          builder.sid = test.id;
          builder.unit_id = test.unit_id.toString();
          builder.overall_score = test.overall_score;
          builder.passing_unit = test.passing_unit;
          builder.passing_value = test.passing_value;
          builder.title = test.title;
          builder.uuid = test.uuid;
          builder._raw._status = 'synced';
        }),
      );
    }

    for (let index = 0; index < groupsResponse.data.data.length; index++) {
      const group = groupsResponse.data.data[index];
      batchActions.push(
        groupsQuery.prepareCreate(builder => {
          builder._raw = sanitizedRaw(
            {
              id: group.id.toString(),
              sid: group.id,
              name: group.name,
              code: group.code,
              classroom_id: group.classroom_id.toString(),
            },
            groupsQuery.schema,
          );
          builder._raw._status = 'synced';
        }),
      );
    }

    await database.write(async () => {
      await database.batch(batchActions);
    });
  } catch (error: any) {
    throw new Error(error['message']);
  }
  // store.dispatch(completeStep('classrooms'));
};
