import {Model} from '@nozbe/watermelondb';
import {text, field, children, writer} from '@nozbe/watermelondb/decorators';
import {Associations} from '@nozbe/watermelondb/Model';
import Course from './Course';

export default class ClassroomModel extends Model {
  static table = 'classrooms';

  static associations: Associations = {
    courses: {type: 'has_many', foreignKey: 'classroom_id'},
  };

  @text('title')
  title!: string;

  @field('sid') sid!: number;

  @children('courses') courses!: Course;

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
