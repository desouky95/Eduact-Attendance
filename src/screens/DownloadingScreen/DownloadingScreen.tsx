import {Spacer} from 'components/Spacer/Spacer';
import {Typography} from 'components/Typography/Typography';
import {Flex} from 'native-base';
import {Center, Progress} from 'native-base';
import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import {apiConfig} from 'src/api/api';
import {getClassrooms} from 'src/api/classroom/classroom.api';
import sync from 'src/database/sync';
import {useDatabase} from '@nozbe/watermelondb/hooks';
import {useAppDispatch, useAppSelector} from 'src/store';
import {setupClassrooms} from 'src/database/actions/classroom.db.action';
import {AxiosProgressEvent} from 'axios';
import {actionsMap} from 'src/database/actions/actions.map';
import {
  Step,
  completeDBSetup,
  completeStep,
} from 'src/store/databaseSetupReducer/databaseSetupReducer';

export const DownloadingScreen = () => {
  const [value, setValue] = useState(0);
  const [current, setCurrent] = useState('');
  const [total, setTotal] = useState('');

  const [finishSetup, setFinishSetup] = useState(false);
  const dispatch = useAppDispatch();
  const {steps} = useAppSelector(s => s.db);
  useEffect(() => {
    setupDatabase();
  }, []);

  const handleDownloadProgress = (event: AxiosProgressEvent) => {
    console.log(event);
    // const total =
    // event.event.target.responseHeaders['content-length']; // total
    const total = event.total ?? 1;
    // const current = event.event.target.response.length;
    const current = event.loaded;
    let percentCompleted = Math.floor(event.progress! * 100);
    const totalInMb = (total / (1024 * 1024)).toFixed(2);
    const currentInMb = (total / (1024 * 1024)).toFixed(2);
    setValue(percentCompleted);
    setTotal(totalInMb);
    setCurrent(currentInMb);
  };
  const setupDatabase = async () => {
    try {
      console.log('SETUP DATABASE');
      Object.entries(actionsMap).map(async ([key, action]) => {
        if (!steps[key as Step])
          await action({
            onDownloadProgress: handleDownloadProgress,
          });
        dispatch(completeStep(key as Step));
      });
      setFinishSetup(true)
    } catch (error) {}
  };

  useEffect(() => {
    if (finishSetup) {
      dispatch(completeDBSetup());
    }
  }, [finishSetup]);
  return (
    <View style={{flex: 1}}>
      <Center flex="1" alignItems="center">
        <Flex my="10" alignItems="flex-end">
          <Progress w="200" value={value} max={100} colorScheme="error" />
          <Spacer mb="2" />
          <Typography fontWeight={'bold'}>
            {current} mb of {total} mb
          </Typography>
        </Flex>
        <Text>
          Setting up app... Almost there! We're preparing everything for you.
          Thank you for your patience.
        </Text>
      </Center>
    </View>
  );
};
