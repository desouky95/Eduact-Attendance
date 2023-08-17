import {Database, TableName} from '@nozbe/watermelondb';
import {
  SyncDatabaseChangeSet,
  SyncTableChangeSet,
} from '@nozbe/watermelondb/sync';

export interface ISyncChangesAdapter {
  toLocal(changes: SyncDatabaseChangeSet): Promise<SyncDatabaseChangeSet>;
  toRemote(changes: SyncDatabaseChangeSet): Promise<SyncDatabaseChangeSet>;

  toCreatedLocal(
    key: string,
    changes: SyncTableChangeSet,
  ): Promise<SyncTableChangeSet>;
}
