import {synchronize} from '@nozbe/watermelondb/sync';
import {WithProgressArgs, api} from 'src/api/api';
import {database} from '.';
// your_local_machine_ip_address usually looks like 192.168.0.x
// on *nix system, you would find it out by running the ifconfig command
// const SYNC_API_URL = 'http://<your_local_machine_ip_address>:3333/sync';
export default async function sync(args?: WithProgressArgs) {
  console.log('SYNC');
  await synchronize({
    database,
    pullChanges: async ({lastPulledAt}) => {
      try {
        const response = await api.get('sync', {
          data: JSON.stringify(lastPulledAt),
          onDownloadProgress: args?.onDownloadProgress,
        });

        const {changes, timestamp} = response.data;
        return {changes, timestamp};
      } catch (error) {
        throw new Error(error);
      }
    },
    pushChanges: async ({changes, lastPulledAt}) => {
      try {
        const response = await api.post(
          `sync?lastPulledAt=${lastPulledAt}`,
          JSON.stringify(changes),
        );
      } catch (error) {
        throw new Error(error);
      }
    },
  });
}
