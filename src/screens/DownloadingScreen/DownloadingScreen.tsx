import {Spacer} from 'components/Spacer/Spacer';
import {Typography} from 'components/Typography/Typography';
import {Button, Flex} from 'native-base';
import {Center} from 'native-base';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Text, View} from 'react-native';
import {useAppDispatch, useAppSelector} from 'src/store';
import {actionsMap} from 'src/database/actions/actions.map';
import {
  Step,
  completeDBSetup,
  completeStep,
} from 'src/store/databaseSetupReducer/databaseSetupReducer';
import {DownloadAction} from './components/DownloadAction';
import {Spinner} from 'native-base';
import {WithProgressArgs} from 'src/api/api';
import {useDatabase} from '@nozbe/watermelondb/hooks';
const DownloadingScreenUI = () => {
  const [finishSetup, setFinishSetup] = useState(false);
  const [startSetup, setStartSetup] = useState(false);
  const dispatch = useAppDispatch();
  const {steps} = useAppSelector(s => s.db);

  const [actionsToProcess, setActionsToProcess] = useState<
    {key: string; action: (args?: WithProgressArgs) => Promise<any>}[]
  >([]);

  const database = useDatabase();

  const actions = useRef(actionsMap);
  function setupDatabase() {
    debugger;
    Object.entries(actionsMap).forEach(([key, action]) => {
      if (!steps[key as Step]) {
        setActionsToProcess(prev => [...prev, {key, action}]);
      }
    });
    setStartSetup(true);
  }

  useEffect(() => {
    // setupDatabase();
    setStartSetup(true);
  }, []);

  useEffect(() => {
    if (!startSetup) return;
    const processActions = async () => {
      try {
        const promiseCallableActions = Object.entries(actions.current)
          .filter(([key]) => !steps[key as any as Step])
          .map(async ([key, action]) => {
            return action().then(() => {
              dispatch(completeStep(key as Step));
            });
          });
        await Promise.all(promiseCallableActions);
      } catch (error: any) {
        throw new Error(error['message']);
      }
    };
    if (startSetup) {
      processActions().then(() => {
        setFinishSetup(true);
      });
    }
  }, [startSetup]);

  const handleGettingStarted = () => {
    dispatch(completeDBSetup());
  };

  useEffect(() => {
    if (Object.values(steps).some(_ => _ === false)) return;

    setFinishSetup(true);
  }, [steps]);

  return (
    <View style={{flex: 1}}>
      <Center flex="1" alignItems="center" backgroundColor={'gray.200'}>
        {!finishSetup && (
          <>
            <Spinner size={'lg'} />
            <Text>
              Setting up app... Almost there! We're preparing everything for
              you. Thank you for your patience.
            </Text>
          </>
        )}
        {finishSetup && (
          <>
            <Text>Setup finished</Text>
            <Flex my="10" alignItems="flex-end">
              <Button onPress={() => handleGettingStarted()}>Start</Button>
            </Flex>
          </>
        )}
      </Center>
    </View>
  );
};

export const DownloadingScreen = React.memo(DownloadingScreenUI);
