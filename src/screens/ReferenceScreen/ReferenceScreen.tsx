import {CourseHeader} from 'components/CourseHeader/CourseHeader';
import React from 'react';
import {ScrollView, Text, View} from 'react-native';
import {useClassroomDropdown} from 'src/hooks/useClassroomDropdown';
import {useAppSelector} from 'src/store';
import {OfflineOptions} from './components/OfflineOptions';

export const ReferenceScreen = () => {
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
      </View>
      <OfflineOptions />
    </ScrollView>
  );
};
