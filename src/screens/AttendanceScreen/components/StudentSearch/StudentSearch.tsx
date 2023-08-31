import {EdTextInput} from 'components/EdTextInput';
import {Box, Button, VStack, useTheme} from 'native-base';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Center} from 'native-base';
import {Typography} from 'components/Typography/Typography';
import {searchStudents} from 'src/database/data/classrooms.data';
import {first, flatMap} from 'rxjs';
import UserModel from 'src/database/models/UserModel';
import withObservables from '@nozbe/with-observables';
import 'react-native-reanimated';
import {QRCodeScanner} from '../QRCodeScanner';
import {compose} from 'recompose';
import {ReferenceGroup} from './ReferenceGroup';

type Props = {
  onStudentChange: (student: UserModel) => void;
  onNotFound: () => void;
  user?: UserModel;
};
export const StudentSearch = ({onStudentChange, user, onNotFound}: Props) => {
  const [query, setQuery] = useState('');

  const handleSearch = async (value: string = query) => {
    try {
      const [student] = await searchStudents(value).fetch();
      if (student) {
        onStudentChange(student);
      } else {
        onNotFound();
      }
    } catch (error) {}
  };
  const [scan, setScan] = React.useState(false);

  const handleOnScanSuccess = (value: string) => {
    setQuery(value);
    setScan(false);
    handleSearch(value);
  };

  return (
    <>
      <QRCodeScanner
        onClose={() => setScan(false)}
        isActive={scan}
        onSuccess={handleOnScanSuccess}
      />
      <VStack mb="20px">
        {user && <ReferenceGroup user={user} />}
        <VStack px="38" space={'10px'} alignItems={'center'}>
          <EdTextInput
            // px={'100px'}
            value={query}
            onChangeText={setQuery}
            backgroundColor={'white'}
            py="0"
            InputRightElement={
              <Button p="0" onPress={() => setScan(true)}>
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
