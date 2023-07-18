import {useRoute} from '@react-navigation/native';
import {CourseHeader} from 'components/CourseHeader/CourseHeader';
import {EdTextInput} from 'components/EdTextInput';
import {Box, Button, VStack, useTheme} from 'native-base';
import React, {useEffect, useState} from 'react';
import {ScrollView, Text, View, TouchableOpacity} from 'react-native';
import {useAppSelector} from 'src/store';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Center} from 'native-base';
import {Flex} from 'native-base';
import {HStack, Pressable} from 'native-base';
import {Typography} from 'components/Typography/Typography';
import {searchStudents} from 'src/database/data/classrooms.data';
import {first, flatMap} from 'rxjs';
import UserModel from 'src/database/models/UserModel';
import {StudentAttendance} from './components/StudentAttendance/StudentAttendance';
export const AttendanceScreen = () => {
  const {params} = useRoute<ClassroomScreenProp>();

  const course = useAppSelector(s => s.course.current);
  const theme = useTheme();

  const [query, setQuery] = useState('');
  const result = searchStudents(query).observe();

  const handleSearch = async () => {
    const result = searchStudents(query).observe();
    const subscribe = result
      .pipe(flatMap(s => s))
      .pipe(first())
      .subscribe(value => {
        setCurrentStudent(value);
      });
    return () => subscribe.unsubscribe();
  };

  const [currentStudent, setCurrentStudent] = useState<UserModel | undefined>();

  return (
    <ScrollView>
      <View
        style={{
          paddingHorizontal: 20,
          flex: 1,
          width: '100%',
          // backgroundColor: 'red',
        }}>
        <CourseHeader />
        <VStack mb="20px">
          <VStack px="38" space={'10px'} alignItems={'center'}>
            <EdTextInput
              // px={'100px'}
              value={query}
              onChangeText={setQuery}
              backgroundColor={'white'}
              py="0"
              InputRightElement={
                <Center
                  backgroundColor="primary.main"
                  // height="100%"
                  alignItems={'center'}
                  justifyContent={'center'}
                  py={3}
                  width={10}>
                  <Icon color="#FFF" size={20} name="qr-code-scanner" />
                </Center>
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
        <Box minHeight="450" backgroundColor="red.300">
          <ScrollView>
            {currentStudent && <StudentAttendance user={currentStudent} />}
          </ScrollView>
        </Box>
        <HStack py="18" px="44" space="12px">
          <Button
            borderColor={'primary.main'}
            color="primary.main"
            outlineColor={'aqua'}
            backgroundColor={'primary.main'}
            size="md"
            height="10"
            borderRadius={'100px'}
            _pressed={{opacity: 0.8}}
            width={'1/2'}
            // variant={'outline'}
          >
            <Typography fontWeight={'bold'} color="#FFF">
              Save
            </Typography>
          </Button>
          <Button
            colorScheme={'orange'}
            borderColor={'orange.500'}
            color="orange.main"
            outlineColor={'aqua'}
            // backgroundColor={'white'}
            size="md"
            height="10"
            borderRadius={'100px'}
            _pressed={{opacity: 0.8}}
            width={'1/2'}
            variant={'outline'}>
            <Typography fontWeight={'bold'} color={theme.colors.warning[500]}>
              Cancel
            </Typography>
          </Button>
        </HStack>
      </View>
    </ScrollView>
  );
};
