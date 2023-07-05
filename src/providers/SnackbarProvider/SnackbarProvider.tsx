import {Snackbar, SnackbarVariant} from 'components/Snackbar/Snackbar';
import {Center} from 'native-base';
import React, {
  PropsWithChildren,
  createContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  Button,
  KeyboardAvoidingView,
  useWindowDimensions,
  Platform,
  View,
  LayoutChangeEvent,
  LayoutRectangle,
} from 'react-native';
import {Easing} from 'react-native-reanimated';
import {MotiView, AnimatePresence} from 'moti';

type Measurements = {
  left: number;
  top: number;
  width: number;
  height: number;
};
type OpenSnackbarConfig = {
  variant?: SnackbarVariant;
  message?: string;
  duration?: number;
};

type SnackbarContextArgs = {
  openSnackbar: (config: OpenSnackbarConfig) => void;
};

export const SnackbarContext = createContext<SnackbarContextArgs | null>(null);

export const SnackbarProvider = ({children}: PropsWithChildren) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState<SnackbarVariant>('normal');

  const [measure, setMeasure] = useState<LayoutRectangle | null>(null);

  const fadeAnim = useRef(new Animated.Value(0));

  const openSnackbar = ({
    duration = 2000,
    variant = 'normal',
    message = '',
  }: OpenSnackbarConfig) => {
    setMessage(message);
    setVariant(variant);
    animate()(measure?.height, duration);
    setOpen(true);
    setTimeout(() => {
      reset();
    }, duration);
  };

  const animate = () => {
    return (height: number = 60, duration: number = 2000) => {
      Animated.timing(fadeAnim.current, {
        toValue: (-1 * height) / 2,
        useNativeDriver: true,
        duration: 200,
        easing: Easing.ease,
      }).start();
    };
  };

  const reset = () => {
    Animated.timing(fadeAnim.current, {
      toValue: measure?.height ?? 48,
      useNativeDriver: true,
      duration: 200,
      easing: Easing.ease,
    }).start(({finished}) => {
      if (finished) {
        setOpen(false);
        setMessage('');
        setVariant('normal');
      }
    });
  };

  return (
    // <KeyboardAvoidingView
    //   style={{flex: 1, width: '100%', position: 'absolute', bottom: 0}}
    //   behavior={Platform.OS == 'ios' ? 'padding' : undefined}>
    <SnackbarContext.Provider value={{openSnackbar: openSnackbar}}>
      {children}
      <Animated.View
        style={[
          {width: '100%', position: 'absolute', bottom: 0},
          {transform: [{translateY: fadeAnim.current}]},
        ]}>
        <Center>
          <View
            onLayout={(e: LayoutChangeEvent) => {
              setMeasure(e.nativeEvent.layout);
              fadeAnim.current.setValue(e.nativeEvent.layout.height);
            }}>
            <Snackbar variant={variant} title={message} />
          </View>
        </Center>
      </Animated.View>
    </SnackbarContext.Provider>
    // </KeyboardAvoidingView>
  );
};
