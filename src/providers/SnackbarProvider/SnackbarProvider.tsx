import {Snackbar, SnackbarVariant} from 'components/Snackbar/Snackbar';
import {
  PropsWithChildren,
  useCallback,
  useRef,
  useState,
  createContext,
} from 'react';
import {
  LayoutChangeEvent,
  LayoutRectangle,
  useWindowDimensions,
} from 'react-native';
import {Box} from 'native-base';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

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
  autoClose?: boolean;
};

type SnackbarContextArgs = {
  openSnackbar: (config: OpenSnackbarConfig) => void;
  closeSnackbar: () => void;
};

export const SnackbarContext = createContext<SnackbarContextArgs | null>(null);

export const SnackbarProvider = ({children}: PropsWithChildren) => {
  const [open, setOpen] = useState(false);
  const [variant, setVariant] = useState<SnackbarVariant>('dark');
  const [message, setMessage] = useState('');

  const measure = useRef<LayoutRectangle | null>(null);
  const {height} = useWindowDimensions();

  const resetAnimation = useCallback(
    (type: 'open' | 'close' = 'open') => {
      if (type === 'close') {
        setVariant('dark');
        setMessage('');
        return;
      }
    },
    [setOpen, setVariant, setMessage],
  );
  const onAnimationEnd = useCallback(
    (type: 'open' | 'close', isFinished?: boolean) => {
      if (isFinished && type == 'close') {
        resetAnimation('close');
      }
    },
    [resetAnimation],
  );
  const animatedValue = useAnimatedStyle(() => {
    const measureY = measure.current?.height;
    return {
      transform: [
        {
          translateY: withTiming(
            open ? 0 : measureY ?? 140,
            {duration: 1000, easing: Easing.inOut(Easing.ease)},
            cb => runOnJS(onAnimationEnd)(open ? 'open' : 'close', cb),
          ),
        },
      ],
    };
  }, [open]);

  const openSnackbar = useCallback(
    (args: OpenSnackbarConfig) => {
      const {
        duration = 2000,
        variant = 'dark',
        message = '',
        autoClose = false,
      } = args;
      setMessage(message);
      setVariant(variant);
      setOpen(true);

      if (autoClose)
        setTimeout(() => {
          setOpen(false);
        }, duration);
    },
    [setOpen, message, variant, setVariant, setMessage],
  );

  const closeSnackbar = () => {
    setOpen(false);
  };

  return (
    <SnackbarContext.Provider value={{openSnackbar, closeSnackbar}}>
      <Animated.View
        onLayout={(e: LayoutChangeEvent) => {
          measure.current = e.nativeEvent.layout;
        }}
        style={[
          {
            position: 'absolute',
            flex: 1,
            left: 0,
            width: '100%',
            bottom: 0,
            zIndex: 100,
          },
          animatedValue,
        ]}>
        {/* <Box backgroundColor="red.200" p="4" width={'100%'}> */}
        <Box p="4" width={'100%'}>
          <Snackbar
            title={message}
            variant={variant}
            onDismiss={closeSnackbar}
          />
        </Box>
      </Animated.View>
      {children}
    </SnackbarContext.Provider>
  );
};
