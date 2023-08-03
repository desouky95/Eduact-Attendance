import {useNavigation} from '@react-navigation/native';
import {Typography} from 'components/Typography/Typography';
import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {getCourse} from 'src/database/data/classrooms.data';
import ClassroomModel from 'src/database/models/Classroom';
import CourseModel from 'src/database/models/Course';
import {useAppDispatch} from 'src/store';
import {setCurrent} from 'src/store/courseReducer/courseReducer';

export const CoursePanel = ({
  course,
  classroom
}: {
  course: CourseModel;
  classroom: ClassroomModel;
}) => {
  const navigation = useNavigation<ClassroomRootProps>();
  const dispatch = useAppDispatch();
  return (
    <TouchableOpacity
      onPress={async () => {
        dispatch(setCurrent({current: course, classroom}));
        navigation.navigate('ClassroomRoot', {
          params: {current: course.sid},
          screen: 'Classroom',
        });
      }}
      activeOpacity={0.5}
      style={{display: 'flex'}}>
      <View
        style={{
          marginStart: 30,
          marginVertical: 8,
          borderRadius: 5,
          backgroundColor: '#FFF',
          paddingHorizontal: 16,
          paddingVertical: 10,
        }}>
        <View
          style={{
            width: 15,
            height: 15,
            borderRadius: 15 / 2,
            backgroundColor: '#000',
            position: 'absolute',
            left: -15 / 2,
            top: 25 / 2,
            borderWidth: 3,
            borderColor: '#FFF',
          }}
        />
        <Typography fontWeight={'bold'} color="#000">
          {course.name}
        </Typography>
      </View>
    </TouchableOpacity>
  );
};
