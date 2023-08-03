import {Model, Query, Relation} from '@nozbe/watermelondb';
import {field, relation, text} from '@nozbe/watermelondb/decorators';
import TestModel from './TestModel';
import {Associations} from '@nozbe/watermelondb/Model';

export default class UnitModel extends Model {
  static table = 'units';

  static associations: Associations = {
    courses: {type: 'belongs_to', key: 'course_id'},
  };
  @relation('tests', 'unit_id') test!: Relation<TestModel>;

  @field('sid') sid!: number;
  @field('course_id') course_id!: string;
  @field('name') name!: string;
}
