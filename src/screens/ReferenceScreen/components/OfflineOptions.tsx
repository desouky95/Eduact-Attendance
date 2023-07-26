import {CheckIcon, SunIcon, StyledProps, HStack, VStack} from 'native-base';
import {Center} from 'native-base';
import {FormControl, Box} from 'native-base';
import {Select} from 'native-base';
import React, {useEffect} from 'react';
import {View} from 'react-native';
import {useClassroomDropdown} from 'src/hooks/useClassroomDropdown';
import {useAppSelector} from 'src/store';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useForm} from 'react-hook-form';
import {Typography} from 'components/Typography/Typography';
import {Spacer} from 'components/Spacer/Spacer';
import {useFormContext, Controller} from 'react-hook-form';
import {useObservable} from 'src/hooks/useObservable';
import {mergeMap, first} from 'rxjs';
import {bind, Subscribe} from '@react-rxjs/core';
import {useObservableState} from 'observable-hooks';

export const OfflineOptions = () => {
  const {current} = useAppSelector(s => s.course);

  const {control, watch, getFieldState, setValue} =
    useFormContext<ReferenceFormData>();
  const course_id = watch('center_course_id');
  const {courses, tests, groups} = useClassroomDropdown({
    classroom_id: current?.classroom_id,
    course_id: course_id ?? undefined,
  });

  useEffect(() => {
    if (getFieldState('center_course_id').isDirty) {
      setValue('quiz_id', null);
      setValue('homework_id', null);
    }
  }, [course_id]);

  return (
    <View>
      <Box px="20px" mb="10px">
        <FormControl.Label>Group</FormControl.Label>

        <Controller
          control={control}
          name="group_id"
          render={({field: {value, onChange}}) => {
            return (
              <Select
                borderColor="cadet.main"
                borderWidth={'2'}
                backgroundColor={'white'}
                shadow={'4'}
                variant="outline"
                defaultValue={value?.toString() ?? ''}
                selectedValue={value?.toString() ?? ''}
                onValueChange={value => onChange(parseInt(value))}
                dropdownOpenIcon={
                  <SelectOpenIcon backgroundColor={'cadet.main'} />
                }
                dropdownIcon={
                  <SelectOpenIcon backgroundColor={'cadet.main'} />
                }>
                {groups?.map(course => (
                  <Select.Item
                    key={course.id}
                    label={course.name}
                    value={course?.sid.toString()}
                  />
                ))}
              </Select>
            );
          }}
        />
      </Box>
      <Box>
        <Typography fontWeight="bold">Center Lecture Reference</Typography>
        <Spacer mb={'10px'} />
        <VStack space={'8px'} px="20px">
          {current && (
            <Box>
              <FormControl.Label>Lecture</FormControl.Label>

              <Controller
                control={control}
                name="center_course_id"
                render={({field: {value, onChange}}) => {
                  return (
                    <Select
                      borderColor="cadet.main"
                      borderWidth={'2'}
                      backgroundColor={'white'}
                      shadow={'4'}
                      variant="outline"
                      defaultValue={value?.toString() ?? ''}
                      selectedValue={value?.toString() ?? ''}
                      onValueChange={value => onChange(parseInt(value))}
                      dropdownOpenIcon={
                        <SelectOpenIcon backgroundColor={'cadet.main'} />
                      }
                      dropdownIcon={
                        <SelectOpenIcon backgroundColor={'cadet.main'} />
                      }>
                      {courses?.map(course => (
                        <Select.Item
                          key={course.id}
                          label={course.name}
                          value={course?.sid.toString()}
                        />
                      ))}
                    </Select>
                  );
                }}
              />
            </Box>
          )}

          <Box>
            <FormControl.Label>Quiz</FormControl.Label>

            <Controller
              control={control}
              name="quiz_id"
              render={({field: {value, onChange}}) => (
                <Select
                  defaultValue={value?.toString() ?? ''}
                  selectedValue={value?.toString() ?? ''}
                  onValueChange={value => onChange(parseInt(value))}
                  variant="outline"
                  dropdownOpenIcon={
                    <SelectOpenIcon backgroundColor={'cadet.main'} />
                  }
                  dropdownIcon={
                    <SelectOpenIcon backgroundColor={'cadet.main'} />
                  }
                  borderColor="cadet.main"
                  borderWidth={'2'}
                  backgroundColor={'white'}
                  shadow={'4'}>
                  {tests?.map(test => (
                    <Select.Item
                      key={test?.unit.id}
                      label={test?.test.title}
                      value={test?.unit.sid.toString()}
                    />
                  ))}
                </Select>
              )}
            />
          </Box>
          <Box>
            <FormControl.Label>H.W</FormControl.Label>
            <Controller
              control={control}
              name="homework_id"
              render={({field: {value, onChange}}) => (
                <Select
                  defaultValue={value?.toString() ?? ''}
                  selectedValue={value?.toString() ?? ''}
                  onValueChange={value => onChange(parseInt(value))}
                  variant="outline"
                  dropdownOpenIcon={
                    <SelectOpenIcon backgroundColor={'cadet.main'} />
                  }
                  dropdownIcon={
                    <SelectOpenIcon backgroundColor={'cadet.main'} />
                  }
                  borderWidth={'2'}
                  backgroundColor={'white'}
                  shadow={'4'}
                  borderColor="cadet.main">
                  {tests?.map(test => (
                    <Select.Item
                      key={test?.unit.id}
                      label={test?.test.title}
                      value={test?.unit.sid.toString()}
                    />
                  ))}
                </Select>
              )}
            />
          </Box>
        </VStack>
      </Box>
    </View>
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
