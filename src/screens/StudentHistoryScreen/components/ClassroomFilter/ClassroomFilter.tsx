import {Box, Center, StyledProps} from 'native-base';
import {Select} from 'native-base';
import React, {Dispatch, useState} from 'react';
import {useAppSelector} from 'src/store';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ClassroomModel from 'src/database/models/Classroom';
import {useDatabase} from '@nozbe/watermelondb/hooks';
import {useFocusEffect} from '@react-navigation/native';

type Props = {
  onChange: Dispatch<string | undefined>;
};
export const ClassroomFilter = ({onChange}: Props) => {
  const [classrooms, setClassrooms] = useState<ClassroomModel[]>([]);

  const database = useDatabase();

  const observable = database
    .get<ClassroomModel>(ClassroomModel.table)
    .query()
    // Q.and(Q.where('type', 'center'))
    .observe();

  useFocusEffect(
    React.useCallback(() => {
      const subscription = observable.subscribe(_ => {
        setClassrooms(_);
      });

      return () => subscription.unsubscribe();
    }, []),
  );
  return (
    <Select
      mb="4"
      borderColor="cadet.main"
      borderWidth={'2'}
      backgroundColor={'white'}
      shadow={'4'}
      variant="outline"
      onValueChange={value => onChange(value)}
      dropdownOpenIcon={<SelectOpenIcon backgroundColor={'cadet.main'} />}
      dropdownIcon={<SelectOpenIcon backgroundColor={'cadet.main'} />}>
      <Select.Item label="None" value={''} />
      {classrooms?.map(classroom => (
        <Select.Item
          key={classroom.id}
          label={classroom.title}
          value={classroom.id}
        />
      ))}
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
