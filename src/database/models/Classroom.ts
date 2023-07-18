import {Model, Q, Query} from '@nozbe/watermelondb';
import {text, field, children, writer} from '@nozbe/watermelondb/decorators';
import {Associations} from '@nozbe/watermelondb/Model';
import CourseModel from './Course';

export default class ClassroomModel extends Model {
  static table = 'classrooms';

  static associations: Associations = {
    courses: {type: 'has_many', foreignKey: 'classroom_id'},
  };

  @text('title') title!: string;

  @field('sid') sid!: number;
  @field('instructor_id') instructor_id!: number;
  @field('category_id') category_id!: number;
  @field('current_course') current_course!: number;
  @field('type') type!: string;
  @field('sub_type') sub_type!: string;
  @field('description') description!: string;
  @field('language') language!: string;
  @field('thumbnail') thumbnail!: string;
  @field('status') status!: string;
  @field('active') active!: boolean;
  @field('accessible') accessible!: boolean;
  @field('weight') weight!: number;
  @field('has_admission') has_admission!: boolean;
  @field('admission_status') admission_status!: boolean;
  @field('code') code!: string;
  @field('rating') rating!: number;
  @text('label') label!: string;

  @children('courses') courses!: Query<CourseModel>;

  @writer async addClassroom(classroom: Classroom) {
    const newClassroom = await this.collections
      .get<ClassroomModel>('classrooms')
      .create(_classroom => {
        _classroom.title = classroom.title;
        _classroom.sid = classroom.id;
      });
    return newClassroom;
  }
}
