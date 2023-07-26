import {EdTextInput} from 'components/EdTextInput';
import {Box, Button, VStack, useTheme} from 'native-base';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Center} from 'native-base';
import {Typography} from 'components/Typography/Typography';
import {searchStudents} from 'src/database/data/classrooms.data';
import {first, flatMap} from 'rxjs';
import UserModel from 'src/database/models/UserModel';
import {useCameraDevices} from 'react-native-vision-camera';
import {Camera} from 'react-native-vision-camera';
import {useScanBarcodes, BarcodeFormat} from 'vision-camera-code-scanner';
import 'react-native-reanimated';
import {Text} from 'react-native';

type Props = {
  onStudentChange: (student: UserModel) => void;
};
export const StudentSearch = ({onStudentChange}: Props) => {
  const [query, setQuery] = useState('');

  const handleSearch = async () => {
    const result = searchStudents(query).observe();
    const subscribe = result
      .pipe(flatMap(s => s))
      .pipe(first())
      .subscribe(value => {
        onStudentChange(value);
      });
    return () => subscribe.unsubscribe();
  };
  const [hasPermission, setHasPermission] = React.useState(false);
  const devices = useCameraDevices();
  const device = devices.back;
  const [scan, setScan] = React.useState(false);

  // Here is where useScanBarcodes() hook is called.
  // Specify your barcode format inside.
  // Detected barcodes are assigned into the 'barcodes' variable.
  const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE], {
    checkInverted: true,
  });

  const onPressScan = () => {
    if (!hasPermission)
      (async () => {
        const status = await Camera.requestCameraPermission();
        setHasPermission(status === 'authorized');
      })();
    setScan(true);
  };

  React.useEffect(() => {
    console.log(barcodes);
    if (barcodes.length > 0 && barcodes[0].rawValue) {
      setScan(false);
      setQuery(barcodes[0].rawValue);
      handleSearch();
    }
}, [barcodes]);

  return (
    <>
      {hasPermission && device && (
        <>
          <Camera
            device={device}
            isActive={true}
            frameProcessor={frameProcessor}
            frameProcessorFps={5}
          />
          {barcodes.map((barcode, idx) => (
            <Text key={idx}>{barcode.displayValue}</Text>
          ))}
        </>
      )}
      <VStack mb="20px">
        <VStack px="38" space={'10px'} alignItems={'center'}>
          <EdTextInput
            // px={'100px'}
            value={query}
            onChangeText={setQuery}
            backgroundColor={'white'}
            py="0"
            InputRightElement={
              <Button p="0" onPress={onPressScan}>
                <Center
                  backgroundColor="primary.main"
                  // height="100%"
                  alignItems={'center'}
                  justifyContent={'center'}
                  py={3}
                  width={10}>
                  <Icon color="#FFF" size={20} name="qr-code-scanner" />
                </Center>
              </Button>
            }
          />
          <Button
            onPress={handleSearch}
            colorScheme={'primary'}
            borderColor={'primary.main'}
            color="primary.main"
            outlineColor={'aqua'}
            backgroundColor={'white'}
            size="md"
            height="10"
            borderRadius={'100px'}
            _pressed={{opacity: 0.8}}
            width={'1/2'}
            variant={'outline'}>
            <Typography fontWeight={'bold'} color="#50bcfc">
              Search
            </Typography>
          </Button>
        </VStack>
      </VStack>
    </>
  );
};
