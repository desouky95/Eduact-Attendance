import {CourseHeader} from 'components/CourseHeader/CourseHeader';
import {Typography} from 'components/Typography/Typography';
import {Flex, Center, HStack} from 'native-base';
import React, {useEffect, useRef, useState} from 'react';
import {View, ScrollView, SafeAreaView} from 'react-native';
import {GroupsFilter} from './components/GroupFilter';
import {AnalyticsSection} from './components/AnalyticsSection';
import {useAppSelector} from 'src/store';
import {CourseDataTable} from './components/CourseDataTable';

export const ClassroomScreen = () => {
  const ref = useAppSelector(s => s.course.currentReference);

  const [groupId, setGroupId] = useState<number | undefined>();
  const [type, setType] = useState<string | null>(null);

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 20,
      }}>
      <CourseHeader />
      {ref && (ref.online_course_id || ref?.center_course_id) && (
        <ScrollView style={{flex: 1}}>
          {ref && (
            <SafeAreaView>
              <GroupsFilter onChange={setGroupId} />
            </SafeAreaView>
          )}
          {ref && (
            <AnalyticsSection
              group_id={groupId}
              onAttendanceTypeChange={setType}
            />
          )}
          {ref && <CourseDataTable group_id={groupId} type={type} />}
        </ScrollView>
      )}

      {!ref ||
        (ref && !ref?.online_course_id && !ref?.center_course_id && (
          <Flex flex={1} justifyContent="center">
            <Center>
              <Typography fontWeight={'bold'} fontSize={20}>
                No Reference Provided !!!
              </Typography>
            </Center>
          </Flex>
        ))}
    </View>
  );
};
