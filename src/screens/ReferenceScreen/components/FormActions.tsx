import {Typography} from 'components/Typography/Typography';
import {Button, HStack} from 'native-base';
import React from 'react';
import {View} from 'react-native';
import {theme} from 'src/theme/theme';
import {useFormContext} from 'react-hook-form';
import {saveReference} from 'src/database/data/reference.data';
import CourseReferenceModel from 'src/database/models/CourseReferenceModel';
import {database} from 'src/database';
export const FormActions = ({reference}: {reference: CourseReferenceModel}) => {
  const {
    handleSubmit,
    formState: {isDirty},
    reset,
    getValues,
  } = useFormContext<ReferenceFormData>();

  const handleSubmitForm = handleSubmit(async (formData: ReferenceFormData) => {
    try {
      const updated = await reference.save(formData);
      reset({
        center_course_id: updated.center_course_id,
        homework_id: updated.homework_id,
        quiz_id: updated.quiz_id,
        online_classroom_id: updated.online_classroom_id,
        online_course_id: updated.online_course_id,
        online_homework_id: updated.online_homework_id,
        online_quiz_id: updated.online_quiz_id,
        course_id: updated.course_id,
        group_id: updated.group_id,
        id: updated.id,
      });
    } catch (error) {
      console.error(error);
    }
  });

  const handleClearRef = async () => {
    const updated = await reference.clear();
    reset({
      center_course_id: null,
      homework_id: null,
      group_id: null,
      online_classroom_id: null,
      online_course_id: null,
      online_homework_id: null,
      online_quiz_id: null,
      quiz_id: null,
      course_id: updated.course_id,
      id: updated.id,
    });
  };
  return (
    <View>
      <HStack py="18" px="44" space="12px">
        <Button
          borderColor={'primary.main'}
          color="primary.main"
          outlineColor={'aqua'}
          backgroundColor={'primary.main'}
          size="md"
          height="10"
          borderRadius={'100px'}
          _pressed={{opacity: 0.8}}
          width={'1/3'}
          isDisabled={!isDirty}
          onPress={handleSubmitForm}>
          <Typography fontWeight={'bold'} color="#FFF">
            Save
          </Typography>
        </Button>
        <Button
          onPress={() => reset()}
          colorScheme={'orange'}
          borderColor={'orange.500'}
          color="orange.main"
          outlineColor={'aqua'}
          isDisabled={!isDirty}
          size="md"
          height="10"
          borderRadius={'100px'}
          _pressed={{opacity: 0.8}}
          width={'1/3'}
          variant={'outline'}>
          <Typography fontWeight={'bold'} color={theme.colors.warning[500]}>
            Cancel
          </Typography>
        </Button>
        <Button
          onPress={() => handleClearRef()}
          colorScheme={'muted'}
          borderColor={'muted.500'}
          color="muted.main"
          outlineColor={'aqua'}
          // isDisabled={!isDirty}
          size="md"
          height="10"
          borderRadius={'100px'}
          _pressed={{opacity: 0.8}}
          width={'1/3'}
          variant={'outline'}>
          <Typography fontWeight={'bold'} color={theme.colors.muted[500]}>
            Clear
          </Typography>
        </Button>
      </HStack>
    </View>
  );
};
