import React from 'react';
import {runOnJS} from 'react-native-reanimated';
import {
  Camera,
  useCameraDevices,
  useFrameProcessor,
} from 'react-native-vision-camera';
import {Barcode, BarcodeFormat, scanBarcodes} from 'vision-camera-code-scanner';
import {StyleSheet, Text} from 'react-native';

type Props = {
  isActive?: boolean;
  onSuccess?: (rawValue: any) => void;
};

export const QRCodeScanner = ({isActive = false, onSuccess}: Props) => {
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
      onSuccess(barcodes[0].rawValue);
    }
  }, [barcodes]);
  return (
    <>
      {hasPermission && device && isActive && (
        <>
          <Camera
            device={device}
            isActive={isActive}
            style={[StyleSheet.absoluteFill, {zIndex: 9999, height: '100%'}]}
            frameProcessor={frameProcessor}
            frameProcessorFps={5}
          />
          {barcodes.map((barcode, idx) => (
            <Text style={styles.barcodeTextURL} key={idx}>
              {barcode.displayValue}
            </Text>
          ))}
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
