import {
  useNetInfo,
  addEventListener,
  configure,
  refresh,
} from '@react-native-community/netinfo';
import {Badge, Box, Button, Center, Flex, HStack, useTheme} from 'native-base';
import React, {useEffect, useState, useMemo} from 'react';
import {Text, View} from 'react-native';
import {useSnackbar} from 'src/hooks/useSnackbar';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  withTiming,
  SlideInDown,
  SlideOutUp,
  Layout,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialIcons';
import sync from 'src/database/sync';
import {useDatabase} from '@nozbe/watermelondb/hooks';
import {hasUnsyncedChanges} from '@nozbe/watermelondb/sync';
import {useSync} from 'src/hooks/useSync';
import {useSyncProvider} from 'src/providers/SyncProvider/SyncProvider';
import {useAppSelector} from 'src/store';

export const NetworkStatus = () => {
  const {isConnected} = useNetInfo();
  const [fadeOut, setFadeOut] = useState(false);
  const {openSnackbar, closeSnackbar} = useSnackbar();

  useEffect(() => {
    if (!isConnected) {
      setFadeOut(true);
      openSnackbar({
        variant: 'error',
        message: 'Lost internet. Keep using the app. 🕛',
        duration: 5000,
      });
    } else {
      setFadeOut(false);
      closeSnackbar();
    }
  }, [isConnected]);

  const theme = useTheme();

  const handleBackOnlineAnimationEnd = () => {
    setTimeout(() => {
      setFadeOut(false);
    }, 500);
  };

  const animatedStyle = useAnimatedStyle(() => {
    const color = !isConnected
      ? theme.colors.red[100]
      : theme.colors.success[400];

    return {
      backgroundColor: withTiming(
        color,
        {duration: 400, easing: Easing.ease},
        cb => {
          if (cb && isConnected) {
            runOnJS(handleBackOnlineAnimationEnd)();
          }
        },
      ),
    };
  }, [isConnected]);

  const text = isConnected ? 'Online' : 'No Internet Connection';

  return (
    <>
      {fadeOut && (
        <>
          <Animated.View
            style={[{padding: 3, paddingVertical: 7}, animatedStyle]}>
            <HStack justifyContent="center" alignItems={'center'} space={3}>
              {isConnected && <Icon name="wifi" />}
              {!isConnected && <Icon name="signal-wifi-off" />}
              <Text>{text}</Text>
            </HStack>
          </Animated.View>
        </>
      )}
    </>
  );
};
