import {BottomTabHeaderProps} from '@react-navigation/bottom-tabs';
import {NativeStackHeaderProps} from '@react-navigation/native-stack';
import {logo} from 'assets/index';
import React, {useState} from 'react';
import {BackHandler, Image, Text, TouchableOpacity, View} from 'react-native';
import {
  useAnimatedStyle,
  withRepeat,
  withSpring,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useSyncProvider} from 'src/providers/SyncProvider/SyncProvider';
import Animated from 'react-native-reanimated';
import {useSync} from 'src/hooks/useSync';
import {useNetInfo} from '@react-native-community/netinfo';

export const HomeHeader = ({
  back,
  navigation,
  route,
  options,
}: NativeStackHeaderProps) => {
  const {isSyncing} = useSyncProvider();

  console.log('back', back);
  console.log('route', route);
  console.log('navigation', navigation);

  const {isConnected} = useNetInfo();
  const syncStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: withRepeat(
            withSpring(isSyncing ? '360deg' : '0deg', {
              damping: 10,
              mass: 1,
              stiffness: 100,
              restDisplacementThreshold: 0.001,
              restSpeedThreshold: 0.001,
            }),
          ),
        },
      ],
    };
  }, [isSyncing]);

  const {runSync} = useSync();
  return (
    <View
      style={{
        height: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
        elevation: 4,
        shadowColor: '#000',
        // paddingVertical : 20,
      }}>
      <View style={{minWidth: 40, alignItems: 'center'}}>
        {back && (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.5}>
            <Icon name="chevron-left" size={22} color={'#5AC0FC'} />
          </TouchableOpacity>
        )}
      </View>
      <View
        style={{
          flex: 1,
          height: 30,
          alignItems: 'center',
          overflow: 'scroll',
        }}>
        <Image resizeMode="contain" style={{height: '100%'}} source={logo} />
      </View>

      <Animated.View
        style={[
          {
            minWidth: 40,
            alignItems: 'center',
          },
          syncStyle,
        ]}>
        <Icon
          onPress={() => {
            if (!isConnected) return;
            runSync();
          }}
          disabled={!isConnected}
          style={{opacity: isConnected ? 1 : 0.5}}
          name="sync"
          size={22}
          color={'#5AC0FC'}
        />
      </Animated.View>
    </View>
  );
};
