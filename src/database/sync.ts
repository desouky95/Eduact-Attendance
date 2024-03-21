import {SyncPullResult, synchronize} from '@nozbe/watermelondb/sync';
import {WithProgressArgs, api} from 'src/api/api';
import {database} from '.';
import {Database} from '@nozbe/watermelondb';
import {SyncChangesAdapter} from './SyncAdapter/SyncChangesAdapter';
import {store} from 'src/store';
import CenterAttendanceModel from './models/CenterAttendanceModel';
import EnrolledCourseModel from './models/EnrolledCourseModel';
import EnrolledClassroomModel from './models/EnrolledClassroomModel';
// import {database} from '.';

export default function sync(database: Database) {
  const syncAdapter = new SyncChangesAdapter();

  return new Promise((resolve, reject) => {
    synchronize({
      database,
      pullChanges: async ({lastPulledAt, migration, schemaVersion}) => {
        try {
          const firstDownloadTimeStamp =
            store.getState().db.db_first_download_timestamp;
          console.log(store.getState().db.db_first_download_timestamp);
          const last_pulled_at = lastPulledAt ?? firstDownloadTimeStamp;
          const urlParams = `last_pulled_at=${last_pulled_at}&schema_version=${schemaVersion}&migration=${encodeURIComponent(
            JSON.stringify(migration),
          )}`;

          const response = await api.get(`sync?${urlParams}`);

          const {changes, timestamp} = response.data;
          const {
            classrooms,
            courses,
            units,
            tests,
            users,
            students,
            test_attempts,
            instructor_codes,
            groups,
          } = await syncAdapter.toLocal(changes);

          const center_attendences =
            await syncAdapter.toCreatedLocal<CenterAttendanceModel>(
              'center_attendences',
              changes.center_attendences,
            );

          const enroll_courses =
            await syncAdapter.toCreatedLocal<EnrolledCourseModel>(
              'enroll_courses',
              changes.enroll_courses,
            );
          const enroll_classrooms =
            await syncAdapter.toCreatedLocal<EnrolledClassroomModel>(
              'enroll_classrooms',
              changes.enroll_classrooms,
            );

          // require('@nozbe/watermelondb/sync/debugPrintChanges').default(
          //   changes,
          //   false,
          // );
          return {
            changes: {
              classrooms,
              courses,
              units,
              tests,
              users,
              students,
              test_attempts,
              instructor_codes,
              groups,
              center_attendences,
              enroll_courses,
              enroll_classrooms,
            },
            timestamp,
          };
        } catch (error: any) {
          console.error(error);
          throw new Error(error['message']);
        }
      },
      pushChanges: async ({changes, lastPulledAt}) => {
        try {
          // require('@nozbe/watermelondb/sync/debugPrintChanges').default(
          //   changes,
          //   true,
          // );
          const {enroll_courses, enroll_classrooms, center_attendences} =
            changes;
          // let mappedChanges = await syncAdapter.toRemote(changes);
          // console.log('PUSHING CHANGES', mappedChanges);
          await api.post(`sync?lastPulledAt=${lastPulledAt}`, {
            enroll_classrooms,
            enroll_courses,
            center_attendences,
          });
        } catch (error: any) {
          console.error(error);
          throw new Error(error['message']);
        }
      },
      migrationsEnabledAtVersion: 6,
      // conflictResolver: (table, local, remote, resolved) => {
      //   debugger;
      //   return {};
      // },
      // sendCreatedAsUpdated: true,
      async onWillApplyRemoteChanges(info) {
        // console.log('Remote Changes', info);
      },
      async onDidPullChanges(_) {
        // console.log(_);
      },
    })
      .then(value => {
        console.log('SYNCHRONIZE FINISHED');
        resolve(value);
      })
      .catch(err => reject(err));
  });
}
