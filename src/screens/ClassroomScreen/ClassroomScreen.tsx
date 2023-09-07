import {CourseHeader} from 'components/CourseHeader/CourseHeader';
import {Typography} from 'components/Typography/Typography';
import {Flex, Center, HStack} from 'native-base';
import React, {useEffect, useRef, useState} from 'react';
import {View, ScrollView, SafeAreaView} from 'react-native';
import {GroupsFilter} from './components/GroupFilter';
import {AnalyticsSection} from './components/AnalyticsSection';
import {useAppSelector} from 'src/store';
import {CourseDataTable} from './components/CourseDataTable';
import {AttendanceTypeFilter} from './components/AttendanceTypeFilter';
import {Box} from 'native-base';
import {Switch} from 'native-base';

export const ClassroomScreen = () => {
  const ref = useAppSelector(s => s.course.currentReference);

  const [groupId, setGroupId] = useState<number | undefined>();
  const [type, setType] = useState<string | null>(null);
  const [enrolled, setEnrolled] = useState(false);

  return (
    <View
      style={{
        flex: 1,
      }}>
      <View style={{paddingHorizontal: 20}}>
        <CourseHeader />
      </View>

      <ScrollView style={{flex: 1, paddingHorizontal: 20}}>
        <SafeAreaView>
          <HStack space={5}>
            <Box flex={1}>
              <GroupsFilter onChange={setGroupId} />
            </Box>
            <Box flex={1}>
              <AttendanceTypeFilter onChange={setType} />
            </Box>
          </HStack>
          <HStack alignItems="center" mb={2} space={2}>
            <Switch
              size="md"
              isChecked={enrolled}
              onToggle={() => setEnrolled(!enrolled)}
            />
            <Typography fontWeight={'bold'}>Enrolled Students</Typography>
          </HStack>
        </SafeAreaView>

        {/* <AnalyticsSection group_id={groupId} onAttendanceTypeChange={setType} /> */}
        <CourseDataTable group_id={groupId} type={type} enrolled={enrolled} />
      </ScrollView>
    </View>
  );
};
