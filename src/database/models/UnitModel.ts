import {Model, Query} from '@nozbe/watermelondb';
import {field, relation, text} from '@nozbe/watermelondb/decorators';
import TestModel from './TestModel';

export default class UnitModel extends Model {
  static table = 'units';

  @relation('tests', 'unit_id') test!: Query<TestModel>;


  @field('sid') sid!: number;
  @field('course_id') course_id!: number;
}
