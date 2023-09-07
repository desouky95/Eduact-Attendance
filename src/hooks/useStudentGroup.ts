import {useDatabase} from '@nozbe/watermelondb/hooks';
import React from 'react';
import EnrolledClassroomModel from 'src/database/models/EnrolledClassroomModel';
import {useAppSelector} from 'src/store';

type UseStudentGroupArgs = {
  user_id?: string;
};

export const useStudentGroup = ({user_id}: UseStudentGroupArgs) => {
  const {currentReference, currentClassroom} = useAppSelector(s => s.course);

  const database = useDatabase();
  const [isSameGroup, setIsSameGroup] = React.useState(false);
  const [isLoading, setLoading] = React.useState(true);
  React.useEffect(() => {
    if (!currentReference?.group_id) {
      setLoading(false);
      return;
    }
    if (!user_id) {
      return;
    }
    setLoading(true);
    const subscription = database
      .get<EnrolledClassroomModel>(EnrolledClassroomModel.table)
      .findAndObserve(`${user_id}-${currentClassroom?.id}`)
      .subscribe(value => {
        setIsSameGroup(
          value.group_id === currentReference.group_id?.toString(),
        );
        setLoading(false);
      });
    return () => subscription.unsubscribe();
  }, [user_id, currentReference?.group_id]);

  return {
    isSameGroup,
    noGroupRef: !currentReference?.group_id,
    isLoading,
  };
};
