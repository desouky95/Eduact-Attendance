import {useDatabase} from '@nozbe/watermelondb/hooks';
import {useNetInfo} from '@react-native-community/netinfo';
import {EdButton} from 'components/EdButton/EdButton';
import {Typography} from 'components/Typography/Typography';
import {Box, VStack} from 'native-base';
import React from 'react';
import {View} from 'react-native';
import {useAppDispatch} from 'src/store';
import {wipeSetup} from 'src/store/databaseSetupReducer/databaseSetupReducer';
import DeviceInfo, {
  getManufacturerSync,
  getUsedMemorySync,
  getApiLevelSync,
  getSystemName,
  getModel,
  getProductSync,
  getReadableVersion,
  getDeviceNameSync,
} from 'react-native-device-info';
import {useWindowDimensions} from 'react-native';
import styled from 'styled-components/native';
export const SettingsScreen = () => {
  const dispatch = useAppDispatch();
  const database = useDatabase();
  const handleFactoryReset = () => {
    database.write(async () => {
      await database.unsafeResetDatabase();
    });
    dispatch(wipeSetup());
  };
  const {isConnected} = useNetInfo();

  const {fontScale} = useWindowDimensions();
  const deviceName = getDeviceNameSync();
  const manufacturer = getManufacturerSync();
  const usedMemory = getUsedMemorySync();
  const api = getApiLevelSync();
  const systemName = getSystemName();
  const model = getModel();
  const version = getReadableVersion();
  const appVersion = DeviceInfo.getVersion();
  // function formatBytes(bytes: number, decimals: number = 2) {
  //   if (!+bytes) return '0 Bytes';

  //   const k = 1024;
  //   const dm = decimals < 0 ? 0 : decimals;
  //   const sizes = [
  //     'Bytes',
  //     'KiB',
  //     'MiB',
  //     'GiB',
  //     'TiB',
  //     'PiB',
  //     'EiB',
  //     'ZiB',
  //     'YiB',
  //   ];

  //   const i = Math.floor(Math.log(bytes) / Math.log(k));

  //   return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  // }
  return (
    <View style={{flex: 1}}>
      <Box p={3} py={8} flex={1}>
        <VStack flex={1}>
          <EdButton
            disabled={!isConnected}
            onPress={handleFactoryReset}
            width={'100%'}>
            Factory Reset
          </EdButton>
        </VStack>
        <VStack
          justifyContent="center"
          alignItems="center"
          fontSize={fontScale * 10}>
          {/* <SettingsTypography fontScale={fontScale}>
            Used Memory: {formatBytes(usedMemory)}
          </SettingsTypography> */}
          <SettingsTypography fontScale={fontScale}>
            {systemName} / {manufacturer} / {version} / {api}
          </SettingsTypography>
          <SettingsTypography fontScale={fontScale}>
            Version {appVersion}
          </SettingsTypography>
        </VStack>
      </Box>
    </View>
  );
};

const SettingsTypography = styled(Typography)<{fontScale: number}>`
  font-size: ${p => p.fontScale * 10}px;
  color: ${p => p.theme.colors.gray[400]};
`;
