import {useDatabase} from '@nozbe/watermelondb/hooks';
import {useNetInfo} from '@react-native-community/netinfo';
import {EdButton} from 'components/EdButton/EdButton';
import {Typography} from 'components/Typography/Typography';
import {Box, FlatList, HStack, VStack} from 'native-base';
import React from 'react';
import {View} from 'react-native';
import {useAppDispatch, useAppSelector} from 'src/store';
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
import {theme} from 'src/theme/theme';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Spacer} from 'components/Spacer/Spacer';
import {Divider} from 'native-base';
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

  const {steps} = useAppSelector(s => s.db);

  return (
    <View style={{flex: 1}}>
      <Box p={3} py={8} flex={1}>
        <VStack flex={1} mb={4}>
          <VStack flex={1} mb={6}>
            <Typography fontWeight="bold" fontSize={fontScale * 18}>
              Modules:
            </Typography>
            <Spacer mb={3} />
            <FlatList
              data={Object.entries(steps)}
              renderItem={({item}) => {
                const [key, status] = item;
                return (
                  <HStack alignItems="center">
                    {status && (
                      <Icon
                        size={fontScale * 24}
                        name="check-box"
                        color={theme.colors.success[500]}
                      />
                    )}
                    {!status && (
                      <Icon
                        size={fontScale * 24}
                        name="warning"
                        color={theme.colors.error[500]}
                      />
                    )}
                    <Spacer mx={2} />
                    <Typography
                      fontSize={fontScale * 16}
                      color={status ? theme.colors.gray[400] : '#000'}
                      style={
                        {
                          // textDecorationStyle: 'solid',
                          // textDecorationLine: 'line-through',
                        }
                      }>
                      {key}
                    </Typography>
                  </HStack>
                );
              }}
            />
          </VStack>
          <Box>
            <EdButton
              disabled={!isConnected}
              onPress={handleFactoryReset}
              // colorScheme="warning"
              bgColor={'warning.500'}
              width={'100%'}>
              Factory Reset
            </EdButton>
          </Box>
        </VStack>
        <VStack
          justifyContent="center"
          alignItems="center"
          fontSize={fontScale * 10}>
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
