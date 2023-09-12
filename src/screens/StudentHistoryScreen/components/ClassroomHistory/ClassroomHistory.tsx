import {useDatabase} from '@nozbe/watermelondb/hooks';
import {useFocusEffect} from '@react-navigation/native';
import {Typography} from 'components/Typography/Typography';
import {Avatar, Center, VStack, HStack, Link} from 'native-base';
import React from 'react';
import {getStudentAttendanceSync} from 'src/database/data/attendance.data';
import CenterAttendanceModel from 'src/database/models/CenterAttendanceModel';
import UserModel from 'src/database/models/UserModel';
import {AttendanceCard} from 'src/screens/AttendanceScreen/components/AttendanceCard/AttendanceCard';
import {StudentGroup} from 'src/screens/AttendanceScreen/components/StudentGroup/StudentGroup';
import {HistoryCard} from '../HistoryCard/HistoryCard';
import StudentModel from 'src/database/models/StudentModel';
import {Linking, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {theme} from 'src/theme/theme';
import { StudentEnrollmentStatus } from 'src/screens/AttendanceScreen/components/StudentEnrollmentStatus/StudentEnrollmentStatus';
type Props = {
  student_id: string;
  classroom_id: string;
};

export const ClassroomHistory = ({classroom_id, student_id}: Props) => {
  const [attendances, setAttendances] = React.useState<CenterAttendanceModel[]>(
    [],
  );
  const [user, setUser] = React.useState<UserModel | undefined>();
  const [student, setStudent] = React.useState<StudentModel | undefined>();
  const [isLoading, setIsLoading] = React.useState(true);

  const database = useDatabase();

  const observable = database
    .get<UserModel>(UserModel.table)
    .findAndObserve(student_id);

  const studentObservable = database
    .get<StudentModel>(StudentModel.table)
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
      const studentSubscription = studentObservable.subscribe(_ => {
        setStudent(_);
      });
      return () => {
        subscription.unsubscribe();
        studentSubscription.unsubscribe();
      };
    }, []),
  );
  const picture = React.useMemo(() => {
    return !user?.profile_photo || user?.profile_photo === ''
      ? undefined
      : user?.profile_photo;
  }, [user?.profile_photo]);

  return (
    <Center width="100%" px="2" flex={1} justifyContent="flex-start">
      <HStack
        width="100%"
        px={6}
        py={2}
        justifyContent="space-between"
        space={'6px'}
        bgColor={'gray.100'}
        shadow={2}
        my={2}
        borderRadius="md">
        <VStack alignItems="center" space={'6px'} mb="5px">
          <Avatar bg={'yellow.500'} size="md" source={{uri: picture}}>
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
        </VStack>
        <VStack space={2}>
          <TouchableOpacity
            onPress={() => {
              Linking.openURL(`tel:${user?.phone_number}`);
            }}>
            <HStack alignItems="center" space={1}>
              <Typography fontSize={'12px'} fontWeight={'600'}>
                Phone: {user?.phone_number}
              </Typography>
              <Icon name="call" color={theme.colors.success[500]} size={18} />
            </HStack>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              Linking.openURL(`tel:${student?.parent_phone}`);
            }}>
            <HStack alignItems="center" space={1}>
              <Typography fontSize={'12px'} fontWeight={'600'}>
                Parent: {student?.parent_phone}
              </Typography>
              <Icon name="call" color={theme.colors.success[500]} size={18} />
            </HStack>
          </TouchableOpacity>
          {user && <StudentGroup user={user} />}
          {user && (
            <StudentEnrollmentStatus user={user} classroom_id={classroom_id} />
          )}
        </VStack>
      </HStack>
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
