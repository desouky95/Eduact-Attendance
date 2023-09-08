import { Box, Center, StyledProps } from 'native-base';
import { Select } from 'native-base';
import React, { Dispatch } from 'react';
import { useClassroomDropdown } from 'src/hooks/useClassroomDropdown';
import { useAppSelector } from 'src/store';
import Icon from 'react-native-vector-icons/MaterialIcons';

type Props = {
  onChange: Dispatch<string | null>;
};
export const AttendanceTypeFilter = ({ onChange }: Props) => {
  const current = useAppSelector(s => s.course.current);
  const { groups } = useClassroomDropdown({
    classroom_id: current?.classroom_id,
  });

  return (
    <Select
      // @ts-ignore-next-line
      optimized={false}
      mb="4"
      borderColor="cadet.main"
      borderWidth={'2'}
      backgroundColor={'white'}
      shadow={'4'}
      variant="outline"
      onValueChange={value =>
        onChange(value === '' ? null : value.toString())
      }
      placeholder="Attendance"
      dropdownOpenIcon={<SelectOpenIcon backgroundColor={'cadet.main'} />}
      dropdownIcon={<SelectOpenIcon backgroundColor={'cadet.main'} />}>
      <Select.Item label="None" value={''} />
      <Select.Item label="Center" value={'center'} />
      <Select.Item label="Online" value={'online'} />
      <Select.Item label="Absent" value={'absent'} />
    </Select>
  );
};

type SelectIconProps = Pick<StyledProps, 'backgroundColor'>;
const SelectOpenIcon = ({
  backgroundColor = 'primary.main',
}: SelectIconProps) => {
  return (
    <Box height="100%" display="flex" px={4} backgroundColor={backgroundColor}>
      <Center flex={1}>
        <Icon name="expand-more" size={24} color="white" />
      </Center>
    </Box>
  );
};
