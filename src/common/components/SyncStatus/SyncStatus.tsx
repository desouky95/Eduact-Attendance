import {useNetInfo} from '@react-native-community/netinfo';
import {Center, Flex, Text} from 'native-base';
import React, {useEffect, useMemo, useState} from 'react';
import Animated, {useAnimatedStyle, withTiming} from 'react-native-reanimated';
import {useSync} from 'src/hooks/useSync';
import {useSyncProvider} from 'src/providers/SyncProvider/SyncProvider';
import {useAppSelector} from 'src/store';
import {theme} from 'src/theme/theme';

export const SyncStatus = () => {
  const [syncFinish, setSyncFinish] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const {runSync} = useSync();
  const {isSyncing, syncSuccess, syncFailed} = useSyncProvider();
  const {isConnected} = useNetInfo();

  const [syncText, setSyncText] = useState('');
  const {isLogged} = useAppSelector(s => s.auth);

  useEffect(() => {
    if (isConnected && isLogged) {
      runSync(true, () => {});
    }
  }, [isConnected]);

  useEffect(() => {
    if (isSyncing) {
      setSyncText('Syncing...');
      setFadeOut(isSyncing);
    }
  }, [isSyncing]);

  useEffect(() => {
    if (syncFailed || syncSuccess) {
      setSyncText(
        syncFailed ? 'Sync Failed' : syncSuccess ? 'Sync Success' : '',
      );
      setTimeout(() => {
        setFadeOut(false);
      }, 1000);
    }
  }, [syncSuccess, syncFailed, isSyncing]);

  const syncStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(fadeOut && isLogged ? 40 : 0, {duration: 100}),
      backgroundColor: withTiming(
        syncSuccess
          ? theme.colors.success[600]
          : syncFailed
          ? theme.colors.error[600]
          : theme.colors.primary.main,
      ),
      transform: [
        {scaleY: withTiming(fadeOut && isLogged ? 1 : 0, {duration: 100})},
      ],
    };
  }, [fadeOut, syncSuccess, syncFailed, isLogged]);
  return (
    <Animated.View style={[{width: '100%'}, syncStyle]}>
      <Flex p={2}>
        <Center>
          <Text>{syncText}</Text>
        </Center>
      </Flex>
    </Animated.View>
  );
};
