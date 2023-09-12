import {Q} from '@nozbe/watermelondb';
import {Typography} from 'components/Typography/Typography';
import {Avatar, Center, VStack, Skeleton, HStack} from 'native-base';
import React, {useEffect, useMemo, useState} from 'react';
import {Text, View, useWindowDimensions} from 'react-native';
import {firstValueFrom, mergeMap} from 'rxjs';
import {
  checkStudentHasAttendance,
  getStudentAttendanceSync,
} from 'src/database/data/attendance.data';
import CenterAttendanceModel from 'src/database/models/CenterAttendanceModel';
import UserModel from 'src/database/models/UserModel';
import {useAppSelector} from 'src/store';
import {AttendanceCard} from '../AttendanceCard/AttendanceCard';
import TestModel from 'src/database/models/TestModel';
import {StudentGroup} from '../StudentGroup/StudentGroup';
import WithObservables from '@nozbe/with-observables';
import StudentModel from 'src/database/models/StudentModel';
import {StudentEnrollmentStatus} from '../StudentEnrollmentStatus/StudentEnrollmentStatus';
import {Linking, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {theme} from 'src/theme/theme';
import {useObservableState} from 'observable-hooks';
type UIProps = {
  student?: StudentModel;
} & BaseProps;

type BaseProps = {
  toggleSearch: boolean;
  user: UserModel;
  onSearchSuccess: () => void;
};
export const StudentAttendanceUI = ({
  user,
  toggleSearch,
  onSearchSuccess,
  student,
}: UIProps) => {
  const course = useAppSelector(s => s.course.current);

  const [isLoading, setIsLoading] = useState(true);
  const [processedAttendance, setProcessedAttendance] = useState(false);

  useEffect(() => {
    if (!course) return;
    if (!toggleSearch) return;
    setIsLoading(true);
    setProcessedAttendance(false);
    checkStudentHasAttendance(user.sid, Number(course.id)).then(() => {
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
    return !user.profile_photo || user.profile_photo === ''
      ? undefined
      : user.profile_photo;
  }, [user.profile_photo]);

  const {fontScale ,width} = useWindowDimensions();

  return (
    <View style={{width: '100%'}}>
      {!isLoading && (
        <Center width="100%" px="2">
          <HStack
            width="100%"
            px={width * 0.02}
            py={2}
            justifyContent="space-between"
            space={'6px'}
            bgColor={'gray.100'}
            shadow={2}
            my={2}
            borderRadius="md">
            <VStack alignItems="center" space={'6px'} mb="5px">
              <Avatar bg={'yellow.500'} size="md" source={{uri: picture}}>
                <Typography fontSize={fontScale * 16}>
                  {user.first_name[0]} {user.last_name[0]}
                </Typography>
              </Avatar>

              <Typography fontSize={fontScale * 14} fontWeight="bold">
                {user.first_name} {user.last_name}
              </Typography>
              <Typography fontSize={fontScale * 12} fontWeight={'600'}>
                {user.username}
              </Typography>
            </VStack>
            <VStack space={2}>
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL(`tel:${user?.phone_number}`);
                }}>
                <HStack alignItems="center" space={1}>
                  <Typography fontSize={fontScale * 12} fontWeight={'600'}>
                    Phone: {user?.phone_number}
                  </Typography>
                  <Icon
                    name="call"
                    color={theme.colors.success[500]}
                    size={18}
                  />
                </HStack>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL(`tel:${student?.parent_phone}`);
                }}>
                <HStack alignItems="center" space={1}>
                  <Typography fontSize={fontScale * 12} fontWeight={'600'}>
                    Parent: {student?.parent_phone}
                  </Typography>
                  <Icon
                    name="call"
                    color={theme.colors.success[500]}
                    size={18}
                  />
                </HStack>
              </TouchableOpacity>
              <StudentGroup user={user} />
              <StudentEnrollmentStatus user={user} />
            </VStack>
          </HStack>
          {attendances.map(attendance => (
            <AttendanceCard key={attendance.id} attendance={attendance} />
          ))}
        </Center>
      )}
    </View>
  );
};

const enhanced = WithObservables(['user'], ({user}) => {
  return {
    user,
    student: user.student,
  };
});

export const StudentAttendance = enhanced(StudentAttendanceUI);
