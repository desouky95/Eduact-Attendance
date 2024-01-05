import {useNetInfo} from '@react-native-community/netinfo';
import React, {useCallback, useEffect, useState} from 'react';
import {useSyncProvider} from 'src/providers/SyncProvider/SyncProvider';
import {hasUnsyncedChanges} from '@nozbe/watermelondb/sync';
import sync from 'src/database/sync';
import {useDatabase} from '@nozbe/watermelondb/hooks';

export const useSync = () => {
  const {setIsSyncing, setSyncFailed, setSyncSuccess} = useSyncProvider();

  const database = useDatabase();

  async function checkUnsyncedChanges() {
    return await hasUnsyncedChanges({database});
  }

  const doSync = (onFinish: () => void) => {
    console.log('RESET Status');
    setSyncFailed(false);
    setSyncSuccess(false);
    setIsSyncing(true);
    sync(database)
      .then(() => {
        setSyncSuccess(true);
      })
      .catch(error => {
        console.error(error);

        setSyncFailed(true);
      })
      .finally(() => {
        setIsSyncing(false);
        onFinish();
      });
  };

  const runSync = async (withChangesCheck = false, onFinish = () => {}) => {
    console.log('RUNNING SYNC');
    if (withChangesCheck) {
      console.log('CHECKING CHANGES');
      const hasChanges = await checkUnsyncedChanges();
      console.log('DB HAS NO CHANGES', hasChanges);

      if (!hasChanges) return;
    }
    doSync(onFinish);
  };

  return {
    runSync,
  };
};
