import {Q} from '@nozbe/watermelondb';
import {Typography} from 'components/Typography/Typography';
import {Avatar, Center, VStack, Skeleton} from 'native-base';
import React, {useEffect, useMemo, useState} from 'react';
import {Text, View} from 'react-native';
import {firstValueFrom, mergeMap} from 'rxjs';
import {
  checkStudentHasAttendance,
  getStudentAttendance,
  getStudentAttendanceSync,
} from 'src/database/data/attendance.data';
import CenterAttendanceModel from 'src/database/models/CenterAttendanceModel';
import UserModel from 'src/database/models/UserModel';
import {useAppSelector} from 'src/store';
import {AttendanceCard} from '../AttendanceCard/AttendanceCard';
import TestModel from 'src/database/models/TestModel';

type Props = {
  toggleSearch: boolean;
  user: UserModel;
  onSearchSuccess: () => void;
};
export const StudentAttendance = ({
  user,
  toggleSearch,
  onSearchSuccess,
}: Props) => {
  const course = useAppSelector(s => s.course.current);

  const [isLoading, setIsLoading] = useState(true);
  const [processedAttendance, setProcessedAttendance] = useState(false);

  useEffect(() => {
    if (!course) return;
    if (!toggleSearch) return;
    setIsLoading(true);
    setProcessedAttendance(false);
    checkStudentHasAttendance(user.sid, course.sid).then(() => {
      setProcessedAttendance(true);
      onSearchSuccess();
    });
  }, [toggleSearch, user.username]);

  const [attendances, setAttendances] = useState<CenterAttendanceModel[]>([]);

  useEffect(() => {
    if (!processedAttendance || !course) return;

    const subscription = getStudentAttendanceSync(
      course.classroom_id,
      user.sid,
    ).subscribe(value => {
      setAttendances(value);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [processedAttendance]);

  const picture = useMemo(() => {
    console.log('profile_picture', user.profile_photo);
    console.log('placeholder', require('assets/account.png').default);
    return !user.profile_photo || user.profile_photo === ''
      ? undefined
      : user.profile_photo;
  }, [user.profile_photo]);

  return (
    <View style={{width: '100%'}}>
      {!isLoading && (
        <Center width="100%" px="2">
          <VStack alignItems="center" space={'6px'} mb="5px">
            {/* <Skeleton size="20" rounded={'full'} isLoaded={false}> */}
            <Avatar bg={'yellow.500'} size="lg" source={{uri: picture}}>
              <Typography>
                {user.first_name[0]} {user.last_name[0]}
              </Typography>
            </Avatar>
            {/* </Skeleton> */}
            {/* <Skeleton.Text /> */}
            {/* <Skeleton h="40" w='lg'  /> */}
            <Typography fontSize={'14px'} fontWeight={'bold'}>
              {user.username}
            </Typography>
            <Typography fontSize="12px" fontWeight="600">
              {user.first_name} {user.last_name}
            </Typography>
          </VStack>
          {attendances.map(attendance => (
            <AttendanceCard key={attendance.id} attendance={attendance} />
          ))}
        </Center>
      )}
    </View>
  );
};
