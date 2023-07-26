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

export default class GroupModel extends Model {
  static table = 'groups';

  static associations: Associations = {
    classrooms: {type: 'belongs_to', key: 'classroom_id'},
  };

  @text('sid') sid!: number;
  @text('code') code!: string;
  @field('classroom_id') classroom_id!: number;
  @field('name') name!: string;

  @relation('classrooms', 'classroom_id') classroom!: Query<ClassroomModel>;
}
