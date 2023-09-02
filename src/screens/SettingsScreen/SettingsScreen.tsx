import {useDatabase} from '@nozbe/watermelondb/hooks';
import {EdButton} from 'components/EdButton/EdButton';
import {Typography} from 'components/Typography/Typography';
import {Box, FlatList, VStack} from 'native-base';
import React from 'react';
import {View} from 'react-native';
import {useAppDispatch} from 'src/store';
import {wipeSetup} from 'src/store/databaseSetupReducer/databaseSetupReducer';

export const SettingsScreen = () => {
  const dispatch = useAppDispatch();
  const database = useDatabase();
  const handleFactoryReset = () => {
    database.write(async () => {
      await database.unsafeResetDatabase();
      
    });
    dispatch(wipeSetup());
  };
  return (
    <View>
      <Box p={3} py={8}>
        <VStack>
          <EdButton onPress={handleFactoryReset} width={'100%'}>
            Factory Reset
          </EdButton>
        </VStack>
      </Box>
    </View>
  );
};
