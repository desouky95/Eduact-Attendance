import {Model} from '@nozbe/watermelondb';
import {Associations} from '@nozbe/watermelondb/Model';
import {field, text} from '@nozbe/watermelondb/decorators';

export default class TestModel extends Model {
  static table = 'tests';

  static associations: Associations = {
    units: {type: 'belongs_to', key: 'unit_id'},
  };
  @field('sid') sid!: number;
  @field('unit_id') unit_id!: number;
  @field('course_id') course_id!: number;
  @text('uuid') uuid!: string;
  @text('title') title!: string;
  @field('overall_score') overall_score!: number;
  @field('passing_value') passing_value!: number;
  @text('passing_unit') passing_unit!: string;
  
}
