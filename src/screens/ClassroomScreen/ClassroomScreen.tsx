import {useDatabase} from '@nozbe/watermelondb/hooks';
import {useRoute} from '@react-navigation/native';
import {Spacer} from 'components/Spacer/Spacer';
import {Table} from 'components/Table/Table';
import {Typography} from 'components/Typography/Typography';
import {VStack, Flex, HStack} from 'native-base';
import {useObservableState} from 'observable-hooks';
import React from 'react';
import {ScrollView, Text, View} from 'react-native';
import {getCourse} from 'src/database/data/classrooms.data';
import {getFontSize} from 'src/theme/getFontSize';
import styled from 'styled-components/native';
import {first, flatMap, take} from 'rxjs/operators';
import CourseModel from 'src/database/models/Course';
import {CourseHeader} from 'components/CourseHeader/CourseHeader';
const students = [
  {name: 'Naasddddddddddddddddddme'},
  {name: 'Ismail'},
  {name: 'Moustafa'},
];
export const ClassroomScreen = () => {
  const {params} = useRoute<ClassroomScreenProp>();

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

        <VStack space="6px" mb="32px">
          <InfoCard backgroundColor={'primary.main'}>
            <Flex>
              <Typography
                color={'#FFF'}
                fontSize={getFontSize(12)}
                fontWeight="600">
                Total
              </Typography>
              <Typography
                color={'#FFF'}
                fontSize={getFontSize(12)}
                fontWeight="600">
                Attendance
              </Typography>
            </Flex>
            <Typography
              color={'#FFF'}
              fontSize={getFontSize(24)}
              fontWeight="600">
              1253
            </Typography>
          </InfoCard>
          <HStack space="8px">
            <InfoCard backgroundColor="cadet.main">
              <Flex>
                <Typography
                  fontSize={getFontSize(10)}
                  fontWeight={'500'}
                  color="#FFF">
                  Center
                </Typography>
                <Typography
                  fontSize={getFontSize(10)}
                  fontWeight={'500'}
                  color="#FFF">
                  Attendance
                </Typography>
              </Flex>
              <Typography
                fontWeight={'600'}
                fontSize={getFontSize(14)}
                color="#FFF">
                567
              </Typography>
            </InfoCard>
            <InfoCard backgroundColor="cadet.main">
              <Flex>
                <Typography
                  fontSize={getFontSize(10)}
                  fontWeight={'500'}
                  color="#FFF">
                  Center
                </Typography>
                <Typography
                  fontSize={getFontSize(10)}
                  fontWeight={'500'}
                  color="#FFF">
                  Attendance
                </Typography>
              </Flex>
              <Typography
                fontWeight={'600'}
                fontSize={getFontSize(14)}
                color="#FFF">
                567
              </Typography>
            </InfoCard>
          </HStack>
        </VStack>

        {/* <Table
          columns={['head 1', 'head 2', 'head 3', 'head 4', 'head 5', 'head 6']}
          data={students}>
          {({TableCell, TableRow, item, index}) => (
            <TableRow key={`${item.name}-${index}`}>
              <TableCell>
                <Typography numberOfLines={1} style={{width: '100%'}}>
                  {item.name}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography numberOfLines={1}>{item.name}</Typography>
              </TableCell>
            </TableRow>
          )}
        </Table> */}
      </View>
    </ScrollView>
  );
};

const InfoCard = styled(Flex)`
  border-radius: 5px;
  padding: 6px 29px 6px 12px;
  color: #fff;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  /* flex: 1; */
  flex-grow: 1;
  flex-shrink: 1;
  display: flex;
  /* min-height: 40px; */
  /* width: 100%; */
`;
