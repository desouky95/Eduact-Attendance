import {Typography} from 'components/Typography/Typography';
import {fromPairs} from 'lodash';
import {Button} from 'native-base';
import {TouchableOpacity} from 'react-native';
import {HStack, VStack} from 'native-base';
import {Flex} from 'native-base';
import {View} from 'native-base';
import React, {useEffect, useState, useMemo, useRef} from 'react';
import CenterAttendanceModel from 'src/database/models/CenterAttendanceModel';
import {useCourseAttendance} from 'src/hooks/useCourseAttendance';
import {useAppSelector} from 'src/store';
import {getFontSize} from 'src/theme/getFontSize';
import {jsonReplacer} from 'src/utils/jsonReplacer';
import styled from 'styled-components/native';
import {useCourseAttendanceAnalytics} from 'src/hooks/useCourseAttendanceAnalytics';

type Props = {
  group_id?: number;
  onAttendanceTypeChange?: (type: string | null) => void;
};
export const AnalyticsSection = ({group_id, onAttendanceTypeChange}: Props) => {
  const ref = useAppSelector(s => s.course.currentReference);

  const {absent, center, online, total} = useCourseAttendanceAnalytics({
    center_id: ref?.center_course_id ?? null,
    online_id: ref?.online_course_id ?? null,
    group_id: group_id ?? null,
  });

  return (
    <View>
      <VStack space="6px" mb="32px">
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onAttendanceTypeChange?.(null)}>
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
              {total}
            </Typography>
          </InfoCard>
        </TouchableOpacity>
        <HStack space="8px">
          <TouchableOpacity
            style={{flex: 1}}
            activeOpacity={0.8}
            onPress={() => onAttendanceTypeChange?.('center')}>
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
                {center}
              </Typography>
            </InfoCard>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1}}
            activeOpacity={0.8}
            onPress={() => onAttendanceTypeChange?.('online')}>
            <InfoCard backgroundColor="cadet.main">
              <Flex>
                <Typography
                  fontSize={getFontSize(10)}
                  fontWeight={'500'}
                  color="#FFF">
                  Online
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
                {online}
              </Typography>
            </InfoCard>
          </TouchableOpacity>
        </HStack>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onAttendanceTypeChange?.('absent')}>
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
              {absent}
            </Typography>
          </InfoCard>
        </TouchableOpacity>
      </VStack>
    </View>
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
