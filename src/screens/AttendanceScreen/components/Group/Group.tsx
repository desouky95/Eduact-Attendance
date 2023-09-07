import {Box, Flex} from 'native-base';
import React, {useState} from 'react';
import UserModel from 'src/database/models/UserModel';
import withObservables from '@nozbe/with-observables';
import EnrolledClassroomModel from 'src/database/models/EnrolledClassroomModel';
import GroupModel from 'src/database/models/GroupModel';
import {zip} from 'rxjs';
import StudentModel from 'src/database/models/StudentModel';
import {useAppSelector} from 'src/store';
import {database} from 'src/database';
import {Typography} from 'components/Typography/Typography';
import {Center} from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {HStack} from 'native-base';
import {useFocusEffect} from '@react-navigation/native';

type ReferenceGroupUIProps = {
  user?: UserModel;
};

export const Group = () => {
  const {currentReference, currentClassroom} = useAppSelector(s => s.course);

  const [group, setGroup] = useState<GroupModel | undefined>();
  const [loaded, setLoaded] = React.useState(false);

  useFocusEffect(
    React.useCallback(() => {
      if (!currentReference?.group_id) {
        setLoaded(true);
        return;
      }
      setLoaded(false);
      const subscription = database
        .get<GroupModel>(GroupModel.table)
        .findAndObserve(`${currentReference?.group_id}`)
        .subscribe(value => {
          setGroup(value);
          setLoaded(true);
        });
      return () => subscription.unsubscribe();
    }, []),
  );

  return <Center mb="2">{group?.name}</Center>;
};
