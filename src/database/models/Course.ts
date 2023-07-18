import {Model, Query} from '@nozbe/watermelondb';
import {Associations} from '@nozbe/watermelondb/Model';
import {
  children,
  field,
  relation,
  text,
  writer,
} from '@nozbe/watermelondb/decorators';
import ClassroomModel from './Classroom';
import UnitModel from './UnitModel';

export default class CourseModel extends Model {
  static table = 'courses';

  static associations: Associations = {
    classrooms: {type: 'belongs_to', key: 'classroom_id'},
    units: {type: 'has_many', foreignKey: 'unit_id'},
  };

  @text('name') name!: string;
  @text('code') code!: string;
  @field('classroom_id') classroom_id!: number;
  @field('sid') sid!: number;
  @field('section_id') section_id!: number;
  @field('description') description!: string;
  @field('thumbnail') thumbnail!: string;
  @field('preview_url') preview_url!: string;
  @field('price') price!: number;
  @field('old_price') old_price!: number;
  @field('order') order!: number;
  @field('active') active!: boolean;
  @field('buyable') buyable!: boolean;

  @relation('classrooms', 'classroom_id') classroom!: Query<ClassroomModel>;

  @children('units') units!: Query<UnitModel>;

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
