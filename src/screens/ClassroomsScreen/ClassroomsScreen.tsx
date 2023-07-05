import {useNavigation} from '@react-navigation/native';
import {logo} from 'assets/index';
import {Accordion} from 'components/Accordion/Accordion';
import {AccordionSummary} from 'components/Accordion/AccordionSummary';
import {Spacer} from 'components/Spacer/Spacer';
import {Typography} from 'components/Typography/Typography';
import React from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  SectionList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const classrooms = Array(20)
  .fill(0)
  .map((v, index) => ({
    name: `Classroom ${index + 1}`,
    lessons: Array(5)
      .fill(0)
      .map((v, lIndex) => ({name: `Lesson ${index + 1} ${lIndex + 1}`})),
  }));
export const ClassroomsScreen = () => {
  return (
    <ScrollView style={{paddingHorizontal: 20}}>
      <Spacer my={20}>
        <Typography fontWeight={'bold'}>Classrooms</Typography>
      </Spacer>

      {classrooms.map((classroom, index) => (
        <Accordion key={`${classroom.name}-${index}`}>
          <AccordionSummary>
            <Typography fontSize={16} color={'#5AC0FC'}>
              {classroom.name}
            </Typography>
          </AccordionSummary>
          <View>
            {classroom.lessons.map((lesson, index) => (
              <CoursePanel key={`${lesson.name}-${index}`} lesson={lesson} />
            ))}
          </View>
        </Accordion>
      ))}
    </ScrollView>
  );
};

const CoursePanel = ({lesson}: {lesson: {name: string}}) => {
  const navigation = useNavigation<ClassroomRootProps>();
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('ClassroomRoot', {
          params: {classroom_id: 2},
          screen: 'Classroom',
        })
      }
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
          {lesson.name}
        </Typography>
      </View>
    </TouchableOpacity>
  );
};
