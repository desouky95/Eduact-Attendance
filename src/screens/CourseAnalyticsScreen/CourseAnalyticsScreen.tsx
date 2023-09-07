import {CourseHeader} from 'components/CourseHeader/CourseHeader';
import React, {useState} from 'react';
import {SafeAreaView, ScrollView, View} from 'react-native';
import {GroupsFilter} from '../ClassroomScreen/components/GroupFilter';
import {AnalyticsSection} from '../ClassroomScreen/components/AnalyticsSection';
import {Typography} from 'components/Typography/Typography';
import {EnrollmentAnalytics} from './components/EnrolllmentAnalytics';
import {Spacer} from 'components/Spacer/Spacer';
import {Box, Divider} from 'native-base';

export const CourseAnalyticsScreen = () => {
  const [groupId, setGroupId] = useState<number | undefined>();
  const [attendanceGroupId, setAttendanceGroupId] = useState<
    number | undefined
  >();
  const [type, setType] = useState<string | null>(null);

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 20,
      }}>
      <CourseHeader />

      <ScrollView style={{flex: 1}}>
        <Box>
          <Typography fontWeight="bold">Enrolled Analytics</Typography>
          <Spacer mb={3} />
          <GroupsFilter onChange={setGroupId} />
          <EnrollmentAnalytics group_id={groupId} />
        </Box>
        <Spacer my={5}>
          <Divider />
        </Spacer>
        <Box>
          <Typography fontWeight="bold">Center Attendance Analytics</Typography>
          <Spacer mb={3} />
          <GroupsFilter onChange={setAttendanceGroupId} />

          <AnalyticsSection
            group_id={attendanceGroupId}
            onAttendanceTypeChange={setType}
          />
        </Box>
      </ScrollView>
    </View>
  );
};
