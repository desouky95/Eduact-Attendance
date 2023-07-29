import {Model, Query} from '@nozbe/watermelondb';
import {Associations} from '@nozbe/watermelondb/Model';
import {field, text, relation} from '@nozbe/watermelondb/decorators';
import UnitModel from './UnitModel';

export default class TestAttemptModel extends Model {
  static table = 'test_attempts';

  static associations: Associations = {
    tests: {type: 'belongs_to', key: 'test_id'},
  };

  @relation('tests', 'test_id') test!: Query<UnitModel>;

  @field('active') boolean!: boolean;
  @field('grade') grade!: string | null;
  @field('status') status!: string | null;
  @field('score') score!: number | null;
  @text('test_id') test_id!: string;
  @field('s_test_id') s_test_id!: number;
  @field('student_id') student_id!: string;
  @field('s_student_id') s_student_id!: string;
}
