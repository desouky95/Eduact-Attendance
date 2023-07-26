import {Model,  Query} from '@nozbe/watermelondb';
import {Associations} from '@nozbe/watermelondb/Model';
import {field, text, relation} from '@nozbe/watermelondb/decorators';
import UnitModel from './UnitModel';

export default class TestModel extends Model {
  static table = 'tests';

  static associations: Associations = {
    units: {type: 'belongs_to', key: 'unit_id'},
  };

  @relation('units', 'unit_id') test!: Query<UnitModel>;

  @field('sid') sid!: number;
  @field('unit_id') unit_id!: string;
  @field('course_id') course_id!: number;
  @text('uuid') uuid!: string;
  @text('title') title!: string;
  @field('overall_score') overall_score!: number;
  @field('passing_value') passing_value!: number;
  @text('passing_unit') passing_unit!: string;
}
