import {CourseHeader} from 'components/CourseHeader/CourseHeader';
import {Typography} from 'components/Typography/Typography';
import {Flex, Center, HStack} from 'native-base';
import React, {useState} from 'react';
import {View, ScrollView} from 'react-native';
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
      {ref && (
        <ScrollView style={{flex: 1}}>
          {ref && <GroupsFilter onChange={setGroupId} />}
          {ref && (
            <AnalyticsSection
              group_id={groupId}
              onAttendanceTypeChange={setType}
            />
          )}
          {ref && <CourseDataTable group_id={groupId} type={type} />}
        </ScrollView>
      )}

      {!ref && (
        <Flex flex={1} justifyContent="center">
          <Center>
            <Typography fontWeight={'bold'} fontSize={'20'}>
              No Reference Provided !!!
            </Typography>
          </Center>
        </Flex>
      )}
    </View>
  );
};
