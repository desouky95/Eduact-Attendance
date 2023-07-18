import {CheckIcon, SunIcon, StyledProps} from 'native-base';
import {Center} from 'native-base';
import {FormControl, Box} from 'native-base';
import {Select} from 'native-base';
import React from 'react';
import {View} from 'react-native';
import {useClassroomDropdown} from 'src/hooks/useClassroomDropdown';
import {useAppSelector} from 'src/store';
import Icon from 'react-native-vector-icons/MaterialIcons';

export const OfflineOptions = () => {
  const {current} = useAppSelector(s => s.course);

  const {classrooms, courses, tests} = useClassroomDropdown({
    classroom_id: current?.classroom_id,
    course_id: current?.sid,
  });

  return (
    <View>
      {current && (
        <Select isDisabled selectedValue={current?.sid.toString()}>
          <Select.Item label={current?.name} value={current?.sid.toString()} />
        </Select>
      )}

      {/* <FormControl> */}
      <FormControl.Label>Quiz</FormControl.Label>
      <Select
        variant="outline"
        dropdownOpenIcon={<SunIcon />}
        dropdownIcon={<SelectOpenIcon />}
        // _selectedItem={{
        //   bg: 'teal.600',
        //   endIcon: <CheckIcon size={5} />,
        // }}

        //   borderWidth={'2'}
        //   borderColor="cadet.main"
      >
        {tests?.map(test => (
          <Select.Item
            key={test?.id}
            label={test?.title}
            value={test?.sid.toString()}
          />
        ))}
      </Select>
      {/* </FormControl> */}
    </View>
  );
};

type SelectIconProps = Pick<StyledProps, 'backgroundColor'>;
const SelectOpenIcon = ({
  backgroundColor = 'primary.main',
}: SelectIconProps) => {
  return (
    <Box
      height="100%"
      display="flex"
      px={4}
      //   alignItems="center"
      //   justifyContent="center"
      alignItems={'end'}
      backgroundColor={backgroundColor}>
      <Center >
        <Icon name="expand-more" size={24} color="white" />
      </Center>
    </Box>
  );
};
