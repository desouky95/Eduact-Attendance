import React from 'react';
import {View} from 'react-native';
import UserModel from 'src/database/models/UserModel';
import withObservables from '@nozbe/with-observables';
import {useDatabase} from '@nozbe/watermelondb/hooks';
import EnrolledClassroomModel from 'src/database/models/EnrolledClassroomModel';
import {Q} from '@nozbe/watermelondb';
import {useObservableState} from 'observable-hooks';
import {mergeMap} from 'rxjs';
import {Typography} from 'components/Typography/Typography';
import {useAppSelector} from 'src/store';
import {theme} from 'src/theme/theme';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { HStack } from 'native-base';
type StudentGroupProps = {
  user: UserModel;
  classroom_id?: string;
};

export const StudentEnrollmentStatus = ({
  user,
  classroom_id,
}: StudentGroupProps) => {
  const {current} = useAppSelector(s => s.course);
  const database = useDatabase();
  const enrollment = database
    .get<EnrolledClassroomModel>(EnrolledClassroomModel.table)
    .query(
      Q.and(
        Q.where('user_id', user.id),
        Q.where(
          'classroom_id',
          classroom_id ?? current?.classroom_id?.toString(),
        ),
      ),
    )
    .observe();
  const [value] = useObservableState<EnrolledClassroomModel>(input$ =>
    enrollment.pipe(mergeMap(s => s)),
  );

  return (
    <>
      {!value?.active && (
        <HStack space={2}>
          <Typography
            fontSize={'12px'}
            fontWeight={'600'}
            color={theme.colors.error[500]}>
            Banned
          </Typography>
          <Icon name={'cancel'} color={theme.colors.error[400]} size={18} />
        </HStack>
      )}
    </>
  );
};

const enhanced = withObservables<{user: UserModel}, any>(['user'], ({user}) => {
  return {
    group: user.enroll_classroom,
  };
});
