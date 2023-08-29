import {Model} from '@nozbe/watermelondb';
import {field, writer, action} from '@nozbe/watermelondb/decorators';

export default class CourseReferenceModel extends Model {
  static table = 'references';

  @field('course_id') course_id!: number;
  @field('center_course_id') center_course_id?: number | null;
  @field('quiz_id') quiz_id?: number | null;
  @field('homework_id') homework_id?: number | null;
  @field('online_classroom_id') online_classroom_id?: number | null;
  @field('online_course_id') online_course_id!: number | null;
  @field('online_quiz_id') online_quiz_id?: number | null;
  @field('online_homework_id') online_homework_id?: number | null;
  @field('group_id') group_id?: number | null;

  @writer async save(formData: ReferenceFormData) {
    return await this.update(builder => {
      builder.center_course_id = formData.center_course_id;
      builder.quiz_id = formData.quiz_id;
      builder.homework_id = formData.homework_id;
      builder.online_classroom_id = formData.online_classroom_id;
      builder.online_course_id = formData.online_course_id;
      builder.online_quiz_id = formData.online_quiz_id;
      builder.online_homework_id = formData.online_homework_id;
      builder.group_id = formData.group_id;
    });
  }

  @writer async clear() {
    return await this.update(builder => {
      builder.center_course_id = null;
      builder.quiz_id = null;
      builder.homework_id = null;
      builder.online_classroom_id = null;
      builder.online_course_id = null;
      builder.online_quiz_id = null;
      builder.online_homework_id = null;
      builder.group_id = null;
    });
  }
}
