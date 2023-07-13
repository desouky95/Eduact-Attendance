import {Model} from '@nozbe/watermelondb';
import {Associations} from '@nozbe/watermelondb/Model';
import {field, relation, text, writer} from '@nozbe/watermelondb/decorators';
import Classroom from './Classroom';

export default class CourseModel extends Model {
  static table = 'courses';

  static associations: Associations = {
    classrooms: {type: 'belongs_to', key: 'classroom_id'},
  };

  @text('name') name!: string;
  @text('code') code!: string;
  @field('classroom_id') classroom_id!: number;
  @field('sid') sid!: number;
  @field('section_id') section_id!: number;

  @relation('classrooms', 'classroom_id') classroom!: Classroom;

  @writer async addCourse(course: Course) {
    const newCourse = await this.collections
      .get<CourseModel>('courses')
      .create(_course => {
        _course.sid = course.id;
        _course.code = course.code;
        _course.classroom_id = course.classroom_id;
      });
    return newCourse;
  }
}
