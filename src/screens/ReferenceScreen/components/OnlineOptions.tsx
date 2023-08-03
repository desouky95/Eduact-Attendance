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
import {useObservable} from 'src/hooks/useObservable';
import {useFormContext, Controller} from 'react-hook-form';
import {FunctionSetInputValue} from 'native-base/lib/typescript/components/composites/Typeahead/useTypeahead/types';

export const OnlineOptions = () => {
  const {current} = useAppSelector(s => s.course);

  const {control, watch, getFieldState, setValue} =
    useFormContext<ReferenceFormData>();

  const classroom_id = watch('online_classroom_id');
  const course_id = watch('online_course_id');
  const {classrooms, courses, tests} = useClassroomDropdown({
    classroom_id: classroom_id ?? undefined,
    course_id: course_id ?? undefined,
  });

  useEffect(() => {
    if (getFieldState('online_classroom_id').isDirty) {
      setValue('online_course_id', null);
    }
  }, [classroom_id]);

  useEffect(() => {
    if (getFieldState('online_course_id').isDirty) {
      setValue('online_quiz_id', null);
      setValue('online_homework_id', null);
    }
  }, [course_id]);

  return (
    <View>
      <Box>
        <Typography fontWeight="bold">Online Lecture Reference</Typography>
        <Spacer mb={'10px'} />
        {current && (
          <VStack space={'8px'} px="20px">
            <Box>
              <FormControl.Label>Classroom</FormControl.Label>
              <Controller
                control={control}
                name="online_classroom_id"
                render={({field: {value, onChange}}) => (
                  <Select
                    defaultValue={value?.toString() ?? ''}
                    selectedValue={value?.toString() ?? ''}
                    onValueChange={value => onChange(parseInt(value))}
                    variant="outline"
                    dropdownOpenIcon={<SelectOpenIcon />}
                    dropdownIcon={<SelectOpenIcon />}
                    borderColor="primary.main"
                    borderWidth={'2'}
                    backgroundColor={'white'}
                    shadow={'4'}>
                    {classrooms?.map(test => (
                      <Select.Item
                        key={test?.id}
                        label={test?.title}
                        value={test?.sid.toString()}
                      />
                    ))}
                  </Select>
                )}
              />
            </Box>
            <Box>
              <FormControl.Label>Lecture</FormControl.Label>
              <Controller
                control={control}
                name="online_course_id"
                render={({field: {value, onChange}}) => (
                  <Select
                    defaultValue={value?.toString() ?? ''}
                    selectedValue={value?.toString() ?? ''}
                    onValueChange={value => onChange(parseInt(value))}
                    variant="outline"
                    dropdownOpenIcon={<SelectOpenIcon />}
                    dropdownIcon={<SelectOpenIcon />}
                    borderColor="primary.main"
                    borderWidth={'2'}
                    backgroundColor={'white'}
                    shadow={'4'}>
                    {courses?.map(test => (
                      <Select.Item
                        key={test?.id}
                        label={test?.name}
                        value={test?.sid.toString()}
                      />
                    ))}
                  </Select>
                )}
              />
            </Box>

            <Box>
              <FormControl.Label>Quiz</FormControl.Label>
              <Controller
                control={control}
                name="online_quiz_id"
                render={({field: {value, onChange}}) => (
                  <Select
                    defaultValue={value?.toString() ?? ''}
                    selectedValue={value?.toString() ?? ''}
                    onValueChange={value => onChange(parseInt(value))}
                    variant="outline"
                    dropdownOpenIcon={<SelectOpenIcon />}
                    dropdownIcon={<SelectOpenIcon />}
                    borderColor="primary.main"
                    borderWidth={'2'}
                    backgroundColor={'white'}
                    shadow={'4'}>
                    {tests?.map(test => (
                      <Select.Item
                        key={test?.id}
                        label={test?.name}
                        value={test?.id.toString()}
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
                name="online_homework_id"
                render={({field: {value, onChange}}) => {
                  return (
                    <Select
                      defaultValue={value?.toString() ?? ''}
                      selectedValue={value?.toString() ?? ''}
                      onValueChange={value => onChange(parseInt(value))}
                      variant="outline"
                      dropdownOpenIcon={<SelectOpenIcon />}
                      dropdownIcon={<SelectOpenIcon />}
                      borderWidth={'2'}
                      backgroundColor={'white'}
                      shadow={'4'}
                      borderColor="primary.main">
                      {tests?.map(test => (
                        <Select.Item
                          key={test?.id}
                          label={test?.name}
                          value={test?.id.toString()}
                        />
                      ))}
                    </Select>
                  );
                }}
              />
            </Box>
          </VStack>
        )}
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
