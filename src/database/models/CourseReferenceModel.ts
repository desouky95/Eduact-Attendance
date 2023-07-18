import {Model} from '@nozbe/watermelondb';
import {field, text} from '@nozbe/watermelondb/decorators';

export default class CourseReferenceModel extends Model {
  static table = 'references';

  @field('course_id') course_id!: number;
  @field('quiz_id') quiz_id!: number;
  @field('homework_id') homework_id!: number;
  @field('online_classroom_id') online_classroom_id!: number;
  @field('online_course_id') online_course_id!: number;
  @field('online_quiz_id') online_quiz_id!: number;
  @field('online_homework_id') online_homework_id!: number;
}
