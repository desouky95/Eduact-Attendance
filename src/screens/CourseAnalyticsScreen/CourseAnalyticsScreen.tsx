import {CourseHeader} from 'components/CourseHeader/CourseHeader';
import React, {useState} from 'react';
import {SafeAreaView, ScrollView, View} from 'react-native';
import {GroupsFilter} from '../ClassroomScreen/components/GroupFilter';
import {AnalyticsSection} from '../ClassroomScreen/components/AnalyticsSection';
import {Typography} from 'components/Typography/Typography';
import {EnrollmentAnalytics} from './components/EnrolllmentAnalytics';
import {Spacer} from 'components/Spacer/Spacer';
import {Box, Divider, HStack, Switch} from 'native-base';
import {EdButton} from 'components/EdButton/EdButton';
import {useDatabase} from '@nozbe/watermelondb/hooks';
import {useCourseUsersExport} from 'src/hooks/useCourseUsersExport';
import {useAppSelector} from 'src/store';
import CourseModel from 'src/database/models/Course';
import {useFocusEffect} from '@react-navigation/native';
import {getCourse} from 'src/database/data/classrooms.data';

export const CourseAnalyticsScreen = () => {
  const [groupId, setGroupId] = useState<number | undefined>();
  const [active, setActive] = useState<boolean>(false);
  const [attendanceGroupId, setAttendanceGroupId] = useState<
    number | undefined
  >();

  const {current, currentReference} = useAppSelector(s => s.course);
  const {handleExport} = useCourseUsersExport({
    course_id: current?.id,
    ref_course_id: currentReference?.center_course_id?.toString() ?? null,
  });

  const [refCourse, setRefCourse] = useState<CourseModel | undefined>();

  useFocusEffect(
    React.useCallback(() => {
      if (!currentReference?.center_course_id) {
        setRefCourse(undefined);
        return;
      }
      const subscription = getCourse(
        currentReference?.center_course_id,
      ).subscribe(value => {
        setRefCourse(value[0]);
      });
      return () => subscription.unsubscribe();
    }, [currentReference?.center_course_id]),
  );
  return (
    <View
      style={{
        flex: 1,
      }}>
      <View style={{paddingHorizontal: 20}}>
        <CourseHeader />
      </View>

      <ScrollView
        style={{
          flex: 1,

          paddingHorizontal: 20,
        }}>
        <Box>
          <Typography fontWeight="bold">Enrolled Analytics</Typography>
          <Spacer mb={3} />
          <GroupsFilter onChange={setGroupId} />
          <HStack space={3} mb={2} alignItems="center">
            <Switch isChecked={active} onToggle={() => setActive(!active)} />
            <Typography>Active</Typography>
          </HStack>
          <EnrollmentAnalytics group_id={groupId} active={active} />
        </Box>
        <Spacer my={5}>
          <Divider />
        </Spacer>
        <Box>
          <Typography fontWeight="bold">
            Attendance Analytics
            {/* {refCourse && `: ${refCourse?.name}`} */}
          </Typography>
          <Spacer mb={3} />
          <GroupsFilter onChange={setAttendanceGroupId} />

          <AnalyticsSection group_id={attendanceGroupId} />
        </Box>
        {/* <EdButton
          onPress={() => handleExport().then(() => {})}
          width={'100%'}
          bgColor={'green.400'}>
          {isLoading ? 'Export Data' : 'loading'}
        </EdButton> */}
      </ScrollView>
    </View>
  );
};
