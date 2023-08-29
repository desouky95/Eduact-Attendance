import {Spacer} from 'components/Spacer/Spacer';
import {Typography} from 'components/Typography/Typography';
import {Button, Flex, HStack} from 'native-base';
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
import LottieView from 'lottie-react-native';
import {VStack} from 'native-base';
import {getServerTimestampAction} from 'src/database/actions/server.timestamp.action';
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

  useEffect(() => {
    // setupDatabase();
    setStartSetup(true);
  }, []);

  const successAnimation = useRef<LottieView | null>(null);

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
        // await Promise.all(promiseCallableActions);
      } catch (error: any) {
        throw new Error(error['message']);
      }
    };
    if (startSetup) {
      processActions().then(() => {
        setFinishSetup(true);
        getServerTimestampAction();
        successAnimation.current?.play();
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
      <Center
        flex="1"
        alignItems="center"
        backgroundColor={'gray.50'}
        padding={4}>
        {!finishSetup && (
          <>
            <LottieView
              source={require('assets/animations/downloading.json')}
              autoPlay
              loop
              style={{width: 400, height: 400}}
            />
            <Flex>
              <Typography fontSize={'24px'} fontWeight={'bold'}>
                Setting up app... Almost there!
              </Typography>
              <Typography fontSize={'24px'} fontWeight={'bold'}>
                We're preparing everything for you. Thank you for your patience.
              </Typography>
            </Flex>
          </>
        )}
        {finishSetup && (
          <VStack width="100%" flex={1}>
            <Flex flex={1} alignItems="center" justifyContent="center">
              <LottieView
                source={require('assets/animations/check.json')}
                autoPlay
                ref={anim => {
                  successAnimation.current = anim;
                }}
                speed={0.3}
                loop={false}
                style={{width: 400, height: 400}}
              />
            </Flex>
            <Button
              colorScheme={'lightBlue'}
              width={'100%'}
              size="lg"
              rounded={'full'}
              _text={{fontWeight: 'bold'}}
              onPress={() => handleGettingStarted()}>
              Start
            </Button>
          </VStack>
        )}
      </Center>
    </View>
  );
};

export const DownloadingScreen = React.memo(DownloadingScreenUI);
