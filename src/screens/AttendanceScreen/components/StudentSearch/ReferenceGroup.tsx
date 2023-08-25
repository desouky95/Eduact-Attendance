import {Box, Flex} from 'native-base';
import React from 'react';
import UserModel from 'src/database/models/UserModel';
import {compose} from 'recompose';
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
import { HStack } from 'native-base';

type ReferenceGroupUIProps = {
  user?: UserModel;
};

export const ReferenceGroup = ({user}: ReferenceGroupUIProps) => {
  const {currentReference, currentClassroom} = useAppSelector(s => s.course);

  const [isSameGroup, setIsSameGroup] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);
  React.useEffect(() => {
    if (!currentReference?.group_id || !user) {
      setLoaded(true);
      return;
    }
    setLoaded(false);
    const subscription = database
      .get<EnrolledClassroomModel>(EnrolledClassroomModel.table)
      .findAndObserve(`${user.id}-${currentClassroom?.id}`)
      .subscribe(value => {
        setIsSameGroup(
          value.group_id === currentReference.group_id?.toString(),
        );
        setLoaded(true);
      });
      return () => subscription.unsubscribe()
  }, [user]);

  return (
    <Center>
      <Box
        px="4"
        py="3"
        mb="4"
        width="1/2"
        bgColor="dark.300"
        borderRadius="8"
        color="light">
        {!currentReference?.group_id && (
          <Center>
            <Typography color="#FFF">No Group Selected</Typography>
          </Center>
        )}
        {currentReference?.group_id && (
          <HStack alignItems="center" justifyContent='space-between'>
            <Typography color="#FFF">Reference Group</Typography>
            {isSameGroup && <Icon size={20} color="lightgreen" name="checkbox-marked-circle-outline" />}
            {!isSameGroup && <Icon size={20} color="red" name="cancel" />}
          </HStack>
        )}
      </Box>
    </Center>
  );
};
