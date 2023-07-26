import {useNetInfo} from '@react-native-community/netinfo';
import React, {useCallback, useEffect, useState} from 'react';
import {useSyncProvider} from 'src/providers/SyncProvider/SyncProvider';
import {hasUnsyncedChanges} from '@nozbe/watermelondb/sync';
import sync from 'src/database/sync';
import {useDatabase} from '@nozbe/watermelondb/hooks';

export const useSync = () => {
  const {isConnected} = useNetInfo();

  const {isSyncing, setIsSyncing, setSyncFailed, setSyncSuccess} =
    useSyncProvider();

  const database = useDatabase();

  async function checkUnsyncedChanges() {
    return await hasUnsyncedChanges({database});
  }

  const doSync = async (onFinish: () => void) => {
    setSyncFailed(false);
    setSyncSuccess(false);
    setIsSyncing(true);
    try {
      await sync(database);
      setSyncSuccess(true);
    } catch (error) {
      console.error(error)
      setSyncFailed(true);
    }
    setIsSyncing(false);
    onFinish();
  };

  const runSync = async (withChangesCheck = false, onFinish = () => {}) => {
    if (withChangesCheck) {
      const hasChanges = await checkUnsyncedChanges();
      console.log('DB HAS NO CHANGES', hasChanges);
      if (!hasChanges) return;
    }
    await doSync(onFinish);
  };

  return {
    runSync,
  };
};
