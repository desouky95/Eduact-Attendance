import {useDatabase} from '@nozbe/watermelondb/hooks';
import {useFocusEffect} from '@react-navigation/native';
import {Typography} from 'components/Typography/Typography';
import {Avatar, Center, VStack} from 'native-base';
import React from 'react';
import {getStudentAttendanceSync} from 'src/database/data/attendance.data';
import CenterAttendanceModel from 'src/database/models/CenterAttendanceModel';
import UserModel from 'src/database/models/UserModel';
import {AttendanceCard} from 'src/screens/AttendanceScreen/components/AttendanceCard/AttendanceCard';
import {StudentGroup} from 'src/screens/AttendanceScreen/components/StudentGroup/StudentGroup';
import { HistoryCard } from '../HistoryCard/HistoryCard';

type Props = {
  student_id: string;
  classroom_id: string;
};

export const ClassroomHistory = ({classroom_id, student_id}: Props) => {
  const [attendances, setAttendances] = React.useState<CenterAttendanceModel[]>(
    [],
  );
  const [user, setUser] = React.useState<UserModel | undefined>();
  const [isLoading, setIsLoading] = React.useState(true);

  const database = useDatabase();

  const observable = database
    .get<UserModel>(UserModel.table)
    .findAndObserve(student_id);

  useFocusEffect(
    React.useCallback(() => {
      const subscription = getStudentAttendanceSync(
        Number(classroom_id),
        Number(student_id),
      ).subscribe(value => {
        setAttendances(value);
        setIsLoading(false);
        setIsLoading(false);
      });

      return () => subscription.unsubscribe();
    }, [classroom_id, student_id]),
  );

  useFocusEffect(
    React.useCallback(() => {
      const subscription = observable.subscribe(_ => {
        setUser(_);
      });
      return () => subscription.unsubscribe();
    }, []),
  );
  const picture = React.useMemo(() => {
    return !user?.profile_photo || user?.profile_photo === ''
      ? undefined
      : user?.profile_photo;
  }, [user?.profile_photo]);

  return (
    <Center width="100%" px="2" flex={1} justifyContent="flex-start">
      <VStack alignItems="center" space={'6px'} mb="5px">
        <Avatar bg={'yellow.500'} size="lg" source={{uri: picture}}>
          <Typography>
            {user?.first_name[0]} {user?.last_name[0]}
          </Typography>
        </Avatar>

        <Typography fontSize="14px" fontWeight="bold">
          {user?.first_name} {user?.last_name}
        </Typography>
        <Typography fontSize={'12px'} fontWeight={'600'}>
          {user?.username}
        </Typography>
        {user && <StudentGroup user={user} />}
      </VStack>
      {!isLoading && attendances.length === 0 && (
        <Center flex={1}>
          <Typography fontWeight="bold" fontSize="18px">
            No attendances found !!!
          </Typography>
        </Center>
      )}
      {attendances.length > 0 &&
        attendances.map(attendance => (
          <HistoryCard key={attendance.id} attendance={attendance} />
        ))}
    </Center>
  );
};
