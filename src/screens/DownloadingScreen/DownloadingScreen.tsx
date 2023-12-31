import {Spacer} from 'components/Spacer/Spacer';
import {Typography} from 'components/Typography/Typography';
import {Button, Flex, HStack} from 'native-base';
import {Center} from 'native-base';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Text, View, useWindowDimensions} from 'react-native';
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
import {useSnackbar} from 'src/hooks/useSnackbar';
const DownloadingScreenUI = () => {
  const [finishSetup, setFinishSetup] = useState(false);
  const [startSetup, setStartSetup] = useState(false);
  const dispatch = useAppDispatch();
  const {steps} = useAppSelector(s => s.db);

  const database = useDatabase();

  const actions = useRef(actionsMap);
  const {openSnackbar} = useSnackbar();

  // useEffect(() => {
  //   // setupDatabase();
  //   setStartSetup(true);
  // }, []);

  const successAnimation = useRef<LottieView | null>(null);
  const [current, setCurrent] = useState('');

  useEffect(() => {
    const processActions = async () => {
      const toProceededActions = Object.entries(actions.current).filter(
        ([key]) => !steps[key as any as Step],
      );
      for (let index = 0; index < toProceededActions.length; index++) {
        try {
          const [key, action] = toProceededActions[index];
          setCurrent(key);
          await action();
          dispatch(completeStep(key as any));
        } catch (error: any) {
          console.error(error);
          openSnackbar({
            autoClose: false,
            variant: 'error',
            message: "Oops! 🙊 Technical glitch! Hang tight, we're on it! ⚙️✨",
          });
        }
      }
    };
    processActions().then(() => {
      setFinishSetup(true);
      getServerTimestampAction();
      successAnimation.current?.play();
    });
  }, []);

  const handleGettingStarted = () => {
    dispatch(completeDBSetup());
  };

  const {width, fontScale} = useWindowDimensions();

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
              style={{width: 0.9 * width, height: 0.9 * width}}
            />
            <Flex>
              <Typography fontSize={fontScale * 22} fontWeight={'bold'}>
                Setting up {current}... Almost there!
              </Typography>
              <Typography fontSize={fontScale * 18}>
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

export const DownloadingScreen = DownloadingScreenUI;
