import {Typography} from 'components/Typography/Typography';
import {Badge, Box, Center, Flex, Skeleton, VStack, View} from 'native-base';
import React from 'react';
import CenterAttendanceModel from 'src/database/models/CenterAttendanceModel';
import {useAttendancePerformance} from 'src/hooks/useAttendancePerformance';
import {ColorSchemaVariant} from 'src/theme/theme';

export const AttendanceCard = ({
  attendance,
}: {
  attendance: CenterAttendanceModel;
}) => {
  const {quiz, homework, isLoading, course} =
    useAttendancePerformance(attendance);

  console.log(quiz, homework, course, isLoading);
  const colorSchema: ColorSchemaVariant =
    attendance.type === 'online'
      ? 'red'
      : attendance.type == 'center'
      ? 'green'
      : 'yellow';
  return (
    <View w="100%">
      {isLoading && (
        <Center w="100%">
          <VStack
            w="90%"
            maxW="400"
            borderWidth="1"
            space={8}
            overflow="hidden"
            rounded="md"
            _dark={{
              borderColor: 'coolGray.500',
            }}
            _light={{
              borderColor: 'coolGray.200',
            }}>
            <Skeleton h="40" />
            {/* <Skeleton.Text px="4" /> */}
            {/* <Skeleton px="4" my="4" rounded="md" startColor="primary.100" /> */}
          </VStack>
        </Center>
      )}
      {!isLoading && (
        <Box
          p="10px"
          mb="5"
          borderRadius="5px"
          minHeight="131px"
          backgroundColor="white"
          shadow={'5'}
          // borderWidth="1"
          style={{elevation: 5, backgroundColor: 'white', shadowColor: '#000'}}
          w="100%">
          <Flex
            alignItems="center"
            pb="5px"
            flexDirection="row"
            justifyContent="space-between"
            borderBottomWidth="1px">
            <Typography fontWeight={'600'} fontSize="20px">
              {course?.name}
            </Typography>
            <Badge rounded={'md'} backgroundColor={`${colorSchema}.500`}>
              <Typography color={'#FFF'} fontWeight={'600'} fontSize="20px">
                {attendance.type}
              </Typography>
            </Badge>
          </Flex>
        </Box>
      )}
    </View>
  );
};
