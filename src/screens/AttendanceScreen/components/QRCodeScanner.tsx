import React from 'react';
import {runOnJS} from 'react-native-reanimated';
import {
  Camera,
  useCameraDevices,
  useFrameProcessor,
} from 'react-native-vision-camera';
import {Barcode, BarcodeFormat, scanBarcodes} from 'vision-camera-code-scanner';
import {StyleSheet, Text} from 'react-native';
import {Button, Center, ZStack} from 'native-base';
import {Box} from 'native-base';
import {Canvas, Mask, Rect, Circle, Group} from '@shopify/react-native-skia';
import LottieView from 'lottie-react-native';

type Props = {
  isActive?: boolean;
  onSuccess?: (rawValue: any) => void;
  onClose?: () => void;
};

export const QRCodeScanner = ({
  isActive = false,
  onSuccess,
  onClose,
}: Props) => {
  const [hasPermission, setHasPermission] = React.useState(false);

  const devices = useCameraDevices();
  const device = devices.back;
  const [barcodes, setBarcodes] = React.useState<Barcode[]>([]);

  const frameProcessor = useFrameProcessor(frame => {
    'worklet';
    const detectedBarcodes = scanBarcodes(frame, [BarcodeFormat.QR_CODE]);
    runOnJS(setBarcodes)(detectedBarcodes);
  }, []);

  const requestPermissions = async () => {
    const status = await Camera.requestCameraPermission();
    setHasPermission(status === 'authorized');
  };

  React.useEffect(() => {
    requestPermissions();
  }, []);

  React.useEffect(() => {
    if (barcodes.length > 0) {
      onSuccess?.(barcodes[0].rawValue);
    }
  }, [barcodes]);
  return (
    <>
      {hasPermission && device && isActive && (
        <>
          <ZStack
            zIndex={9999}
            style={[StyleSheet.absoluteFill]}
            backgroundColor={'red.500'}
            height="100%"
            justifyContent="center"
            alignItems="center">
            <Camera
              device={device}
              isActive={isActive}
              style={[{height: '100%', width: '100%'}]}
              frameProcessor={frameProcessor}
              frameProcessorFps={5}
            />
            <Canvas style={{width: 200, height: 200}}>
              <Mask
                mode="luminance"
                mask={
                  <Group>
                    <Rect color="white" height={200} width={200} />
                    <Rect color="black" height={198} width={198} x={1} y={1} />
                  </Group>
                }>
                <Rect x={0} y={0} width={200} height={200} color="white" />
              </Mask>
            </Canvas>

            <LottieView
              style={{width: 198, height: 198}}
              source={require('assets/animations/scan.json')}
              autoPlay
              loop
            />
            <Button
              m={2}
              width="95%"
              rounded={'full'}
              colorScheme="lightBlue"
              bottom="0"
              onPress={onClose}>
              Cancel
            </Button>
          </ZStack>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  barcodeTextURL: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
});
