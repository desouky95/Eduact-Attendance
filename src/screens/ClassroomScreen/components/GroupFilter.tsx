import {Select} from 'native-base';
import React, {Dispatch} from 'react';
import {useClassroomDropdown} from 'src/hooks/useClassroomDropdown';
import {useAppSelector} from 'src/store';

type Props = {
  onChange: Dispatch<number>;
};
export const GroupsFilter = ({onChange}: Props) => {
  const current = useAppSelector(s => s.course.current);
  const {groups} = useClassroomDropdown({
    classroom_id: current?.classroom_id,
  });

  return (
    <Select onValueChange={value => onChange(Number(value))}>
      {groups?.map(group => (
        <Select.Item label={group.name} value={group.id} key={group.id} />
      ))}
    </Select>
  );
};
