import {
  DirtyRaw,
  Database,
  TableName,
  Q,
  Model,
  ColumnName,
} from '@nozbe/watermelondb';
import {ISyncChangesAdapter} from './ISyncChangesAdapter';
import {SyncDatabaseChangeSet} from '@nozbe/watermelondb/sync';
import {database} from '..';
import {sanitizedRaw} from '@nozbe/watermelondb/RawRecord';
import WorkQueue, {
  WorkQueueItem,
  WriterInterface,
} from '@nozbe/watermelondb/Database/WorkQueue';
import {differenceBy} from 'lodash';

const findByKeys = (obj: Array<any>, keys: Array<string>) => {
  return (toCompare: any) => {
    return obj.find(_ => {
      let flag = true;
      for (let index = 0; index < keys.length; index++) {
        const key = keys[index];
        if (_[key] !== toCompare[key]) {
          flag = false;
          return false;
        }
      }
      return flag;
    });
  };
};
export class SyncChangesAdapter implements ISyncChangesAdapter {
  toLocal(changes: SyncDatabaseChangeSet): Promise<SyncDatabaseChangeSet> {
    Object.keys(changes).forEach(key => {
      if (changes[key] && changes[key].created) {
        changes[key].created = changes[key].created.map(_ => ({
          ..._,
          id: _.id?.toString(),
        }));
        changes[key].created.forEach(record => {
          const id = record.id?.toString();
          if (!Number(record.id)) {
            if (!changes.deleted) {
              changes[key].deleted = [];
            }
            changes[key].deleted.push(record.id?.toString());
          }
          return record;
        });
      }
      if (changes[key] && changes[key].updated) {
        changes[key].updated = changes[key].updated.map(_ => ({
          ..._,
          id: _.id?.toString(),
        }));
      }
    });

    return Promise.resolve(changes);
  }

  toRemote(changes: SyncDatabaseChangeSet): Promise<SyncDatabaseChangeSet> {
    Object.keys(changes).forEach(key => {
      if (changes[key] && changes[key].created) {
        changes[key] = {
          ...changes[key],
          created: changes[key].created.map(record => {
            return {
              ...record,
              // id: null,
            };
          }),
        };
      }
    });

    return Promise.resolve(changes);
  }

  async toCreatedLocal<T extends Model>(
    key: TableName<T>,
    changes: {created: DirtyRaw[]; updated: DirtyRaw[]; deleted: string[]},
    primaryKeys: Array<keyof T>,
  ): Promise<{created: DirtyRaw[]; updated: DirtyRaw[]; deleted: string[]}> {
    const baseQuery = database.get(key);
    const toBeAltered = await baseQuery.query(Q.where('sid', null)).fetch();
    debugger
    if (toBeAltered.length === 0 || changes?.created?.length === 0)
      return {...changes, created: []};

    const search = findByKeys(changes?.created, primaryKeys as any);
    changes = {...changes, created: changes?.created.filter(_ => search(_))};

    return changes;
  }
}
