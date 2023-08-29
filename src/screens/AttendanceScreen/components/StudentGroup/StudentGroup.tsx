import React from 'react';
import {View} from 'react-native';
import UserModel from 'src/database/models/UserModel';
import withObservables from '@nozbe/with-observables';
import {useDatabase} from '@nozbe/watermelondb/hooks';
import EnrolledClassroomModel from 'src/database/models/EnrolledClassroomModel';
import {Q} from '@nozbe/watermelondb';
import {useObservableState} from 'observable-hooks';
import {mergeMap} from 'rxjs';
import GroupModel from 'src/database/models/GroupModel';
import {Typography} from 'components/Typography/Typography';
type StudentGroupProps = {
  user: UserModel;
};

export const StudentGroup = ({user}: StudentGroupProps) => {
  const database = useDatabase();
  const group = database
    .get<GroupModel>(GroupModel.table)
    .query(Q.on(EnrolledClassroomModel.table, 'user_id', user.id))
    .observe();
  const [value] = useObservableState<GroupModel>(input$ =>
    group.pipe(mergeMap(s => s)),
  );

  return (
    <Typography fontSize={'12px'} fontWeight={'600'}>
      {value?.name}
    </Typography>
  );
};

const enhanced = withObservables<{user: UserModel}, any>(['user'], ({user}) => {
  return {
    group: user.enroll_classroom,
  };
});
