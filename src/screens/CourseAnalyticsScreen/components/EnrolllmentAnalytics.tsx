import {useFocusEffect} from '@react-navigation/native';
import {Typography} from 'components/Typography/Typography';
import {Box, HStack} from 'native-base';
import {Flex, VStack} from 'native-base';
import React, {useState} from 'react';
import {View, useWindowDimensions} from 'react-native';
import {getCourseEnrollmentAnalytics} from 'src/database/data/analytics.data';
import {useAppSelector} from 'src/store';
import {getFontSize} from 'src/theme/getFontSize';
import styled from 'styled-components/native';

type Props = {
  group_id?: number;
  active: boolean;
};
export const EnrollmentAnalytics = ({group_id, active}: Props) => {
  const {current} = useAppSelector(s => s.course);

  const [enrolled, setEnrolled] = useState(0);
  const [notEnrolled, setNotEnrolled] = useState(0);
  const [total, setTotal] = useState(0);
  useFocusEffect(
    React.useCallback(() => {
      if (!current?.classroom_id || !current?.id) return;
      console.log(group_id);
      const query = getCourseEnrollmentAnalytics(
        current.classroom_id.toString(),
        current.id,
        active,
        group_id?.toString(),
      );

      const notEnrolledSubscription = query.notEnrolled.subscribe(value => {
        setNotEnrolled(value.length);
      });
      const enrolledSubscription = query.enrolled.subscribe(value => {
        setEnrolled(value.length);
      });

      const totalSubscription = query.total.subscribe(value => {
        setTotal(value.length);
      });

      return () => {
        enrolledSubscription.unsubscribe();
        notEnrolledSubscription.unsubscribe();
        totalSubscription.unsubscribe();
      };
    }, [group_id, current?.id, current?.classroom_id]),
  );

  const {fontScale} = useWindowDimensions();

  return (
    <>
      <Box mb="3">
        <VStack space="6px">
          <InfoCard backgroundColor="primary.main">
            <Flex>
              <Typography
                fontSize={getFontSize(10)}
                fontWeight={'500'}
                color="#FFF">
                Total
              </Typography>
              <Typography
                fontSize={getFontSize(10)}
                fontWeight={'500'}
                color="#FFF">
                Enrollment
              </Typography>
            </Flex>
            <Typography
              fontWeight={'600'}
              fontSize={getFontSize(14)}
              color="#FFF">
              {total}
            </Typography>
          </InfoCard>
          <HStack space="8px">
            <InfoCard backgroundColor="cadet.main">
              <Flex>
                <Typography
                  fontSize={getFontSize(10)}
                  fontWeight={'500'}
                  color="#FFF">
                  Enrolled
                </Typography>
                {/* <Typography
                  fontSize={getFontSize(10)}
                  fontWeight={'500'}
                  color="#FFF">
                  Enrollment
                </Typography> */}
              </Flex>
              <Typography
                fontWeight={'600'}
                fontSize={getFontSize(14)}
                color="#FFF">
                {enrolled}
              </Typography>
            </InfoCard>

            <InfoCard backgroundColor="cadet.main">
              <Flex>
                <Typography
                  fontSize={getFontSize(10)}
                  fontWeight={'500'}
                  color="#FFF">
                  Absent
                </Typography>
                {/* <Typography
                  fontSize={getFontSize(10)}
                  fontWeight={'500'}
                  color="#FFF">
                  Attendance
                </Typography> */}
              </Flex>
              <Typography
                fontWeight={'600'}
                fontSize={getFontSize(14)}
                color="#FFF">
                {notEnrolled}
              </Typography>
            </InfoCard>
          </HStack>
        </VStack>
      </Box>
    </>
  );
};

const InfoCard = styled(Flex)`
  border-radius: 5px;
  padding: 6px 29px 6px 12px;
  min-height: 60px;
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
