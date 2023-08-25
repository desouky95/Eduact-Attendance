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
import EnrolledClassroomModel from './EnrolledClassroomModel';

export default class GroupModel extends Model {
  static table = 'groups';

  static associations: Associations = {
    classrooms: {type: 'belongs_to', key: 'classroom_id'},
    enroll_classrooms: {type: 'has_many', foreignKey: 'group_id'},
  };

  @text('sid') sid!: number;
  @text('code') code!: string;
  @field('classroom_id') classroom_id!: number;
  @field('name') name!: string;

  @relation('classrooms', 'classroom_id') classroom!: Query<ClassroomModel>;
  @relation('enroll_classrooms', 'group_id')
  enrollment!: Query<EnrolledClassroomModel>;
}
