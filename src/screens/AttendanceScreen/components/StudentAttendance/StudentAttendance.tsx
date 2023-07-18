import {Q} from '@nozbe/watermelondb';
import {Typography} from 'components/Typography/Typography';
import {Avatar, Center, VStack} from 'native-base';
import React, {useEffect} from 'react';
import {Text, View} from 'react-native';
import {firstValueFrom, mergeMap} from 'rxjs';
import {getStudentAttendance} from 'src/database/data/classrooms.data';
import UserModel from 'src/database/models/UserModel';
import {useAppSelector} from 'src/store';

export const StudentAttendance = ({user}: {user: UserModel}) => {
  const course = useAppSelector(s => s.course.current);

  useEffect(() => {
    const processAttendance = async () => {
      if (!course) return;
      const student = await user.student;
      console.log(user.student);
      user.student.observe().subscribe(value => {
        console.log({value});
      });
      // const student = await firstValueFrom(
      //   user.student
      //     .extend(Q.take(1))
      //     .observe()
      //     .pipe(mergeMap(s => s)),
      // );
      // const attendance = await getStudentAttendance(course?.sid, student.sid);
    };

    processAttendance();
  }, []);
  return (
    <View>
      <Center>
        <VStack alignItems="center" space={'6px'}>
          <Avatar
            bg={'yellow.500'}
            size="lg"
            source={{uri: user.profile_photo}}>
            {user.first_name[0]} {user.last_name[0]}
          </Avatar>
          <Typography fontSize={'14px'} fontWeight={'bold'}>
            {user.username}
          </Typography>
          <Typography fontSize="12px" fontWeight="600">
            {user.first_name} {user.last_name}
          </Typography>
        </VStack>
      </Center>
    </View>
  );
};
